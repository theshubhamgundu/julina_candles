import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What makes Julina Candles & Melts Rice different from regular white rice?',
    answer: 'Julina Candles & Melts Artisanal Candles is clinically certified with a low Glycemic Index of 51, whereas regular polished white rice ranges between 70-80. Our grains are cold-milled to retain the natural bran layer, making them rich in bioavailable zinc, dietary fiber, and plant-based protein for slow-release energy without sugar spikes.'
  },
  {
    question: 'Is Julina Candles & Melts Artisanal Candles suitable for diabetic and pre-diabetic individuals?',
    answer: 'Yes, absolutely. Because of its premium-51 rating, it releases glucose slowly into the bloodstream over 3-4 hours. This prevents the sudden post-meal insulin surges and glucose spikes, making it highly recommended by doctors for diabetes management and pre-diabetic care.'
  },
  {
    question: 'What weight options are available for purchase?',
    answer: 'We provide flexible options to suit every household: 1 kg (trial pack), 5 kg, 10 kg, and 25 kg bags. You can select your preferred weight variant directly on the product details page.'
  },
  {
    question: 'Are your products tested for pesticides and heavy metals?',
    answer: 'Yes, 100%. Quality assurance is our highest priority. Every batch is rigorously tested in accredited laboratories and certified free of harmful chemical residues, heavy metals, and pesticides under global US and European quality standards.'
  },
  {
    question: 'How long does delivery take and how can I track my order?',
    answer: 'We dispatch all orders within 24 hours. Delivery across India typically takes 3 to 5 business days. Once shipped, you will receive a tracking link and automated delivery status updates directly on your WhatsApp number.'
  },
  {
    question: 'How can I contact support if I have queries about my order?',
    answer: 'You can reach our dedicated customer support team directly via WhatsApp support at +91 7032987770. We are available 7 days a week to help resolve shipping, delivery, or product queries.'
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#faf6ee] border-t border-[#ede3cf]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-sans font-bold text-secondary uppercase tracking-[0.2em] mb-3">
            <FaQuestionCircle className="text-[#185e33]" /> Help & Support
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Have questions about our premium products or shipping? We have answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#ede3cf] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-serif font-bold text-gray-800 text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`text-[#185e33] transition-transform duration-300 shrink-0 text-sm ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-gray-100' : 'max-h-0'
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

