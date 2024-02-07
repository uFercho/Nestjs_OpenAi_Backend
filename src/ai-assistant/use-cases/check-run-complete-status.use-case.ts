import OpenAI from "openai";

interface Options {
  threadId: string;
  runId: string;
}

export const checkRunCompleteStatusUseCase = async( openai: OpenAI, options: Options ) => {

  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve( threadId, runId ); // completed

  console.log('🚀 | checkRunCompleteStatusUseCase | runStatus:', runStatus.status)

  if ( runStatus.status === 'completed' ) return runStatus;

  // Esperar un segundo

  await new Promise( resolve => setTimeout( resolve, 1000) );

  return checkRunCompleteStatusUseCase( openai, options );

}