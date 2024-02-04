import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

import { Injectable, NotFoundException } from '@nestjs/common';

import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase,  } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });



  async orthographyCheck( orthographyDto: OrthographyDto ) {
    const { prompt } = orthographyDto;
    return await orthographyCheckUseCase( this.openai, { prompt });
  }

  async prosConsDiscusser( prosConsDiscusserDto: ProsConsDiscusserDto ) {
    const { prompt } = prosConsDiscusserDto;
    return await prosConsDiscusserUseCase(this.openai, { prompt });
  }

  async prosConsDiscusserStream( prosConsDiscusserDto: ProsConsDiscusserDto ) {
    const { prompt } = prosConsDiscusserDto;
    return await prosConsDiscusserStreamUseCase(this.openai, { prompt });
  }

  async translate( translateDto: TranslateDto ) {
    const { prompt, lang } = translateDto;

    return await translateUseCase( this.openai, { prompt, lang });
  }

  async textToAudio( textToAudioDto: TextToAudioDto ) {
    const { prompt, voice } = textToAudioDto;

    return await textToAudioUseCase( this.openai, { prompt, voice });
  }

  async textToAudioGetter( fileId: string ) {

    const filePath = path.resolve( __dirname, '../../generated/audios/', `${fileId}.mp3` );

    const wasFound = fs.existsSync( filePath );

    if ( !wasFound ) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

}
