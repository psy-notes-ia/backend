import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../prisma";
import sendToQueue from "../../messaging";

export default async function CreateNotesAnalyse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, notes }: any = request.params;

  const dbNotes = await prisma.notes.findMany({ where: { id: { in: notes } } });

  const tokens = "";
  const sessions: any = dbNotes.map((e) => e.session);
  const notesStr = dbNotes
    .map((e) => {
      return `session:${e.session},note:${e.note}`;
    })
    .toString()
    .trim();

  const id = await prisma.analyse.create({
    data: { title: title },
  });

  var sent = sendToQueue({
    id,
    sessions,
    notesId: notes,
    notesStr,
    tokens,
  });

  if (sent) {
    await prisma.notes.updateMany({
      data: { status: "analysing" },
      where: { id: { in: notes } },
    });

    return reply
      .status(201)
      .send({ type: "ai_processing_1", message: "processing analyse" });
  }
  return reply.status(400).send({ message: "unable to send to ai process" });
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
