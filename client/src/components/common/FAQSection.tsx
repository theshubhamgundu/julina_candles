import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What makes Julina Candles & Melts special?',
    answer: 'Julina Candles & Melts is a trusted exporter and supplier of handcrafted decorative candles, scented soy wax candles, and traditional urli candles from Maharashtra, India. We use 100% natural soy wax, therapeutic essential oils, lead-free cotton wicks, and hand-poured floral embeds.'
  },
  {
    question: 'Are your candles safe and non-toxic?',
    answer: 'Yes, 100%. Our candles are made with pure, eco-friendly soy wax which burns soot-free and non-toxic. They are completely safe for indoor air quality around children and pets.'
  },
  {
    question: 'Do you accept bulk, wholesale, and global export orders?',
    answer: 'Yes! We supply wholesalers, retailers, event planners, and international buyers. We offer custom branding, bulk price tier discounts, and export-compliant sturdy packaging. Contact us at pranita311096@gmail.com or +91 7304888197 for bulk quotes.'
  },
  {
    question: 'How long do your scented soy wax candles burn?',
    answer: 'Our jar and urli candles offer extended burn times ranging from 25 to 50+ hours depending on the candle size. For maximum burn efficiency, trim the wick to 1/4 inch before each burn.'
  },
  {
    question: 'How long does shipping take across India and globally?',
    answer: 'Orders within India are dispatched within 24–48 hours and delivered in 3 to 5 business days. International export shipments are coordinated via express air or sea freight with real-time tracking.'
  },
  {
    question: 'How can I contact support regarding my order or custom request?',
    answer: 'You can connect with our customer support team directly on WhatsApp or phone at +91 7304888197 or email us at pranita311096@gmail.com. We are available Monday to Saturday, 10 AM to 7 PM.'
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#FBF6ED] border-t border-[#E6DACB]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#C79A56] uppercase tracking-[0.2em] mb-3">
            <FaQuestionCircle className="text-[#5C2333]" /> Help & Support
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#2A1C22]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Have questions about our handcrafted candles, bulk orders, or global export?
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E6DACB] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-serif font-bold text-[#2A1C22] text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`text-[#5C2333] transition-transform duration-300 shrink-0 text-sm ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans bg-gray-50/50">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
