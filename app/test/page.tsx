'use client';

import {ReactNode, useState} from 'react';
import { Button } from '@/components/ui/button';
import {streamComponent} from "@/app/actions/actions";

export default function Page() {
  const [component, setComponent] = useState<ReactNode>();
  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}