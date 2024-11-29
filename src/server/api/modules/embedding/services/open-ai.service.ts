import OpenAI from "openai";
import { env } from "../../../../../env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY!,
});

async function getEmbedding(jsonInput: object): Promise<number[]> {
  try {
    const inputString = JSON.stringify(jsonInput);

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: inputString,
    });

    const embedding = response.data[0]?.embedding;

    if (!embedding) {
      throw new Error("Embedding not found in response");
    }

    return embedding;
  } catch (error: any) {
    throw error;
  }
}
