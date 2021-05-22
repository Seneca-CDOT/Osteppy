import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as formUrlEncoded from 'form-urlencoded';
import * as request from 'supertest';
import AuthenticationGuard from '../authentication.guard';
import SlackRequestDto from '../dto/slack_request.dto';
import getApp from '../main';

@Injectable()
export default class DevService {
  async goToEndpoint(slackRequestDto: SlackRequestDto) {
    const {
      headers: { 'x-slack-request-timestamp': timestamp },
      body,
      originalUrl,
    } = slackRequestDto;

    // Extract endpoint from request
    let [endpoint] = body.text.split(/\s/);
    if (endpoint[0] !== '/') endpoint = `/${endpoint}`;

    // Prevent circular redirection
    if (endpoint === originalUrl) {
      throw new HttpException('Circular routes', HttpStatus.BAD_REQUEST);
    }

    // Generate authentication for request body without the endpoint
    const endText = body.text.slice(endpoint.length).trim();
    const endBody = { ...body, text: endText };
    const endRawBody = formUrlEncoded(endBody);
    const endSlackSignature = AuthenticationGuard.computeSlackSignature(
      timestamp,
      endRawBody,
    );

    // Go to the endpoint with new authentication and request body
    const endResponse = await request(getApp().getHttpServer())
      .post(endpoint)
      .set('x-slack-request-timestamp', timestamp)
      .set('x-slack-signature', endSlackSignature)
      .send(endRawBody);

    return endResponse.text || endResponse.body;
  }
}
