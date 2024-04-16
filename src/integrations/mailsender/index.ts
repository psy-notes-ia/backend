import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.EMAILSENDER_API_KEY!,
});

class EmailSenderRepositoryClass {
  async sendForgotPasswordEmail({
    name,
    link,
    to,
  }: {
    name: string;
    link: string;
    to: string;
  }): Promise<void> {
    const sentFrom = new Sender(
      "no-reply@smartformx.com",
      "SmartFormX Support"
    );

    const recipients = [new Recipient(to, name)];

    const variables = [
      {
        email: to,
        substitutions: [
          {
            var: "url",
            value: link,
          },
        ],
      },
    ];

    const personalization = [
      {
        email: to,
        data: {
          url: link,
          name: name,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setVariables(variables)
      .setPersonalization(personalization)
      .setSubject("Recuperação de senha")
      .setTemplateId("v69oxl5zevrl785k");

    await mailerSend.email.send(emailParams);
  }
}

var EmailSenderRepository = new EmailSenderRepositoryClass();
export default EmailSenderRepository;
