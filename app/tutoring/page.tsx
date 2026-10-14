import { redirect } from 'next/navigation';

/** Old address of 1-on-1 tutoring; booking now happens in the dashboard's Tutoring tab. */
export default function TutoringPage() {
  redirect('/dashboard?tab=tutoring');
}
