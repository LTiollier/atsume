import type { Metadata } from 'next';
import { PlanningClient } from './PlanningClient';

export const metadata: Metadata = {
    title: 'Planning — Atsume',
};

export default function PlanningPage() {
    return <PlanningClient />;
}
