import Link from 'next/link';
import { query } from '@/lib/db/client';
import { getCurrentUser } from '@/lib/auth/session';
import { getBankSettings, paymentReference } from '@/lib/settings';

export const dynamic = 'force-dynamic';

interface Plan {
  id: string;
  name: string;
  slug: string;
  tier_level: number;
  description: string | null;
  price_monthly: string;
  price_yearly: string;
  features: string[] | null;
  shopier_url_monthly: string | null;
  shopier_url_yearly: string | null;
}

async function getPlans(): Promise<Plan[]> {
  const res = await query(
    `SELECT id, name, slug, tier_level, description, price_monthly, price_yearly, features,
            shopier_url_monthly, shopier_url_yearly
     FROM subscription_plans WHERE is_active ORDER BY tier_level`
  );
  return res.rows;
}

export default async function PricingPage() {
  const [plans, user, bank] = await Promise.all([getPlans(), getCurrentUser(), getBankSettings()]);
  const reference = user ? paymentReference(user.id) : null;

  return (
    <div className="min-h-screen bg-[#faf7f0]" style={{ backgroundImage: 'radial-gradient(#e6ddc4 0.6px, transparent 0.6px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-2">Cambridge IGCSE Physics · 0625</p>
        <h1 className="text-[34px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Plans
        </h1>
        <p className="text-[14.5px] text-[#4a5a72] leading-snug mb-10 max-w-2xl">
          Every lesson, every interactive simulation, and the full practice engine — built by a working IGCSE Physics
          teacher, not a content farm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((p) => {
            const isFree = p.tier_level === 0;
            const features: string[] = Array.isArray(p.features) ? p.features : [];
            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl p-6 flex flex-col ${
                  p.tier_level === 1 ? 'border-[#b8823d] shadow-sm' : 'border-[#e4ddcc]'
                }`}
              >
                {p.tier_level === 1 && (
                  <span className="self-start text-[10px] font-bold uppercase tracking-wide bg-[#f6efdc] text-[#8f6428] px-2 py-0.5 rounded-full mb-3">
                    Most popular
                  </span>
                )}
                <h2 className="text-[20px] font-bold text-[#1b2a41] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {p.name}
                </h2>
                <div className="mb-3">
                  <span className="text-[30px] font-bold text-[#1b2a41]">{isFree ? '0' : parseFloat(p.price_monthly).toFixed(0)}</span>
                  <span className="text-[13px] text-[#4a5a72] ml-1">TRY / month</span>
                  {!isFree && parseFloat(p.price_yearly) > 0 && (
                    <div className="text-[12px] text-[#4a5a72] mt-0.5">
                      or {parseFloat(p.price_yearly).toFixed(0)} TRY / year
                    </div>
                  )}
                </div>
                {p.description && <p className="text-[12.5px] text-[#4a5a72] leading-snug mb-4">{p.description}</p>}
                {features.length > 0 && (
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="text-[12.5px] text-[#4a5a72] flex gap-2">
                        <span className="text-[#2e7d6b] flex-shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-2 space-y-2">
                  {isFree ? (
                    <Link
                      href={user ? '/curriculum' : '/auth/signup'}
                      className="block text-center text-[13px] font-semibold px-4 py-2.5 rounded-lg border border-[#d8cfb6] text-[#1b2a41] hover:bg-[#faf7f0]"
                    >
                      {user ? 'Browse the curriculum' : 'Create a free account'}
                    </Link>
                  ) : (
                    <>
                      {p.shopier_url_monthly ? (
                        <a
                          href={p.shopier_url_monthly}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-[#1b2a41] text-white hover:bg-[#243a5e]"
                        >
                          Subscribe monthly
                        </a>
                      ) : (
                        <span className="block text-center text-[12.5px] px-4 py-2.5 rounded-lg bg-[#f5f0e2] text-[#8f6428]">
                          Checkout link coming soon
                        </span>
                      )}
                      {p.shopier_url_yearly && (
                        <a
                          href={p.shopier_url_yearly}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center text-[13px] font-semibold px-4 py-2.5 rounded-lg border border-[#1b2a41] text-[#1b2a41] hover:bg-[#faf7f0]"
                        >
                          Subscribe yearly
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {bank.enabled && bank.iban && (
          <div className="bg-white border-2 border-[#2e7d6b] rounded-xl p-6 mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-[16px] font-bold text-[#1b2a41]" style={{ fontFamily: 'Georgia, serif' }}>
                Pay by bank transfer
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wide bg-[#e6f2ee] text-[#1b5c4d] px-2 py-0.5 rounded-full">
                No card needed
              </span>
            </div>
            <p className="text-[13px] text-[#4a5a72] leading-snug mb-4">
              Transfer the amount for the plan you want to the account below, putting your reference code in the
              description so the payment can be matched to you.
            </p>

            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded-lg p-4 mb-4 space-y-2.5">
              {bank.accountName && (
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-[12px] text-[#4a5a72]">Account holder</span>
                  <span className="font-mono text-[13px] font-bold text-[#1b2a41]">{bank.accountName}</span>
                </div>
              )}
              {bank.bankName && (
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-[12px] text-[#4a5a72]">Bank</span>
                  <span className="font-mono text-[13px] text-[#1b2a41]">{bank.bankName}</span>
                </div>
              )}
              <div className="flex flex-wrap justify-between gap-2 items-baseline border-t border-[#eee6d3] pt-2.5">
                <span className="text-[12px] text-[#4a5a72]">IBAN</span>
                <span className="font-mono text-[14px] font-bold text-[#1b2a41] tracking-wide break-all">{bank.iban}</span>
              </div>
            </div>

            <div className={`rounded-lg p-4 ${reference ? 'bg-[#e6f2ee] border border-[#2e7d6b]' : 'bg-[#f6efdc] border border-[#e6d9b8]'}`}>
              {reference ? (
                <>
                  <div className="text-[11px] font-mono uppercase tracking-wide text-[#1b5c4d] mb-1">
                    Your payment reference — put this in the transfer description
                  </div>
                  <div className="font-mono text-[24px] font-bold text-[#1b5c4d] tracking-wider">{reference}</div>
                  <p className="text-[11.5px] text-[#1b5c4d] mt-1.5 leading-snug">
                    Without this code the transfer cannot be matched to your account, and activation will be delayed.
                  </p>
                </>
              ) : (
                <p className="text-[12.5px] text-[#8f6428] leading-snug">
                  <Link href="/auth/signup" className="underline font-semibold">Create your free account</Link> first —
                  you will then be shown a unique reference code to include with your transfer.
                </p>
              )}
            </div>

            {bank.note && <p className="text-[12px] text-[#4a5a72] leading-snug mt-3">{bank.note}</p>}
          </div>
        )}

        <div className="bg-white border border-[#e4ddcc] rounded-xl p-6">
          <h2 className="text-[15px] font-bold text-[#1b2a41] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            How subscribing works
          </h2>
          <ol className="space-y-2.5 text-[13px] text-[#4a5a72] leading-snug">
            <li>
              <strong className="text-[#1b2a41]">1.</strong>{' '}
              {user ? 'You already have an account — good.' : (
                <>
                  <Link href="/auth/signup" className="text-[#2e7d6b] underline font-semibold">Create your free account</Link> first,
                  using the email you will pay with.
                </>
              )}
            </li>
            <li>
              <strong className="text-[#1b2a41]">2.</strong> Choose a plan above and complete the payment on the secure
              checkout page.
            </li>
            <li>
              <strong className="text-[#1b2a41]">3.</strong> Your access is activated within 24 hours — usually much
              sooner. You will get an email once it is live.
            </li>
          </ol>
          <p className="text-[12px] text-[#a8a196] mt-4 leading-snug">
            Paid a different way, or access not showing up? Email{' '}
            <span className="font-mono text-[#4a5a72]">naumnditch572@gmail.com</span> with the payment reference and it
            will be sorted the same day.
          </p>
        </div>
      </div>
    </div>
  );
}
