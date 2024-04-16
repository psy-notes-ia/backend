import OpenAI from "openai";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

class OpenAiRepositoryClass {
  // async generateQuestions(
  //   formType: string,
  //   desc: string,
  //   max_questions: number,
  //   extra: string
  // ): Promise<Question[] | null> {
  //   const amout_ext = extra.split(",").length;
  //   const totalQuestions = Number(max_questions) + Number(amout_ext);

  //   var promptStr = `Crie as melhores ${totalQuestions} perguntas para um formulário com o objetivo de: "${desc}". O tipo de formulário é "${formType}". Adicione perguntas adicionais para coletar informações essenciais, como ${extra}${
  //     extra !== ""
  //       ? ", onde 'goal' é o nome da variável. Exemplo: name = goal: 'name'"
  //       : ""
  //   }. Varie os tipos de resposta, utilize tipos como 'options' ou 'interval' de 1 a 5 para obter respostas mais precisas. Cada pergunta deve conter: question, goal, inputType e options (se inputType for diferente de 'interval').`;

  //   var promptStrNPS = `Crie as melhores e somente ${totalQuestions} perguntas para um formulário com o objetivo de: "${desc}". O tipo de formulário é "${formType}". Adicione perguntas adicionais para coletar informações essenciais, como ${extra}${
  //     extra !== ""
  //       ? ", onde 'goal' é o nome da variável. Exemplo: name = goal: 'name'"
  //       : ""
  //   }. Todas as perguntas devem aceitar apenas o tipo de resposta NPS (1-10). Certifique-se de que o número total de perguntas seja exatamente ${
  //     max_questions + amout_ext
  //   }. Cada pergunta deve conter: question, goal, inputType=nps.`;

  //   const gptResponse = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo-0125",
  //     max_tokens: 2000,
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "considere que você é um especialista em criação de formulario para obter respostas precisas com o objetivo.",
  //       },
  //       {
  //         role: "user",
  //         content:
  //           formType.toLocaleLowerCase() == "nps" ? promptStrNPS : promptStr,
  //       },
  //     ],

  //     functions: [
  //       {
  //         name: "createQuestionsObj",
  //         parameters: {
  //           type: "object",
  //           properties: {
  //             questions: {
  //               type: "array",
  //               items: {
  //                 question: { type: "string" },
  //                 goal: { type: "string" },
  //                 inputType: {
  //                   type: "string",
  //                   description: "tipo de entrada",
  //                   enum: ["interval", "options"],
  //                 },
  //                 "options(if 'type' == options)": "array",
  //               },
  //             },
  //           },
  //           required: ["questions"],
  //         },
  //       },
  //     ],
  //     function_call: { name: "createQuestionsObj" },
  //     temperature: 0.5,
  //   });

  //   try {
  //     const res = gptResponse.choices[0].message.function_call?.arguments;
  //     var quests: Question[] = JSON.parse(res!).questions;

  //     return quests;
  //   } catch (error) {
  //     console.log("formato invalido");
  //     console.log(error);
  //     console.log(
  //       gptResponse.choices[0].message.function_call?.arguments.toString()!
  //     );
  //     return null;
  //   }
  // }

  async generateInsightByNotes(
    insight: string,
    companyDescription: string
  ): Promise<string | null> {
    var promptStr = `Dados as anotações das sessões terapeuticas, gere uma profunda analise do progresso e insights do paciente conforme o andamento dos encontros, gere tambem ketwords da analise.`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "você é um especialista em psicologia e analise do comportamento de pacientes",
        },
        { role: "user", content: promptStr },
      ],
      temperature: 0.4,
    });

    try {
      let solution = gptResponse.choices[0].message.content!;

      return solution;
    } catch (error) {
      console.log("formato invalido");
      console.log(error);
      console.log(gptResponse.choices[0].message.content!);

      return null;
    }
  }
}
var OpenAiRepository = new OpenAiRepositoryClass();
export default OpenAiRepository;
