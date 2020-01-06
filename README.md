Handles End of Day (EoD) slash commands and sending EoD reminders.

## Usage
* `/eod`: submits an EoD
* `/eods_left`: returns a list of who have not submitted their EoD for the day
* `/set_eod_reminder_channel`: sets the EoD reminder channel
* `/add_eod_reminder`: adds an EoD reminder
* `/check_eod_reminders`: returns a list of your EoD reminders
* `/remove_eod_reminder`: remove an EoD reminder

## Initial setup 
Note: installation scripts only support Linux distributions at the moment

1. Install systemd package if you don't have it already

2. Run the installation script for Osteppy services

* ``Osteppy/src/osteppy_installation.sh``

3. Install npm packages

* `npm install`

## Dev Run

`npm run dev`

## Instructions

### Set up slack token

Store the Slack token as plain text in `Osteppy/config-files/SLACK_TOKEN`

Note: This key is called from the backend, so it should not be available to the public.
