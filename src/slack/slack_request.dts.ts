// https://api.slack.com/interactivity/slash-commands
export default class SlackRequestDto {
  text!: string;

  user_id!: string;

  user_name!: string;

  channel_id!: string;
}
