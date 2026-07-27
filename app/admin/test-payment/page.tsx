import { TestPaymentPortal } from '@/components/admin/TestPaymentPortal';

export default function AdminTestPaymentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Shopier Test Payment</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xl">
        Shopier has no separate sandbox — this sends a real, live charge to whatever card you enter on their payment
        page. Keep the test amount small. On return, this checks the signed callback and shows whether the
        integration verified correctly.
      </p>
      <TestPaymentPortal />
    </div>
  );
}
