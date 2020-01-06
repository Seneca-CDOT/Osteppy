#!/bin/bash

# Server setup script for SystemD Services

# Rename location of service files
NEWDIR=$(dirname "$(readlink -f "$0")")
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/osteppy.service
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/eod-reminder.service
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/osteppy-reset-user-list.service

# Copy service files to systemd service directory
cp $NEWDIR/osteppy.service /etc/systemd/system/
cp $NEWDIR/eod-reminder.service /etc/systemd/system/
cp $NEWDIR/osteppy-reset-user-list.service /etc/systemd/system/

# Reload daemon service
systemctl daemon-reload

# Enable and start services 
systemctl enable osteppy --now
systemctl enable eod-reminder --now
systemctl enable osteppy-reset-user-list --now

# Check Osteppy Service Status
systemctl status osteppy
systemctl status eod-reminder
systemctl status osteppy-reset-user-list
