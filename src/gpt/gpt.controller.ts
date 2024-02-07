import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer'

import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('text-to-audio/:filename')
  async textToAudioGetter(
    @Res() resp: Response,
    @Param('filename') filename: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(filename);

    resp.setHeader('Content-Type', 'audio/mp3');
    resp.status( HttpStatus.OK );
    resp.sendFile(filePath);

  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime() }.${ fileExtension }`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @Body() audioToTextDto: AudioToTextDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5 mb' }),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) audioFile: Express.Multer.File
  ) {
    return this.gptService.audioToText( audioToTextDto, audioFile )
  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
  ) {
    return this.gptService.imageGeneration( imageGenerationDto );
  }
  
  @Get('image-generation/:filename')
  async imageGenerationGetter(
    @Res() resp: Response,
    @Param('filename') filename: string,
  ) {
    const filePath = await this.gptService.imageGenerationGetter(filename);

    //resp.setHeader('Content-Type', 'application/json');
    resp.status( HttpStatus.OK );
    resp.sendFile(filePath);

  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ) {
    return this.gptService.imageVariation( imageVariationDto );
  }

}