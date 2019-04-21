var arDrone = require('ar-drone');
var client = arDrone.createClient();
var control = arDrone.createUdpControl();

var pitch = 0;
var roll = 0;
var yaw = 0;
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
        if (!flying)
            yaw = navdata.demo.rotation.yaw;
        pitch = navdata.demo.rotation.pitch;
        roll = navdata.demo.rotation.roll;
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
        controller.pcmd();
        controller.flush()
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
        }, 3000);
    await stabilize(1500);
}

function navdata_to_speed(val) {
    // (-2) pitch -> front(.5)
    return val/(-4);
};

async function stabilize(duration, controller = control) {
    await repeat(
        function() {
            maneuver = { front: -navdata_to_speed(pitch),
                         left: -navdata_to_speed(roll) };
            controller.pcmd(maneuver);
            controller.flush();
        }, duration);
}

async function move_forward(duration, controller = control){
    await repeat(
        function() {
            maneuver = { front: .5,
                         left: -navdata_to_speed(roll) };
            controller.pcmd(maneuver);
            controller.flush();
        }, duration);
    await stabilize(1500);
}

async function move_backward(duration, controller = control){
    await repeat(
        function() {
            maneuver = { back: .5,
                         left: -navdata_to_speed(roll) };
            controller.pcmd(maneuver);
            controller.flush();
        }, duration);
    await stabilize(1500);
}

async function move_left(duration, controller = control){
    await repeat(
        function() {
            maneuver = { left: .5,
                         front: -navdata_to_speed(pitch) };
            controller.pcmd(maneuver);
            controller.flush();
        }, duration);
    await stabilize(1500);
}

async function move_right(duration, controller = control){
    await repeat(
        function() {
            maneuver = { right: .5,
                         front: -navdata_to_speed(pitch) };
            controller.pcmd(maneuver);
            controller.flush();
        }, duration);
    await stabilize(1500);
}
/* I know why everyone hates on js now */
async function mission_engage() {
    await takeoff();
    await move_forward(2000);
    await move_right(2000);
    await move_backward(2000);
    await move_left(2000);
}

mission_engage();