import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const RefundPolicy: React.FC = () => {
  usePageSEO({
    title: 'Refund & Returns Policy | Julina Candles & Melts',
    description: 'Julina Candles & Melts Refund & Returns Policy — 7-day return window, hassle-free refund process for all Artisanal Candles orders placed on julinacandles.in.',
    canonical: '/refund-policy',
  });
  return (
    <div className="min-h-screen bg-cream/20 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-cream2 shadow-sm">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">RETURNS & GUARANTEE</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Refund & Return Policy</h1>
          <p className="text-xs text-muted mt-2">Last Updated: August 10, 2026 • Julina Candles & Melts</p>
        </div>

        <div className="space-y-6 text-sm text-ink leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">1. Return Eligibility</h2>
            <p>
              Returns are accepted if the product arrives with damaged packaging, the candle/melt is defective, or an incorrect item was delivered. Products must be unused and in original condition to be eligible for return.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">2. Reporting Issues with Deliveries</h2>
            <p>
              Please notify our customer support team within <strong>48 hours</strong> of delivery by emailing photos/videos of any issues with your package to <a href="mailto:pranita311096@gmail.com" className="text-secondary hover:underline">pranita311096@gmail.com</a> or messaging us on WhatsApp at <strong>+91 73048 88197</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">3. Refund Process & Timelines</h2>
            <p>
              Once approved, replacements are dispatched immediately or refunds are issued to your original payment method (bank account, UPI, credit card) within <strong>5 to 7 business days</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">4. Order Cancellations</h2>
            <p>
              Orders can be cancelled free of charge prior to dispatch. Once a shipment has been handed over to our courier partner, cancellations are no longer accepted.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link to="/shipping-policy" className="text-xs font-semibold text-secondary hover:underline">← Shipping Policy</Link>
          <Link to="/terms" className="text-xs font-semibold text-primary hover:underline">Terms & Conditions →</Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

