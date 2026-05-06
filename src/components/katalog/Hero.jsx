import React from 'react';
import { useCounter } from '../../hooks/useCounter';

function Hero({ onStart }) {
    const { formattedCount } = useCounter();

    const handlePromoClick = () => {
        onStart();
    };

    return (
        <div className="panel active flex flex-col w-full opacity-100 translate-y-0">
            <div
                className="relative rounded-2xl overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-center shadow-md border border-white/30"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,37,64,0.65) 0%, rgba(10,37,64,0.45) 60%, rgba(10,37,64,0.35) 100%), url('https://solit03.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-10-at-00.00.18_362f612d.jpg')`,
                    padding: 'clamp(30px, 6vw, 60px) 20px',
                    minHeight: 'calc((var(--vh) * 100) - var(--topbar-h) - (var(--page-pad) * 2))'
                }}
            >
                <div className="max-w-[min(100%,90vw)]">
                    <div className="text-5xl mb-5" aria-hidden="true">💻</div>
                    <h1 className="text-[clamp(32px,5vw,60px)] font-extrabold text-white mb-2 drop-shadow-lg">
                        <span className="tx-counter">{formattedCount}</span>
                    </h1>
                    <h1 className="text-[clamp(14px,1.1vw,18px)] font-bold text-white/95 -mt-1 mb-4">
                        TRANSAKSI SUKSES DI SOLIT 03
                    </h1>
                    <p className="text-[clamp(16px,1.4vw,22px)] text-white/95 mb-6">#kitaadalahinspirasi</p>

                    <div className="flex gap-3 flex-wrap items-center justify-center mb-4">
                        <button onClick={onStart} className="min-w-[160px] px-5 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-[#4da6ff] to-[#1e90ff] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            🚀 Mulai Pilih
                        </button>
                    </div>

                    <ul className="list-none p-0 mt-5 max-w-full text-left">
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <span className="text-yellow-400 mr-3 text-[clamp(18px,1.4vw,22px)]">★</span>
                            Laptop berkualitas dengan harga terbaik
                        </li>
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <span className="text-yellow-400 mr-3 text-[clamp(18px,1.4vw,22px)]">★</span>
                            Garansi resmi 1 bulan hardware + 1 tahun software
                        </li>
                        <li className="flex items-center mb-3 text-white/95 text-[clamp(16px,1.2vw,20px)]">
                            <span className="text-yellow-400 mr-3 text-[clamp(18px,1.4vw,22px)]">★</span>
                            Bonus tas laptop dan aplikasi original
                        </li>
                    </ul>

                    {/* Penawaran Khusus */}
                    <div className="bg-yellow-500/15 border-2 border-yellow-500 rounded-2xl p-5 text-center shadow-[0_4px_15px_rgba(255,215,0,0.3)] mt-6 max-w-[500px] mx-auto animate-pulse">
                        <h3 className="text-yellow-500 text-[clamp(20px,3vw,28px)] font-extrabold mb-2.5 drop-shadow-md">
                            🔥 Promo Spesial Day 10.10
                        </h3>
                        <button
                            onClick={handlePromoClick}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-3.5 text-[clamp(16px,2vw,20px)] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 min-w-[220px] transition-all"
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