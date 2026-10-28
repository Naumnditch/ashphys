/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // PDFKit reads its own data files from disk, so it must be loaded from
    // node_modules rather than bundled.
    serverComponentsExternalPackages: ['pdfkit', 'svg-to-pdfkit'],
    // The worksheet and progress-report PDFs read their fonts at runtime;
    // make sure the deployed functions ship them.
    outputFileTracingIncludes: {
      '/api/practice/[topicId]/worksheet': ['./lib/practice/fonts/**/*'],
      '/api/reports/[studentId]/pdf': ['./lib/practice/fonts/**/*']
    }
  }
};

module.exports = nextConfig;
