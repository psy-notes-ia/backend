import OpenAI from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});


class OpenAiRepositoryClass {
  async generateAnalyse(
    notes: string
   ): Promise<any | null> {
    var systemStr = "Como especialista em psicologia e análise comportamental, utilizo anotações detalhadas para compreender o progresso e comportamento dos pacientes.";
    var promptStr =
      "Com base nas anotações das sessões terapêuticas, realize uma análise aprofundada e precisa do progresso do paciente, insights comportamentais ao longo das sessões e identifique pontos de atenção relevantes. As anotações de cada sessão estão disponíveis em: "+notes;

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
      attention_points:z.array(z.string()),
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
      console.log(usage);
      console.log(structuredResponse);

      let { keywords, result, attentionPoints } = structuredResponse;

      // const all_insights = (insights as []).map((e: any) => {
      //   return {
      //     title: e.insightTitle,
      //     description: e.insightDescription,
      //     type: e.insightType,
      //   };
      // });

      return { keywords, result, attentionPoints };
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
