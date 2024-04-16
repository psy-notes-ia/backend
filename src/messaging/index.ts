import amqp from "amqplib/callback_api";
import crypto from "crypto";

const RABBIT_URL = "amqp://localhost";
const RABBIT_QUEUE_NAME = "ia-analyse";

let channel: amqp.Channel;

// connect to RabbitMQ
amqp.connect(RABBIT_URL, (error: any, conn: amqp.Connection) => {
  if (error) {
    throw new Error(error);
  }

  conn.createChannel((err: any, chan: any) => {
    if (err) {
      throw new Error(err);
    }

    chan.assertQueue(RABBIT_QUEUE_NAME, { durable: true });

    channel = chan;
  });
});

const sendToQueue = (content: any) => {
  const data = JSON.stringify(content);

 var res = channel.sendToQueue(RABBIT_QUEUE_NAME, Buffer.from(data), {
    persistent: true,
    messageId: crypto
      .randomBytes(6)
      .toString("hex")
      .slice(0, 6)
      .toUpperCase(),
  });

  return res;
};

export default sendToQueue;
