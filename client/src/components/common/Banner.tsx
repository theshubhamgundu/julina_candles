import React from 'react';

const Banner: React.FC = () => {
    const highlights = [
        { icon: '🌾', title: 'GI 51 Certified', desc: 'Clinically tested low glycemic index' },
        { icon: '🌿', title: '100% Pesticide Free', desc: 'Pure, unadulterated organic harvest' },
        { icon: '❤️', title: 'Diabetes & Heart Friendly', desc: 'Doctor-guided metabolic nutrition' },
        { icon: '🔬', title: 'ICAR-IIRR Partner', desc: 'Backed by national research' },
        { icon: '🍚', title: 'Hand-Pounded Grains', desc: 'Preserves natural bran & vitamins' },
        { icon: '⚡', title: 'Slow-Release Carbs', desc: 'Prevents post-meal blood sugar spikes' },
        { icon: '🛡️', title: 'Zero Preservatives', desc: 'Fresh & 100% natural processing' },
        { icon: '🌱', title: 'Sustained Energy', desc: 'Keeps you full & energetic longer' },
    ];

    // Double the array for seamless infinite marquee loop
    const marqueeList = [...highlights, ...highlights];

    return (
        <section className="hidden md:block w-full bg-[#185e33] py-4 overflow-hidden border-y border-white/10 shadow-inner">
            <div className="relative w-full flex overflow-hidden">
                <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
                    {marqueeList.map((item, i) => (
                        <div key={i} className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-full transition-colors backdrop-blur-sm border border-white/10">
                            <span className="text-2xl flex-shrink-0">{item.icon}</span>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-white leading-tight tracking-wide">{item.title}</span>
                                <span className="text-[11px] text-cream/80 mt-0.5">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Banner;

