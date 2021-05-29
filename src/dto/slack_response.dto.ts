import SlackBlockDividerDto from './slack_block_divider.dto';
import SlackBlockSectionDto from './slack_block_section.dto';

export default class SlackResponseDto {
  constructor(
    public response_type?: 'ephemeral' | 'in_channel',
    public text?: string,
    public blocks?: (SlackBlockSectionDto | SlackBlockDividerDto)[],
  ) {}
}
