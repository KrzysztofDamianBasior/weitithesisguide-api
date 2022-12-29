import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);

    console.log(`Email successfully dispatched to ${mail.to}`);
    return transport;
  }

  async forgetPassword({
    username,
    email,
    token,
  }: {
    username: string;
    email: string;
    token: string;
  }) {
    const mail = {
      to: email,
      subject: 'WEiTIThesisGuide- reset password',
      from: {
        name: 'WEiTIThesisGuide no-reply',
        email: this.configService.get<string>('SENDER_EMAIL'),
      },
      text: `Hi ${username}! Please use a given link to reset your password: 
      ${this.configService.get<string>('CLIENT_URL')}/resetpassword, 
      then use the following token: ${token}`,
      html: `
        <h1>
          Hi ${username}!
        </h1>
        <div>
          <p>Please click a given link to reset your password:</p>
          <p>
          ${this.configService.get<string>('CLIENT_URL')}/resetpassword
          </p>
        </div>
        <div>
          <p>then use the following token:</p>
          <p>${token}</p>
        </div>
      `,
    };
    return this.send(mail);
  }

  async activateLink({
    username,
    email,
    token,
  }: {
    username: string;
    email: string;
    token: string;
  }) {
    const mail = {
      to: email,
      subject: 'WEiTiThesisGuide- activate email',
      from: {
        name: 'WEiTiThesisGuide no-reply',
        email: this.configService.get<string>('SENDER_EMAIL'),
      },
      text: `Hi ${username}! Please use given link to activate your email: 
      ${this.configService.get<string>('CLIENT_URL')}/activate-email/${token}`,
      html: `
      <h1>
        Hi ${username}!
      </h1>
      <div>
        <p>
        Please click a given link to activate your email:
        </p>
        <p>
        ${this.configService.get<string>('CLIENT_URL')}/activate-email/${token}
        </p>
      </div>
      `,
    };
    return this.send(mail);
  }
}
