import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import { checkRunCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class AiAssistantService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  private assitantId = process.env.SAM_ASSISTANT;

  async createThread() {
    return createThreadUseCase( this.openai );
  }

  async createMessage( questionDto: QuestionDto ) {

    const { threadId, question } = questionDto;

    const assitantId = this.assitantId;

    const message = await createMessageUseCase( this.openai, { threadId, question } );
    const run = await createRunUseCase( this.openai, { threadId, assitantId } );

    const runId = run.id

    await checkRunCompleteStatusUseCase( this.openai, { threadId, runId } );

    const messages = await getMessageListUseCase( this.openai, { threadId } );

    return messages.reverse();

  }

}
