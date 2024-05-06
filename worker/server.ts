// import {connect} from "amqplib/callback_api";
import { connect } from "amqplib";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import OpenAiRepository from "./openai";
import { EncryptData } from "./utils/crypto";
const prisma = new PrismaClient();

const QUEUE_NAME = "ia-analyse";
const RABBIT_URL = "amqp://localhost";

async function startConsumer(consumerNumber: number) {
  const connection = await connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`Consumer ${consumerNumber} está aguardando mensagens...`);
  channel.prefetch(12);
  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      console.log(
        `Consumer ${consumerNumber} recebeu mensagem: ${msg!.content.toString()}`
      );

      console.log(`Processing ${msg?.properties.messageId} `);

      const data = JSON.parse(msg?.content.toString() ?? "");

      const { id, notesStr, tokens, notesId } = data;

      var startTime = performance.now();

      const response = await OpenAiRepository.generateAnalyse(notesStr);
      if (response) {
        try {
          await prisma.analyse.update({
            where: { id },
            data: {
              analysed: true,
              usage: response.usage,
              attentionPoints: response.attention_points,
              result: EncryptData(response.result),
              keywords: response.keywords,
            },
          });

          await prisma.notes.updateMany({
            data: {  analysed: true, },
            where: { id: { in: notesId } },
          });
          if (msg) channel.ack(msg);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("unable to process form data: " + id);
        await prisma.analyse.update({
          where: { id },
          data: {
            error: true,
          },
        });
      }
      var endTime = performance.now();
      console.log(`Took ${(endTime - startTime) / 1000} seconds`);
    },
    {
      consumerTag: "ai-consumer-" + consumerNumber,
      noAck: false,
    }
  );
}

startConsumer(1);
startConsumer(2);
startConsumer(3);
startConsumer(4);
startConsumer(5);
