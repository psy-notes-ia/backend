import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { compare } from "bcryptjs";

import jwt from "jsonwebtoken";

import AuthenticationService from "./service";

const service = new AuthenticationService();

const generateToken = (data: string): string => {
  const expiresIn = "2d";
  return jwt.sign({ data }, process.env.AUTH_SK!, { expiresIn });
};

export default async function AuthenticationHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { email, password }: any = request.body;

  if (!email || !password) {
    throw new Error("Nome de usuário ou senha ausente");
  }
  const user = await service.findByEmail(email);

  if (!user) {
    throw new Error("Conta não cadastrada");
  }

  const match = await compare(password, user.password!);

  if (!match) throw new Error("Senha incorreta");

  delete (user as any).password; 
  
  const token = generateToken(JSON.stringify(user));

  if (user.metadata) {
    const { name }: any = user.metadata;
    (user as any).plan = name;
  }
  delete (user as any).metadata;
  delete (user as any).id;
  delete (user as any).businessId;
  
  reply.status(200)
  .send({user , token});

}

