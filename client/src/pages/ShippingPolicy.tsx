import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const ShippingPolicy: React.FC = () => {
  usePageSEO({
    title: 'Shipping Policy | Julina Candles & Melts',
    description: 'Julina Candles & Melts Shipping Policy — all orders dispatched within 24 hours. Pan-India delivery in 3–5 business days with WhatsApp tracking updates.',
    canonical: '/shipping-policy',
  });
  return (
    <div className="min-h-screen bg-cream/20 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-cream2 shadow-sm">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">ORDER FULFILLMENT</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Shipping & Delivery Policy</h1>
          <p className="text-xs text-muted mt-2">Last Updated: July 24, 2026 • Julina Candles & Melts</p>
        </div>

        <div className="space-y-6 text-sm text-ink leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">1. Shipping Locations</h2>
            <p>
              Julina Candles & Melts provides express delivery across India as well as worldwide export shipments for wholesale and bulk orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">2. Processing & Dispatch Time</h2>
            <p>
              All orders are processed and dispatched within <strong>24 to 48 hours</strong> (excluding Sundays and national holidays) after order confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">3. Delivery Timelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-muted">
              <li><strong>Domestic Orders (India):</strong> 3 to 5 business days.</li>
              <li><strong>International Export Shipments:</strong> Coordinated with express air/sea freight logistics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">4. Order Tracking</h2>
            <p>
              Once your shipment is dispatched, a tracking ID and link will be sent via SMS and email. You can also view active order status under <strong>My Orders</strong> in your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">5. Contact Support</h2>
            <p>
              For shipping inquiries or tracking assistance, please contact us at <a href="mailto:pranita311096@gmail.com" className="text-secondary hover:underline">pranita311096@gmail.com</a> or WhatsApp <strong>+91 73048 88197</strong>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link to="/privacy" className="text-xs font-semibold text-secondary hover:underline">← Privacy Policy</Link>
          <Link to="/refund-policy" className="text-xs font-semibold text-primary hover:underline">Refund Policy →</Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

