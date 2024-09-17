'use client';
import {useChat} from 'ai/react';
import {CornerDownLeft, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import Instruction from "@/components/instruction";
import {useRef, useEffect} from 'react';
import {questions} from "@/components/questions";
import Role from "@/components/role";
import Message from "@/components/Message";

export default function Chat() {
    const {messages, input, handleInputChange, handleSubmit, setMessages, setInput, data,} = useChat({
        maxToolRoundtrips: 2,
        onResponse: () => {
            scrollToBottom();
        },
    });

    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const onReset = () => {
        setMessages([]);
    };

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return <>
        <div className="flex flex-col w-full max-w-[768px] py-24 mx-auto stretch">
            {messages.length > 0 && (
                <Button
                    onClick={onReset}
                    className={'text-zinc-500 absolute top-5 right-10 hover:text-red-400'}
                    variant={'ghost'}>
                    Reset conversation<Trash className={'ml-2'}/>
                </Button>
            )}
            <div className="space-y-4">
                {messages.length > 0 ? (
                    messages.map((m) => (
                        <div key={m.id} className="whitespace-pre-wrap">
                            <div>
                                <Role role={m.role}/>
                                <Message tool={data} content={m.content} role={m.role}
                                         toolName={m?.toolInvocations?.[0]?.toolName}/>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <Instruction/>
                    </div>
                )}
                <div ref={endOfMessagesRef}/>
            </div>
            <form onSubmit={handleSubmit}>
                <div
                    className="fixed text-zinc-500 text-sm bottom-0 w-full max-w-[768px] p-3 mb-8 border border-gray-300 rounded shadow-xl">
                    {messages.length <= 0 &&
                        <div className="text-xs w-full absolute flex justify-between -top-14 left-0">
                            {questions.map(({question}, index) =>
                                <Button type={'button'} className={'opacity-60 font-normal'} key={index}
                                        variant={'secondary'}
                                        onClick={() => setInput(question)}>{question}</Button>)}
                        </div>}
                    <input
                        className="w-[90%] p-1 rounded-md outline-none bg-transparent resize-none"
                        value={input}
                        placeholder="Ask something..."
                        onChange={handleInputChange}/>
                    <Button type={'submit'} className="absolute right-2 top-2 text-zinc-500" size="sm" variant="ghost">
                        <CornerDownLeft/>
                    </Button>
                </div>
            </form>
        </div>
    </>
}


