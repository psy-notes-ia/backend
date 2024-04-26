import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../prisma";
import sendToQueue from "../../messaging";
import OpenAiRepository from "../../integrations/openai";

export default async function CreateNotesAnalyse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // const {  pacientId }: any = request.params;
  const { title, notes, pacientId }: any = request.body;

  const pacient = await prisma.pacients.findUnique({
    where: { id: pacientId },
    select: { reason: true },
  });

  const dbNotes = await prisma.notes.findMany({ where: { id: { in: notes } } });

  const tokens = "";
  const sessions: any = dbNotes.map((e) => e.session);
  const notesStr =
    `Motivo da terapia:${pacient?.reason}\n` +
    dbNotes
      .map((e) => {
        return `sessão:${e.session},anotação:${e.note}`;
      })
      .toString()
      .trim();

  try {
    // const { keywords, result, attentionPoints } =
    //   await OpenAiRepository.generateAnalyse(notesStr);

    const analyse = await prisma.analyse.create({
      data: {
        title,
        sessions,
        pacientId,
        analysed: false,
      },
    });

    var sent = sendToQueue({
      id: analyse.id,
      notesStr,
      notesId: notes,
      tokens,
    });

    if (sent) {
      return reply
        .status(201)
        .send({ type: "ai_processing", message: "processing analyse" });
    }
  } catch (error) {
    return reply.status(500).send({ message: "unable to send to ai process" });
  }
}

function ProcessQuestionsToAIForm(questions: any[]) {
  return questions
    .map(({ Answers, goal }: any) =>
      Answers.map((Answer: any, index: any) => ({
        [`${goal}Answear${index + 1}`]: Answer.answear,
      }))
    )
    .reduce((acc, curr) => {
      for (let i = 0; i < curr.length; i++) {
        acc[i] = { ...acc[i], ...curr[i] };
      }
      return acc;
    }, [])
    .map(Object.values);
}
