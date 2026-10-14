import { redirect } from 'next/navigation';

/** Old address of the join-a-class form; it now lives in the dashboard's Join a Class tab. */
export default function JoinClassPage() {
  redirect('/dashboard?tab=classes');
}
