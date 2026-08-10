import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const PrivacyPolicy: React.FC = () => {
  usePageSEO({
    title: 'Privacy Policy | Julina Candles & Melts',
    description: 'Julina Candles & Melts Privacy Policy — how we collect, use, and protect your personal data when you shop on julinacandles.in.',
    canonical: '/privacy',
    noIndex: false,
  });
  return (
    <div className="min-h-screen bg-cream/20 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-cream2 shadow-sm">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">DATA PRIVACY & SAFETY</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Privacy Policy</h1>
          <p className="text-xs text-muted mt-2">Last Updated: August 10, 2026 • Julina Candles & Melts</p>
        </div>

        <div className="space-y-6 text-sm text-ink leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">1. Introduction</h2>
            <p>
              At <strong>Julina Candles & Melts</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make purchases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">2. Information We Collect</h2>
            <p className="mb-2">We collect information that you voluntarily provide to us when placing an order, registering an account, or subscribing to our newsletter:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-muted">
              <li><strong>Personal Identifiers:</strong> Name, email address, phone number, shipping and billing address.</li>
              <li><strong>Order & Transaction Data:</strong> Purchased items, delivery details, and payment transaction IDs.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and website usage statistics via cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">3. How We Use Your Information</h2>
            <p className="mb-2">We use the collected information for the following business purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-muted">
              <li>To process and fulfill your product orders, shipping, and delivery updates.</li>
              <li>To provide customer support via email, phone, or WhatsApp.</li>
              <li>To send order confirmations, invoices, and promotional offers (with option to unsubscribe).</li>
              <li>To improve our website performance, user experience, and product offerings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">4. Payment Security & Data Protection</h2>
            <p>
              We do not store your complete credit/debit card numbers or bank credentials on our servers. Payment transactions are processed directly through PCI-DSS compliant secure payment partners (Stripe, Razorpay, or bank gateways) with SSL end-to-end encryption.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">5. Data Sharing & Third Parties</h2>
            <p>
              We never sell or rent your personal information to third parties. We share data only with trusted service partners required to fulfill your order (such as logistics/courier partners and payment gateways).
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-serif font-bold text-primary mb-2">6. Contact Our Data Officer</h2>
            <p className="text-xs text-muted">
              If you have any questions or requests regarding your data privacy, please contact:<br />
              <strong>Entity:</strong> Julina Candles & Melts<br />
              <strong>Address:</strong> Hyderabad, Telangana, India<br />
              <strong>Email:</strong> <a href="mailto:pranita311096@gmail.com" className="text-secondary hover:underline">pranita311096@gmail.com</a><br />
              <strong>Phone/WhatsApp:</strong> +91 73048 88197
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link to="/terms" className="text-xs font-semibold text-secondary hover:underline">← Terms & Conditions</Link>
          <Link to="/shipping-policy" className="text-xs font-semibold text-primary hover:underline">Shipping Policy →</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

