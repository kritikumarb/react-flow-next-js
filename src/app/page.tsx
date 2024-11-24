'use client';

import dynamic from 'next/dynamic';

const FlowDemo = dynamic(() => import('@/components/FlowDemo'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="p-10">
      <FlowDemo />
    </div>
  );
}
