import Fastify from "fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import urlData from "@fastify/url-data";
import formBody from "@fastify/formbody";
import { PrivateAppRouter, PublicAppRouter } from "./router";
import fastifyCookie from "@fastify/cookie";
import pino from "pino";

import jwt from "@fastify/jwt";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z", ignore: "pid,hostname",
    },
  },
});

const server = Fastify({ logger });

server.register(compress);
server.register(cors);
server.register(helmet);
server.register(urlData);
server.register(formBody);

server.register(jwt, { secret: process.env.AUTH_SK! });
server.register(fastifyCookie);

server.register(PrivateAppRouter);
server.register(PublicAppRouter);

const start = async () => {
  try {
    await server.listen({ port: 4554, host: '0.0.0.0' });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
