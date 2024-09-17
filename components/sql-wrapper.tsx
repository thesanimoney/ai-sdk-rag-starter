'use client'

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import {materialDark, materialLight, materialOceanic} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from 'react';
import {Button} from "@/components/ui/button";

interface Props {
    code: string;
}

const CodeBlock = ({ code }: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const refinedCode = code.replace('```sql', '');

    return (
        <div className="relative rounded-md">
            <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 py-0.5 text-xs z-10"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </Button>
            <SyntaxHighlighter
                style={materialOceanic}
                customStyle={{ borderRadius: '5px', fontSize: '0.9rem', padding: '1rem' }}
                showLineNumbers
                wrapLines
                language={'sql'}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
