export default function SosialMedia() {
    const socials = [
        {
            name: "Shopee",
            icon: "/src/assets/shoppe.png",
            link: "https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03",
            color: "from-orange-400 to-orange-600",
        },
        {
            name: "Tokopedia",
            icon: "/src/assets/tokopedia.jpg",
            link: "https://www.tokopedia.com/solit03",
            color: "from-green-400 to-green-600",
        },
        {
            name: "TikTok",
            icon: "/src/assets/tiktok1.png",
            link: "https://www.tiktok.com/@solusi_it03",
            color: "from-pink-500 to-black",
        },
        {
            name: "WhatsApp",
            icon: "/src/assets/wa.png",
            link: "https://wa.me/+6289637377826",
            color: "from-green-400 to-green-600",
        },
        {
            name: "Instagram",
            icon: "/src/assets/ig.png",
            link: "https://www.instagram.com/solit.comp?igsh=MW5sZXExbTJ3bzY5Mg==",
            color: "from-pink-500 to-yellow-400",
        },
        {
            name: "Facebook",
            icon: "/src/assets/fb.png",
            link: "https://www.facebook.com/share/18xXspWL5H/",
            color: "from-blue-500 to-blue-700",
        },
    ];

    return (
        <main>
            {/* HERO */}
            <section className="text-center py-16 px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    Temukan Kami di Sosial Media
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Follow dan hubungi Solit 03 di berbagai platform untuk mendapatkan update terbaru, promo, dan penawaran terbaik.
                </p>
            </section>

            {/* SOCIAL GRID */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {socials.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            className="group relative rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                        >

                            {/* BACKGROUND GLOW */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${item.color}`} />

                            {/* CONTENT */}
                            <div className="relative z-10 flex flex-col items-center text-center">

                                <img
                                    src={item.icon}
                                    className="w-16 h-16 mb-4 transition duration-500 group-hover:scale-110 hover:rounded-full rounded-full"
                                />

                                <h3 className="font-semibold text-lg group-hover:text-white transition">
                                    {item.name}
                                </h3>

                                <p className="text-sm text-gray-500 group-hover:text-white/80 transition">
                                    Klik untuk membuka
                                </p>

                            </div>

                        </a>
                    ))}
                </div>
            </section>

            <section className="text-center pb-20">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    Butuh Respon Cepat?
                </h2>
                <a
                    href="#"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
                >
                    Hubungi Admin via WhatsApp
                </a>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-24">
                <h2 className="text-2xl font-bold mb-6">
                    Lokasi Kami
                </h2>
                <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-md">
                    <iframe
                        src="https://www.google.com/maps?q=Solit%2003%20Depok%20Sawangan&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </main>
    );
}