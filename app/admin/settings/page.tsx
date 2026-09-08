import { getBankSettings } from '@/lib/settings';
import { BankSettingsForm } from '@/components/admin/BankSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const bank = await getBankSettings();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Settings</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-2xl">
        Bank transfer is the one rail that needs no processor approval. Students see these details on the pricing
        page along with their own reference code, then you confirm the transfer and grant access under Subscriber
        Access.
      </p>
      <BankSettingsForm initial={bank} />
    </div>
  );
}
