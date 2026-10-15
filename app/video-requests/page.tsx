import { redirect } from 'next/navigation';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Old address of video solve requests; they now live in the dashboard's
 * Video Solve Requests tab. ?lesson=<id> (pre-selects a lesson) is kept.
 */
export default function VideoRequestsPage({ searchParams }: { searchParams: { lesson?: string } }) {
  const lesson = searchParams.lesson && UUID.test(searchParams.lesson) ? `&lesson=${searchParams.lesson}` : '';
  redirect(`/dashboard?tab=videos${lesson}`);
}
