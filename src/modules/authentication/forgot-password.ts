import { FastifyReply, FastifyRequest } from "fastify";
import AuthenticationService from "./service";
import EmailSenderRepository from "../../integrations/mailsender";

import { hash, compare } from "bcryptjs";
import crypto from "crypto";

const service = new AuthenticationService();

export async function SendResetPasswordEmail(
  req: FastifyRequest,
  res: FastifyReply
) {
  const { email }: any = req.params;

  const user = await service.findByEmail(email);

  if (!user) throw new Error("Not found user: 404");

  let resetToken = crypto.randomBytes(32).toString("hex");
  const _hash = await hash(resetToken, 10);

  await service.updateTempToken(email, _hash);

  const link =
    process.env.FRONTEND_URL +
    "/new-password?wtk=" +
    resetToken +
    "&uid=" +
    user.id;

  await EmailSenderRepository.sendForgotPasswordEmail({
    link,
    name: user.name,
    to: email,
  });

  return res.send({ message: "sent email" });
}

export async function CheckTokenFromResetPassword(req: FastifyRequest, res: FastifyReply) {
  const { wtk, uid }: any = req.query;

  const user = await service.getTokenById(uid);

  if (!user) return res.status(404).send("user not found");

  const isValid = await compare(wtk!, user.tempToken!);

  if (!isValid) return res.status(403).send({ valid: false });

  return res.send({ valid: true });
}

export async function  ResetPassword(request: FastifyRequest, reply: FastifyReply) {
  const { password }: any = await request.body;

  const { uid }: any = request.params;

  await service.updatePassword(password, uid);

  return reply.status(200);
}