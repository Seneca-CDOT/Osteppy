#!/bin/bash

# Server setup script for SystemD Services
NEWDIR=$(dirname "$(readlink -fm "$0")")
sed -i "s@OLDDIR@$NEWDIR@g" $NEWDIR/osteppy-reset-user-list.service

# Copy Unit Files

cp $NEWDIR/osteppy-reset-user-list.service /etc/systemd/system/

# Reload
systemctl daemon-reload

# Enable Services
systemctl enable osteppy-reset-user-list

# Start Services
systemctl start osteppy-reset-user-list

# Check Osteppy Reset User List Service Status
systemctl status osteppy-reset-user-list
