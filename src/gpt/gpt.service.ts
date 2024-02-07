import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

import { Injectable, NotFoundException } from '@nestjs/common';

import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase,  } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

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

  async textToAudioGetter( filename: string ) {

    const filePath = path.resolve( __dirname, '../../generated/audios/', `${filename}.mp3` );

    const wasFound = fs.existsSync( filePath );

    if ( !wasFound ) throw new NotFoundException(`File ${filename} not found`);

    return filePath;
  }

  async audioToText( audioToTextDto: AudioToTextDto, audioFile: Express.Multer.File ) {

    const { prompt } = audioToTextDto;

    return await audioToTextUseCase( this.openai, { prompt, audioFile });
  }

  async imageGeneration( imageGenerationDto: ImageGenerationDto ) {

    const { prompt, originalImage, maskImage } = imageGenerationDto;

    return await imageGenerationUseCase( this.openai, { prompt, originalImage, maskImage });
  }

  async imageGenerationGetter( filename: string ) {

    const filePath = path.resolve( __dirname, '../../generated/images/', `${filename}` );
    
    const wasFound = fs.existsSync( filePath );

    if ( !wasFound ) throw new NotFoundException(`File ${filename} not found`);

    return filePath;
  }

  async imageVariation( imageVariationDto: ImageVariationDto ) {

    const { baseImage } = imageVariationDto;

    return await imageVariationUseCase( this.openai, { baseImage });
  }

}
