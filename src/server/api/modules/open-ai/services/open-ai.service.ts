import OpenAI from "openai";
import { env } from "../../../../../env";
import { REGREX_PROMT } from "../constants";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
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
  } catch {
    throw new Error("Failed to get embedding");
  }
}

export async function GetSelectorAndRegex(
  htmlSnippet: string,
  userMessage?: string,
): Promise<{ selector: string; regex: string }> {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: REGREX_PROMT },
      { role: "user", content: `HTML snippet:\n${htmlSnippet}` },
    ];

    if (userMessage) {
      messages.push({
        role: "user",
        content: `\nAdditional instructions: ${userMessage}`,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    if (!parsed.selector || !parsed.regex) {
      throw new Error("Invalid response format");
    }

    return parsed;
  } catch (error) {
    throw new Error(`Failed to get selector and regex: ` + String(error));
  }
}
