var arDrone = require('ar-drone');

var client = new arDrone.Client();
var control = new arDrone.UdpControl();

var pitch = 0;
var roll = 0;
var yaw = 0;

var init_yaw = 0;
var flying = false;

client.config('general:navdata_demo', 'FALSE');

// negative pitch is forward
// positive pitch is backward
// negative roll is left
// positive roll is right
// negative yaw is ccw
// positive yaw is cw
client.on('navdata', function(navdata) {
    if(navdata.rawMeasures && navdata.demo && navdata.pwm){
        if (!flying) init_yaw = navdata.demo.rotation.yaw;
        pitch = navdata.demo.rotation.pitch;
        roll = navdata.demo.rotation.roll;
        yaw = navdata.demo.rotation.yaw;
        flying = true;
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function repeat(action, duration) {
    var live = true;
    setTimeout(function () {
        live = false;
        control.pcmd();
        control.flush()
    }, duration);

    while (live) {
        action();
        await sleep(30);
    }
}

// Take off
async function takeoff() {
    await repeat(
        function() {
            // The emergency: true option recovers your drone from emergency mode that can
            // be caused by flipping it upside down or the drone crashing into something.
            // In a real program you probably only want to send emergency: true for one
            // second in the beginning, otherwise your drone may attempt to takeoff again
            // after a crash.
            control.ref({fly: true, emergency: true});
            // This command makes sure your drone hovers in place and does not drift.
            control.pcmd();
            // This causes the actual udp message to be send (multiple commands are
            // combined into one message)
            control.flush();
        }, 5000);
    await stabilize(2000);
}

async function land() {
    await repeat(
        function() {
            control.ref({fly: false, emergency: false});
            control.pcmd();
            control.flush();
        }, 3000);
}

function navdata_to_speed(val) {
    // (-2) pitch -> front(.5)
    return val/(-3);
};

async function stabilize(duration) {
    while(1) {
        if (((init_yaw-2) <= yaw) && (yaw <= (init_yaw+2))) break;
        if (yaw < init_yaw) {
            await repeat(
                function() {
                    control.pcmd({clockwise: .1});
                    control.flush();
                }, 500);
        }
        else if (yaw > init_yaw) {
            await repeat(
                function() {
                    control.pcmd({counterclockwise: .1});
                    control.flush();
                }, 500);
        }
    }
    await repeat(
        function() {
            maneuver = { front: -navdata_to_speed(pitch),
                         left: -navdata_to_speed(roll) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
}

async function ascend(duration){
    await repeat(
        function() {
            maneuver = { up: .2,
                         left: -navdata_to_speed(roll),
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
}

async function descend(duration){
    await repeat(
        function() {
            maneuver = { up: -.2,
                         left: -navdata_to_speed(roll),
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
}

async function move_forward(duration){
    await repeat(
        function() {
            maneuver = { front: .5,
                         left: -navdata_to_speed(roll) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
    await repeat(
        function() {
            maneuver = { front: -.65,
                         left: -navdata_to_speed(roll) };
            control.pcmd(maneuver);
            control.flush();
        }, 500);
}

async function move_backward(duration){
    await repeat(
        function() {
            maneuver = { back: .5,
                         left: -navdata_to_speed(roll) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
    await repeat(
        function() {
            maneuver = { back: -.65,
                         left: -navdata_to_speed(roll) };
            control.pcmd(maneuver);
            control.flush();
        }, 500);
}

async function move_left(duration){
    await repeat(
        function() {
            maneuver = { left: .5,
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
    await repeat(
        function() {
            maneuver = { left: -.65,
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, 500);
}

async function move_right(duration){
    await repeat(
        function() {
            maneuver = { right: .5,
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, duration);
    await repeat(
        function() {
            maneuver = { right: -.65,
                         front: -navdata_to_speed(pitch) };
            control.pcmd(maneuver);
            control.flush();
        }, 500);
}
/* I know why everyone hates on js now */
async function mission_engage() {
    await takeoff();
    //await descend(500);
    await move_forward(2000);
    await stabilize(2000);
    // await move_right(2000);
    await move_backward(2000);
    // await move_left(2000);
    await stabilize(2000);
    await land();
}
async function main() {
    await mission_engage();
    process.exit();
}

main();