import OpenAI from "openai";

interface Options {
  threadId: string;
  assitantId: string;
}

export const createRunUseCase = async( openai: OpenAI, options: Options ) => {

  const { threadId, assitantId } = options;

  const run = await openai.beta.threads.runs.create( threadId, {
    assistant_id: assitantId,
    //instructions: // OJO! Sobre escribe el asistente
  });

  return run;

}