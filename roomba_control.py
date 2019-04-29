#!/usr/bin/env python
# ----------------------------------------------------------------------------
# MIT License
# moves the roomba through a simple sequence

from __future__ import print_function
import pycreate2
import time


if __name__ == "__main__":
    # Create a Create2 Bot
	# port = '/dev/tty.usbserial-DA01NX3Z'  this is the serial port on my iMac
	port = '/dev/ttyUSB0'  # this is the serial port on my raspberry pi
	baud = {
		'default': 115200,
		'alt': 19200  # shouldn't need this unless you accidentally set it to this
	}

	bot = pycreate2.Create2(port=port, baud=baud['default'])
	'''
	# define a movement path
	path = [
		['forward', 200, 1, 'for'],
		['back', -200, 2, 'back'],
		['stop', 0, 0.1, 'stop'],
		['turn right', 100, 2, 'rite'],
		['turn left', -100, 4, 'left'],
		['turn right', 100, 2, 'rite'],
		['stop', 0, 0.1, 'stop']
	]

	bot.start()
	bot.safe()

	# path to move
	for mov in path:
		name, vel, dt, string = mov
		print(name)
		bot.digit_led_ascii(string)
		if name in ['forward', 'back', 'stop']:
			bot.drive_straight(vel)
			time.sleep(dt)
		elif name in ['turn right', 'turn left']:
			bot.drive_turn(vel, -1)
		else:
			raise Exception('invalid movement command')

	print('shutting down ... bye')
	bot.drive_stop()
	time.sleep(0.1)
	'''
	# Start the Create 2
	bot.start()
	# Put the Create2 into 'safe' mode so we can drive it
	# This will still provide some protection
	bot.safe()
	# directly set the motor speeds ... easier if using a joystick
	bot.drive_direct(200, -200)
	time.sleep(7)
	drive_distance(0.5, 100)
	# turn an angle [degrees] at a speed: 90 deg, 100 mm/sec
	bot.turn_angle(90, 100)
	# drive straight for a distance: 5 meters, reverse 100 mm/sec
	drive_distance(2.5, 100)
	time.sleep(2)
	drive_distance(2.5, -100)
	time.sleep(1)
	bot.turn_angle(-90, 100)
	time.sleep(1)
	drive_distance(0.5, 100)
	time.sleep(1)
	# Tell the Create2 to drive straight backward at a speed of 100 mm/s
	bot.turn_angle(180, 100)
	time.sleep(2)
	# Stop the bot
	bot.drive_stop()
	# Close the connection
	bot.close()