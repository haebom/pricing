import { EXAMPLES } from '@/lib/examples';
import ExampleApplyClient from './ExampleApplyClient';

export const dynamicParams = false;
export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ id: e.id }));
}

export default async function ExampleApplyPage({ params }: { params: any }) {
  const { id } = await params;
  return <ExampleApplyClient id={id} />;
}