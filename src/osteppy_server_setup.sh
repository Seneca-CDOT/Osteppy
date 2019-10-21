#!/bin/bash

# Server setup script for SystemD Services

# Copy Unit Files
cp ../config-files/osteppy.service /usr/lib/systemd/system/

# Reload
systemctl daemon-reload

# Enable Services
systemctl enable osteppy

# Start Services
systemctl start osteppy