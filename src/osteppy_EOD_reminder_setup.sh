#!/bin/bash

# Server setup script for SystemD Services
NEWDIR=$(dirname "$(readlink -fm "$0")")
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/eod-reminder.service

# Copy Unit Files
cp $NEWDIR/eod-reminder.service /etc/systemd/system/

# Reload
systemctl daemon-reload

# Enable Services
systemctl enable eod-reminder

# Start Services
systemctl start eod-reminder

# Check Osteppy Service Status
systemctl status eod-reminder

# Check Osteppy Service Status
systemctl restart eod-reminder
