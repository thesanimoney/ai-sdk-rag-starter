import {createResource} from '@/lib/actions/resources';
import {openai} from '@ai-sdk/openai';
import {convertToCoreMessages, streamText, tool} from 'ai';
import {z} from 'zod';
import {findRelevantContent} from '@/lib/ai/embedding';
import generateSQL from "@/lib/ai/sql";
import testCasesGeneration from "@/app/actions/actions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const {messages} = await req.json();
    const result = await streamText({
        model: openai('gpt-4o'),
        messages: convertToCoreMessages(messages),
        system: `You are a helpful assistant.
    
    0) Only respond to questions using information from tool calls.
    1) if no relevant information is found in the tool calls, respond, "Sorry, I don't have this information, please upload it as a text via input below.
    2) If you asked to generate sql - generate only sql script without any comments
    3) If you asked to generate test case - use tool generateTestCases and provide test cases to the users. reqs refining
    `,
        tools: {
            addResource: tool({
                description: `add a resource to your knowledge base, but double check with user.
          if user provide some information without making question, double check if this information should be added to knowledge base.`,
                parameters: z.object({
                    content: z
                        .string()
                        .describe('the content or resource to add to the knowledge base'),
                }),
                execute: async ({content}) => createResource({content}),
            }),
            getInformation: tool({
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({question}) => findRelevantContent(question),
            }),
            generateSQL: tool({
                description: 'generate SQL script based on user requirements',
                parameters: z.object({
                    content: z.string().describe('the requirements that should be analyzed before SQL script creation'),
                }),
                execute: async ({content}) => generateSQL({content})
            }),
            generateTestCases: tool({
                description: 'generate test cases with Step and Expected result based on user requirements',
                parameters: z.object({
                    content: z.string().describe('the requirements that should be analyzed before test cases creation')
                }),
                execute: async ({content}) => testCasesGeneration({content})
            }),
        },
    });
    return result.toDataStreamResponse();
}