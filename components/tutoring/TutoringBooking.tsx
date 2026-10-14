'use client';

import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics/client';

/** Window name the embedded (dashboard) checkout opens Shopier in. */
const CHECKOUT_WINDOW = 'ashphys-shopier-checkout';

/**
 * `checkoutInNewTab` (the dashboard): Shopier's payment page opens in a new
 * tab so the dashboard stays open. The tab is opened synchronously on the
 * click (popup blockers only allow that), then the signed form is posted
 * into it. If the browser blocks the tab, checkout falls back to this tab.
 */
export function TutoringBooking({
  addonSlug,
  price,
  checkoutInNewTab = false,
}: {
  addonSlug: string;
  price: number;
  checkoutInNewTab?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<string>('_self');
  const [openedElsewhere, setOpenedElsewhere] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<Record<string, string> | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fields && paymentUrl && formRef.current) {
      formRef.current.submit();
      if (formRef.current.target === CHECKOUT_WINDOW) {
        setOpenedElsewhere(true);
        setLoading(false);
      } else {
        setRedirecting(true);
      }
    }
  }, [fields, paymentUrl]);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    setOpenedElsewhere(false);
    let checkoutWindow: Window | null = null;
    if (checkoutInNewTab) {
      checkoutWindow = window.open('', CHECKOUT_WINDOW);
      setTarget(checkoutWindow ? CHECKOUT_WINDOW : '_self');
    }
    trackEvent({ eventType: 'subscribe_click', metadata: { addon: addonSlug } });
    try {
      const res = await fetch('/api/payments/shopier/addon-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addonSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        checkoutWindow?.close();
        setError(data.error || 'Could not start checkout');
        setLoading(false);
        return;
      }
      setFields(data.fields);
      setPaymentUrl(data.paymentUrl);
    } catch {
      checkoutWindow?.close();
      setError('Network error — please try again');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {openedElsewhere && (
        <p role="status" className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
          Shopier&rsquo;s secure payment page opened in a new tab. Finish paying there — your booking appears below once
          the payment is confirmed.
        </p>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="min-h-[44px] bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {redirecting ? 'Redirecting to Shopier…' : loading ? 'Starting checkout…' : `Book & Pay ${price.toFixed(0)} TRY`}
      </button>

      {fields && paymentUrl && (
        <form ref={formRef} action={paymentUrl} method="POST" target={target} className="hidden">
          {Object.entries(fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}
