import {DynamicTextRenderer} from "@/components/textWrapper";
import SqlWrapper from "@/components/sql-wrapper";

interface Props {
    role: string
    content: string
    toolName: string | undefined
    tool: any
}

function Message({role, content, toolName, tool}: Props) {
    console.log(tool)
    return <>
        <div className={role === 'assistant' ? `text-sm text-gray-600 bg-blue-50/30 p-2 rounded-md` :
            'text-sm text-gray-600 bg-zinc-50 p-2 rounded-md'}>
            {content.length > 0 &&
               <DynamicTextRenderer text={content}/>}
            {content.length === 0 && <span className="italic font-light">
            {'calling tool: ' + toolName}
                </span>}
        </div>
    </>
}

export default Message;