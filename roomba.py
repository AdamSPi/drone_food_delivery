from  pycreate2 import Create2
import time

# Create a Create2.
bot = Create2()

# Start the Create 2
bot.start()

# Put the Create2 into 'safe' mode so we can drive it
# This will still provide some protection
bot.safe()

# You are responsible for handling issues, no protection/safety in
# this mode ... becareful
bot.full()

# directly set the motor speeds ... easier if using a joystick
bot.drive_direct(100, 100)

# turn an angle [degrees] at a speed: 45 deg, 100 mm/sec
bot.turn_angle(45, 100)

# drive straight for a distance: 5 meters, reverse 100 mm/sec
drive_distance(5, -100)

# Tell the Create2 to drive straight forward at a speed of 100 mm/s
bot.drive_straight(100)
time.sleep(2)

# Tell the Create2 to drive straight backward at a speed of 100 mm/s
bot.drive_straight(-100)
time.sleep(2)

# Turn in place
bot.drive_turn(100, 0)
time.sleep(2)

# Turn in place
bot.drive_turn(-100, 0)
time.sleep(4)

# Turn in place
bot.drive_turn(100, 0)
time.sleep(2)

# use the simpler drive direct
bot.drive_direct(200,-200)  # inputs for motors are +/- 500 max
time.sleep(2)

# Stop the bot
bot.drive_stop()

# query some sensors
sensors = bot.get_sensors()  # returns all data
print(sensors.light_bumper_left)

# Close the connection
# bot.close()