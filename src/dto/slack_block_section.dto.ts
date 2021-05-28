import SlackTextObjectDto from './slack_text_object.dto';

export default class SlackBlockSectionDto {
  readonly type = 'section';

  constructor(public text: SlackTextObjectDto) {}
}
