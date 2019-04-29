from flask import Flask, request, json
import subprocess
import requests

app = Flask(__name__)

@app.route('/')
def start():
    # Raspberry pi told us to start
    subprocess.Popen(['python', 'roomba_control.js'])
    print('Got start request from raspberrypi')
    return "Success"

if __name__ == '__main__':
    app.run(host="localhost", port=8000, debug=True)