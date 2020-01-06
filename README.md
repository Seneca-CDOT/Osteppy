Handles End of Day (EoD) slash commands and sending EoD reminders.

## Usage
* `/eod`: submits an EoD
* `/eods_left`: returns a list of who have not submitted their EoD for the day
* `/set_eod_reminder_channel`: sets the EoD reminder channel
* `/add_eod_reminder`: adds an EoD reminder
* `/check_eod_reminders`: returns a list of your EoD reminders
* `/remove_eod_reminder`: remove an EoD reminder

## Initial setup

`Osteppy/src/osteppy_server_setup.sh`

`Osteppy/src/osteppy_EOD_reminder_setup.sh`

`Osteppy/src/reset_user_list_setup.sh`

`npm install`

## Dev Run

`npm run dev`

## Instructions

### Set up slack token

Store the Slack token as plain text in `Osteppy/config-files/SLACK_TOKEN`

Note: This key is called from the backend, so it should not be available to the public.
