import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';
import generateSQL from "@/lib/ai/sql";
import {streamUI} from "ai/rsc";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamUI({
    model: openai('gpt-4o'),
    text: ({ content }) => <div>{content}</div>,
    messages: convertToCoreMessages(messages),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't have this information, please upload it as a text via input below."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base, but double check with user.
          if user provide some information without making question, double check if this information should be added to knowledge base.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
      generateSQL: tool({
        description: 'generate SQL script based on user requirements',
        parameters: z.object({
          content: z.string().describe('the requirements that should be analyzed before SQL script creation'),
        }),
        execute: async ({ content }) => generateSQL({content}),
      }),
    },
  });

  return result.toDataStreamResponse();
}