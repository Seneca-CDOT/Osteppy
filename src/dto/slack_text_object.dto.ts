export default class SlackTextObjectDto {
  readonly type = 'mrkdwn';

  constructor(public text: string) {}
}
