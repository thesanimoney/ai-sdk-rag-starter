'use server';

import {streamUI} from 'ai/rsc';
import {openai} from '@ai-sdk/openai';
import {z} from 'zod';
import generateSQL from "@/lib/ai/sql";
import SqlWrapper from "@/components/sql-wrapper";
import {generateText} from "ai";

const LoadingComponent = () => (
    <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return '82°F️ ☀️';
};

interface WeatherProps {
    location: string;
    weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
    <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
        The weather in {props.location} is {props.weather}
    </div>
);

export async function streamComponent() {
    const result = await streamUI({
        model: openai('gpt-4o'),
        prompt: 'Get the weather for San Francisco',
        text: ({content}) => <div>{content}</div>,
        tools: {
            getWeather: {
                description: 'Get the weather for a location',
                parameters: z.object({
                    content: z.string(),
                }),
                generate: async function* ({content}) {
                    yield <LoadingComponent/>;
                    generateSQL({content})
                    return <SqlWrapper code={content}/>
                },
            },
        },
    });
    return result.value;
}


const testCasesGeneration = async ({content}: { content: string }) => {
    const result = await generateText({
        model: openai('gpt-4o'),
        prompt: `
        You are experienced BA that is rewriting text related to the clinical trials form, especially their choices, fields, items, to the requirements
        Now transform this text into requirements that will be used for test case generation: ${content}`})

    return `
    1) You are experienced QA of digital clinical trials forms
    2) You create test cases based on requirements where each item can be (selection, multiple choice, boolean)
    3) You goal is think how you can test each item to broke it.
    4) Use requirements below to generate test cases:
    Based on requirements: ${result?.text} generate test cases in next format:
                    Step: 'Step to reproduce',
                    Expected Result: 'What are we expecting'`
};

export default testCasesGeneration;