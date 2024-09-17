import {Bot, Smile} from "lucide-react";

function Role({role}: {role: string}) {
    return <>
        <h4 className="font-bold mb-1 flex gap-x-1 items-center">
            {role === 'assistant' ? (
                <div className={'rounded-full bg-blue-100 p-1'}>
                    <Bot/>
                </div>
            ) : (
                <div className={'rounded-full bg-zinc-100 p-1'}>
                    <Smile/>
                </div>
            )}
            {role[0].toUpperCase() + role.slice(1)}
        </h4>
    </>
}

export default Role;