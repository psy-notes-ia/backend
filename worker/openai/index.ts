import OpenAI from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

type ResponseInsight = {
  all_insights: {
    title: string;
    description: string;
    type: string;
  }[];
  stats: {
    title: string;
    info: string;
    value: string;
  }[];
  extra: string;
  keywords: string[];
  usage: string;
};

class OpenAiRepositoryClass {
  async generateAnalyse(
    notes: string,
   ): Promise<any | null> {
    var systemStr =
      "considere que você é um especialista em psicologia e analise do comportamento de pacientes por anotações";
    var promptStr =
      "Dados as anotações das sessões terapeuticas, gere uma profunda analise do progresso e insights do paciente conforme o andamento dos encontros, gere tambem ketwords da analise. Anotações para cada sessão:"+notes;

    const config = { model: "gpt-3.5-turbo-0125", max: 4000 };

    const createInsightsObj = z.object({
      // insights: z.array(
      //   z.object({
      //     insightTitle: z.string(),
      //     insightDescription: z.string(),
      //     insightType: z.enum(["positivo", "negativo"]),
      //   })
      // ),
      keywords: z.array(z.string()),
      result: z.string(),
    });

    const gptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemStr,
        },
        { role: "user", content: promptStr },
      ],
      model: config.model,
      temperature: 0.5,
      max_tokens: config.max,
      functions: [
        {
          name: "out",
          description:
            "This is the function that returns the result of the agent",
          parameters: zodToJsonSchema(createInsightsObj),
        },
      ],
    });
    
    try {
      const structuredResponse = JSON.parse(
        gptResponse.choices[0].message!.function_call!.arguments!
      );
      var usage = JSON.stringify(gptResponse.usage);
      console.dir(structuredResponse);

      // let { keywords, result } = structuredResponse;

      // const all_insights = (insights as []).map((e: any) => {
      //   return {
      //     title: e.insightTitle,
      //     description: e.insightDescription,
      //     type: e.insightType,
      //   };
      // });

      // return { all_insights, keywords, result, stats, usage };
    } catch (error) {
      console.log("formato invalido");
      console.log(error);
      console.log(gptResponse);

      return null;
    }
  }
}
var OpenAiRepository = new OpenAiRepositoryClass();
export default OpenAiRepository;
