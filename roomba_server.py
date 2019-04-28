from flask import Flask, request, json
import subprocess
import requests

@app.route('/start')
def start():
    # Raspberry pi told us to start
	subprocess.Popen(['python', 'roomba_control.js'])
    print('Got start request from raspberrypi')
    return "Success"