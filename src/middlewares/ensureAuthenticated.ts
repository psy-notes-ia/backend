import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';

const secretKey = process.env.AUTH_SK!;


export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err: any, decoded:any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const AuthMiddlewareHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    // console.log()
    if (!token) {
      // throw new Error('Token não fornecido');
      return reply.code(401).send({ error: 'Token não fornecido' });
    }

    const decodedToken = await verifyToken(token);

    // request.jwtVerify()

    const user = JSON.parse(decodedToken.data); 

    // const userExists = true;

    // if (!userExists) {
    //   throw new Error('Usuário não autorizado');
    // }

    (request as any).user = user ;

  } catch (error) {
    console.error(error);
    reply.code(401).send({ error: error,message: 'Não autorizado' });
  }
};



export default AuthMiddlewareHandler;
