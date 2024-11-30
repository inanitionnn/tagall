import OpenAI from "openai";
import { env } from "../../../../../env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY!,
});

export async function GetEmbedding(data: object | string): Promise<number[]> {
  try {
    const inputString = typeof data === "string" ? data : JSON.stringify(data);

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
