import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import * as formUrlencoded from 'form-urlencoded';
import { SLACK } from '../configuration';

@Injectable()
export default class SlackGuard implements CanActivate {
  // https://api.slack.com/authentication/verifying-requests-from-slack
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const {
      headers: {
        'x-slack-request-timestamp': requestTimestamp,
        'x-slack-signature': signature,
      },
      body,
    } = request;

    const rawBody = formUrlencoded(body);
    const computedSignature = SlackGuard.computeSlackSignature(
      requestTimestamp,
      rawBody,
    );

    return computedSignature === signature;
  }

  static computeSlackSignature(requestTimestamp: string, rawBody: string) {
    const baseString = [
      SlackGuard.SLACK_AUTH_VERSION,
      requestTimestamp,
      rawBody,
    ].join(':');

    const hashedString = createHmac('sha256', SLACK.SIGNING_SECRET)
      .update(baseString)
      .digest('hex');

    const computedSignature = `${SlackGuard.SLACK_AUTH_VERSION}=${hashedString}`;
    return computedSignature;
  }

  static SLACK_AUTH_VERSION = 'v0';
}
