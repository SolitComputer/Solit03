import React from 'react';
import { useCounter } from '../../hooks/useCounter';
import { Laptop, Rocket, Star, Flame } from 'lucide-react';

function Hero({ onStart }) {
    const { formattedCount } = useCounter();

    const handlePromoClick = () => {
        onStart();
    };

    return (
        <div className="panel active flex flex-col w-full opacity-100 translate-y-0">
            <div
                className="relative rounded-2xl overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-center shadow-soft-lg border border-white/20"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,37,64,0.65) 0%, rgba(10,37,64,0.45) 60%, rgba(10,37,64,0.35) 100%), url('https://solit03.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-10-at-00.00.18_362f612d.jpg')`,
                    padding: 'clamp(30px, 6vw, 60px) 20px',
                    minHeight: 'calc((var(--vh) * 100) - var(--topbar-h) - (var(--page-pad) * 2))'
                }}
            >
                <div className="max-w-[min(100%,90vw)]">
                    <div className="flex justify-center mb-5"><Laptop className="w-12 h-12 text-white" aria-hidden="true" /></div>
                    <h1 className="text-[clamp(32px,5vw,60px)] font-extrabold text-white mb-2 drop-shadow-lg">
                        <span className="tx-counter">{formattedCount}</span>
                    </h1>
                    <h1 className="text-[clamp(14px,1.1vw,18px)] font-bold text-white/95 -mt-1 mb-4">
                        TRANSAKSI SUKSES DI SOLIT 03
                    </h1>
                    <p className="text-[clamp(16px,1.4vw,22px)] text-white/95 mb-6">#kitaadalahinspirasi</p>

                    <div className="flex gap-3 flex-wrap items-center justify-center mb-4">
                        <button onClick={onStart} className="btn btn-primary min-w-[160px] px-5 py-3.5 text-base inline-flex items-center justify-center gap-2">
                            <Rocket className="w-5 h-5" aria-hidden="true" /> Mulai Pilih
                        </button>
                    </div>

                    <ul className="list-none p-0 mt-5 max-w-full text-left">
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <Star className="text-blue-400 mr-3 w-[22px] h-[22px] flex-shrink-0 fill-blue-400" aria-hidden="true" />
                            Laptop berkualitas dengan harga terbaik
                        </li>
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <Star className="text-blue-400 mr-3 w-[22px] h-[22px] flex-shrink-0 fill-blue-400" aria-hidden="true" />
                            Garansi resmi 1 bulan hardware + 1 tahun software
                        </li>
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <Star className="text-blue-400 mr-3 w-[22px] h-[22px] flex-shrink-0 fill-blue-400" aria-hidden="true" />
                            Bonus tas laptop dan aplikasi original
                        </li>
                    </ul>

                    {/* Penawaran Khusus */}
                    <div className="bg-surface/10 backdrop-blur-md border border-blue-300/40 rounded-2xl p-5 text-center shadow-soft mt-6 max-w-[500px] mx-auto">
                        <h3 className="text-blue-200 text-[clamp(20px,3vw,28px)] font-extrabold mb-2.5 drop-shadow-md inline-flex items-center justify-center gap-2">
                            <Flame className="w-6 h-6" aria-hidden="true" /> Promo Spesial Day 10.10
                        </h3>
                        <button
                            onClick={handlePromoClick}
                            className="btn btn-primary px-6 py-3.5 text-[clamp(16px,2vw,20px)] min-w-[220px]"
                        >
                            Diskon Sampai Rp 500.000
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;