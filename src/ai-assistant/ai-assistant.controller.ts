import { Body, Controller, Post } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { QuestionDto } from './dto/question.dto';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.aiAssistantService.createThread();
  }
  
  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto
  ) {
    return this.aiAssistantService.createMessage( questionDto );
  }

}
