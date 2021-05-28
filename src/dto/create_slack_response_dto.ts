import SlackBlockDividerDto from './slack_block_divider.dto';
import SlackBlockSectionDto from './slack_block_section.dto';
import SlackResponseDto from './slack_response.dto';
import SlackTextObjectDto from './slack_text_object.dto';

const SLACK_BLOCK_DIVIDER = Symbol('slack_block_divider');

type Input = string | typeof SLACK_BLOCK_DIVIDER;

const parseInputString = (input: Input) => {
  return input === SLACK_BLOCK_DIVIDER
    ? new SlackBlockDividerDto()
    : new SlackBlockSectionDto(new SlackTextObjectDto(input));
};

const createSlackResponseDto = (input: Input | Input[]) => {
  return new SlackResponseDto(
    Array.isArray(input)
      ? input.map(parseInputString)
      : [parseInputString(input)],
  );
};

export { SLACK_BLOCK_DIVIDER, createSlackResponseDto };
