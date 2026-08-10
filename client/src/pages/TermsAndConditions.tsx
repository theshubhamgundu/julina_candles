import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const TermsAndConditions: React.FC = () => {
  usePageSEO({
    title: 'Terms & Conditions | Julina Candles & Melts',
    description: 'Read the Terms & Conditions for using Julina Candles & Melts (julinacandles.in) — governing purchases, payments, returns, and usage of our website and products.',
    canonical: '/terms',
    noIndex: false,
  });
  return (
    <div className="min-h-screen bg-cream/20 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-cream2 shadow-sm">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">LEGAL & COMPLIANCE</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Terms & Conditions</h1>
          <p className="text-xs text-muted mt-2">Last Updated: July 24, 2026 • Julina Candles & Melts (Myotrixnutrition LLP)</p>
        </div>

        <div className="space-y-6 text-sm text-ink leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">1. Overview & Agreement</h2>
            <p>
              Welcome to <strong>Julina Candles & Melts</strong> (operated by <strong>Myotrixnutrition LLP</strong>). By accessing our website, purchasing our Artisanal Candles products, or utilizing our services, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">2. Health & Nutritional Disclaimer</h2>
            <p>
              Julina Candles & Melts Artisanal Candles is clinically tested (GI 51) and developed in partnership with ICAR-IIRR. However, our products are nutritional food items and are not intended to replace medical treatment, prescription diabetic medication, or professional clinical diagnosis. Always consult your doctor or healthcare provider regarding medical conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">3. Product & Pricing Information</h2>
            <p>
              All prices listed on our website are in Indian Rupees (INR) and inclusive of applicable GST taxes. We reserve the right to update product prices, promotional discounts, and availability without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">4. Orders & Payment Processing</h2>
            <p>
              Orders placed through our website are subject to acceptance and stock availability. Payments are securely processed via authorized payment gateways (Stripe, UPI, Net Banking, Credit/Debit Cards). Upon order confirmation, you will receive an invoice via email or SMS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">5. Intellectual Property</h2>
            <p>
              All trademarks, product designs, logos, images, and content on this website are the exclusive property of Myotrixnutrition LLP. Unauthorized reproduction or commercial distribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-primary mb-2">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-serif font-bold text-primary mb-2">7. Contact Information</h2>
            <p className="text-xs text-muted">
              For any legal inquiries regarding these Terms & Conditions, please contact us:<br />
              <strong>Entity:</strong> Myotrixnutrition LLP (Julina Candles & Melts)<br />
              <strong>Address:</strong> 8-3-1/14, Road No 2B, Virat Nagar, Hyderabad, Telangana - 500097, India<br />
              <strong>Email:</strong> <a href="mailto:myotrixnutrition@gmail.com" className="text-secondary hover:underline">myotrixnutrition@gmail.com</a> | <strong>Phone/WhatsApp:</strong> +91 70329 87770
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link to="/" className="text-xs font-semibold text-secondary hover:underline">← Back to Home</Link>
          <Link to="/privacy" className="text-xs font-semibold text-primary hover:underline">Read Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

