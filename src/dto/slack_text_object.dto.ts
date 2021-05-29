export default class SlackTextObjectDto {
  constructor(public type: 'plain_text' | 'mrkdwn', public text: string) {}
}
