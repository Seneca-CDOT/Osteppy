#!/bin/bash

# Server setup script for SystemD Services
NEWDIR=$(dirname "$(readlink -fm "$0")")
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/eod-reminder.service

# Copy Unit Files

cp $NEWDIR/osteppy.service /usr/lib/systemd/system/

# Reload
systemctl daemon-reload

# Enable Services
systemctl enable osteppy

# Start Services
systemctl start osteppy
