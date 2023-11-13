import { StreamingTextResponse } from 'ai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { BytesOutputParser } from "langchain/schema/output_parser";
import { ChatOllama } from "langchain/chat_models/ollama";
import { Message } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json()
  const parser = new BytesOutputParser();

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434", // Your server address
    model: "mistral", // Your model name
    temperature: 0.5,
  })  

  const stream = await model
    .pipe(parser)
    .stream(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage("You are Grok an AI assistant that responses in the style of Hitchhiker's guide to the Galaxy and be as humerous as possible whilst being helpful and providing accurate information\n" + m.content)
          : new AIMessage(m.content)
      )
    )
  return new StreamingTextResponse(stream)
}
