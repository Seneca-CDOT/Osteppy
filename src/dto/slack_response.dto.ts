import SlackBlockDividerDto from './slack_block_divider.dto';
import SlackBlockSectionDto from './slack_block_section.dto';

export default class SlackResponseDto {
  constructor(
    public blocks: Array<SlackBlockSectionDto | SlackBlockDividerDto>,
  ) {}
}
