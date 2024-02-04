import OpenAI from "openai";


interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async( openai: OpenAI, options: Options ) => {

  const { prompt, lang } = options;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.2,
    // max_tokens: 150,
    // response_format: {
    //   type: 'json_object'
    // },
    messages: [
      { 
        role: "system", 
        content: `
          Traduce el siguiente texto al idioma ${lang}:${ prompt }
        ` 
      }
    ],
  });

  return completion.choices[0].message;

}