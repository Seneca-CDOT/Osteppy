import SlackEodsService from './slack_eods.service';

describe('SlackEodsService', () => {
  test('parse EOD from text', () => {
    const eod1 = SlackEodsService.parseEodFromText(`:foo:\nbar\n• baz`);
    expect(eod1.tasks).toEqual(['bar', 'baz']);
    expect(eod1.slackEmoji).toBe(':foo:');

    const eod2 = SlackEodsService.parseEodFromText(`foo`);
    expect(eod2.tasks).toEqual(['foo']);
    expect(eod2.slackEmoji).toBeUndefined();

    const eod3 = SlackEodsService.parseEodFromText(`:foo:`);
    expect(eod3.tasks).toBeUndefined();
    expect(eod3.slackEmoji).toBe(':foo:');
  });

  test('format EOD to text', () => {
    const text1 = SlackEodsService.formatEodToText('123', {
      date: new Date(0),
      tasks: ['foo'],
      slackEmoji: ':bar:',
    });
    expect(text1).toBe(
      ':bar: EOD was submitted by <@123> on <!date^0^{date_num}| >\n>• foo',
    );

    const text2 = SlackEodsService.formatEodToText('123', {
      date: new Date(0),
      tasks: ['foo', 'bar'],
      slackEmoji: '',
    });
    expect(text2).toBe(
      ':clock5: EOD was submitted by <@123> on <!date^0^{date_num}| >\n>• foo\n>• bar',
    );
  });
});
