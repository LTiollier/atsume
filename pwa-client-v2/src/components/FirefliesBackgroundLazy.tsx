'use client'

import dynamic from 'next/dynamic';

// dynamic + ssr:false must live in a Client Component (Server Components disallow it).
// This thin wrapper lets Server Components (not-found, global-error) import
// FirefliesBackground without pulling Three.js into the initial bundle.
const FirefliesBackground = dynamic(() => import('./FirefliesBackground'), { ssr: false });

export default FirefliesBackground;
