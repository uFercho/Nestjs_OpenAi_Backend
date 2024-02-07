import * as fs from 'fs';

import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";


interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async( openai: OpenAI, options: Options ) => {

  const { baseImage } = options;

  const imagePath = await downloadImageAsPng( baseImage, true );

  const completion = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream( imagePath ),
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