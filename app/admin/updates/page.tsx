import { SiteUpdateManager } from '@/components/admin/SiteUpdateManager';

export const dynamic = 'force-dynamic';

export default function AdminSiteUpdatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">What&rsquo;s New (homepage)</h1>
      <p className="text-gray-500 text-sm mb-8">
        Announcements with a short video for the homepage hero. The newest published one is shown there; older ones are
        listed under &ldquo;Previous updates&rdquo;. Render the videos with the pipeline in <code>video/</code> (see
        video/README.md), upload them here, then publish.
      </p>
      <SiteUpdateManager />
    </div>
  );
}
