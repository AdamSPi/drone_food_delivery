import time
import datetime

from flask import Flask, request, json
from flask_restful import Resource, Api
from flask_ask import Ask, request, session, question, statement

import subprocess
import requests

import pprint

import logging
import os

app = Flask(__name__)
ask = Ask(app, "/")
logging.getLogger('flask_ask').setLevel(logging.DEBUG)

STATUSON = ['fly','deploy']
STATUSOFF = ['stop','land']

@ask.intent('DroneIntent', mapping = {'status':'status'})
def DroneIntent(status, room):
	if status in STATUSON:
		# start node program to hover drone over tag
		subprocess.Popen(['node', 'hover_over_tag.js'])
		# make a request to http://10.0.0.207:8000/start to start roomba
		requests.get('http://10.0.0.207:8000/')
		return statement('{}ing drone.'.format(status))
	elif status in STATUSOFF:
		print('Landing drone...')
		return statement('{}ing drone.'.format(status))
	else:
		return statement('Sorry not possible.')

@ask.session_ended
def session_ended():
    return "{}", 200

'''
pp = pprint.PrettyPrinter(indent=4)

username = "adamsp"
password = "redhatlinux"

ngrok = subprocess.Popen(['ngrok', 'http', '5000'], stdout = subprocess.PIPE)

localhost_url = "http://localhost:4040/api/tunnels"
tunnel_url = requests.get(localhost_url).text
j = json.loads(tunnel_url)

tunnel_url = j['tunnels'][0]['public_url']
print(tunnel_url)

url = 'http://104.248.57.252:5000/url'
header = {'content-type': 'application/json'}
response = requests.post(url, headers=header, json={"username": username, "password": password, 'url': tunnel_url})

pp = pprint.PrettyPrinter(indent=4)
pp.pprint(response)
'''
if __name__ == '__main__':
    if 'ASK_VERIFY_REQUESTS' in os.environ:
        verify = str(os.environ.get('ASK_VERIFY_REQUESTS', '')).lower()
        if verify == 'false':
            app.config['ASK_VERIFY_REQUESTS'] = False
    app.run(debug=True)