import React from 'react';

const Banner: React.FC = () => {
    const highlights = [
        { icon: '✨', title: '100% Soy Wax', desc: 'Eco-friendly, soot-free clean burn' },
        { icon: '🪔', title: 'Decorative Urli Candles', desc: 'Hand-poured traditional lotus & peacock designs' },
        { icon: '☕', title: 'Coffee Collection', desc: 'Espresso & caramel aroma candles' },
        { icon: '🌸', title: 'Floral Embeds', desc: 'Real dried flower petals & botanical scents' },
        { icon: '🚢', title: 'Global Exporter', desc: 'Supplying wholesalers & retailers worldwide' },
        { icon: '🎁', title: 'Luxury Gift Sets', desc: 'Perfect for festivals, weddings & events' },
        { icon: '🕯️', title: 'Long Burn Time', desc: '25 to 50+ hours of lingering fragrance' },
        { icon: '🇮🇳', title: 'Made in India', desc: 'Handcrafted in Ulhasnagar, Maharashtra' },
    ];

    // Double the array for seamless infinite marquee loop
    const marqueeList = [...highlights, ...highlights];

    return (
        <section className="hidden md:block w-full bg-[#5C2333] py-4 overflow-hidden border-y border-white/10 shadow-inner">
            <div className="relative w-full flex overflow-hidden">
                <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
                    {marqueeList.map((item, i) => (
                        <div key={i} className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-full transition-colors backdrop-blur-sm border border-white/10">
                            <span className="text-2xl flex-shrink-0">{item.icon}</span>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-white leading-tight tracking-wide">{item.title}</span>
                                <span className="text-[11px] text-[#E6DACB] mt-0.5">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Banner;
