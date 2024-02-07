import * as fs from 'fs';
import * as path from 'path';

import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";


interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async( openai: OpenAI, options: Options ) => {

  const { prompt, originalImage, maskImage } = options;

  if ( !originalImage || !maskImage ) {

    const completion = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url'
    });
  
    const fileName = await downloadImageAsPng( completion.data[0].url );
    const url = `${ process.env.SERVER_URL }/gpt/image-generation/${ fileName }`;
  
    return {
      url: url,
      openAiUrl: completion.data[0].url,
      revised_prompt: completion.data[0].revised_prompt
    };

  }

  const imagePath = await downloadImageAsPng( originalImage, true );
  const maskPath = await downloadBase64ImageAsPng( maskImage, true );

  const completion = await openai.images.edit({
    prompt: prompt,
    model: 'dall-e-2',
    image: fs.createReadStream( imagePath ),
    mask: fs.createReadStream( maskPath ),
    n: 1,
    size: '1024x1024',
    response_format: 'url'
  }); 

  const fileName = await downloadImageAsPng( completion.data[0].url );
  const url = `${ process.env.SERVER_URL }/gpt/image-generation/${ fileName }`;

  return {
    url: url,
    openAiUrl: completion.data[0].url,
    revised_prompt: completion.data[0].revised_prompt
  };

}