import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto)
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() resp: Response,
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);

    resp.setHeader('Content-Type', 'application/json');
    resp.status( HttpStatus.OK );

    for await ( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || '';
      resp.write(piece);
    }
    resp.end();
  }

  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translate(translateDto)
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() resp: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    resp.setHeader('Content-Type', 'application/json');
    resp.status( HttpStatus.OK );
    resp.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() resp: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    resp.setHeader('Content-Type', 'application/json');
    resp.status( HttpStatus.OK );
    resp.sendFile(filePath);

  }

}