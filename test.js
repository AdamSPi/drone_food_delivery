var arDrone = require('ar-drone');
var client = arDrone.createClient();
var control = arDrone.createUdpControl();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function repeat(action, duration) {
    var live = true;
    setTimeout(
        function () {
            live = false;
            console.log("Stop");
        }, duration);

    while (live) {
        action();
        await sleep(1000);
    }
}

/*
async function me_irl() {
    await repeat(function(){
        console.log('Meme');
    }, 5000)
}
async function main() {
    await me_irl();
    await me_irl();
}
main();
*/

async function takeoff() {
    await repeat(
        function() {
            console.log('takeoff');
        }, 3000);
    await stabilize(1000);
}

function navdata_to_speed(val) {
    // (-2) pitch -> front(.5)
    return val/(-4);
};

async function stabilize(duration, controller = control) {
    await repeat(
        function() {
            console.log('stabilize');
        }, duration);
}

async function move_forward(duration, controller = control){
    await repeat(
        function() {
            console.log('move_forward');
        }, duration);
    await stabilize(1000);
}

async function move_backward(duration, controller = control){
    await repeat(
        function() {
            console.log('move_backward');
        }, duration);
    await stabilize(1000);
}

async function move_left(duration, controller = control){
    await repeat(
        function() {
            console.log('move_left');
        }, duration);
    await stabilize(1000);
}

async function move_right(duration, controller = control){
    await repeat(
        function() {
            console.log('move_right');
        }, duration);
    await stabilize(1000);
}

async function mission_engage(mission) {
    await takeoff();
    await move_forward(2000);
    await move_backward(2000);
    await move_right(2000);
    await move_left(2000);
}

mission_engage();