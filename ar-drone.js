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

setInterval(
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
    }, 30);

function navdata_to_speed(val) {
    // (-2) pitch -> front(.5)
    return val/(-4);
};

function stabilize(controller, duration) {
    setInterval(function() {
        maneuver = { front: -navdata_to_speed(pitch),
                     left: -navdata_to_speed(roll) };
        controller.pcmd(maneuver);
        controller.flush();
    }, duration);
    setInterval(function() {
        controller.pcmd();
        controller.flush()
    }, 30);
}

function move_forward(controller, duration){
    setInterval(function() {
        maneuver = { front: .5,
                     left: -navdata_to_speed(roll) };
        controller.pcmd(maneuver);
        controller.flush();
    }, duration);
}

function move_backward(controller, duration){
    setInterval(function() {
        maneuver = { back: .5,
                     left: -navdata_to_speed(roll) };
        controller.pcmd(maneuver);
        controller.flush();
    }, duration);
}

function move_left(controller, duration){
    setInterval(function() {
        maneuver = { left: .5,
                     front: -navdata_to_speed(pitch) };
        controller.pcmd(maneuver);
        controller.flush();
    }, duration);
}

function move_right(controller, duration){
    setInterval(function() {
        maneuver = { right: .5,
                     front: -navdata_to_speed(pitch) };
        controller.pcmd(maneuver);
        controller.flush();
    }, duration);
}