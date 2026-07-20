import Reveal from "./ui/Reveal";

export default function Location() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white text-center">
      <Reveal as="h2" className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-10 md:mb-12">
        Lokasi <span className="text-blue-600">Toko Offline</span>
      </Reveal>

      <Reveal delay={0.1} className="flex justify-center">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-200 shadow-soft">
          <iframe
            src="https://www.google.com/maps?q=Solit%2003%20Depok%20Sawangan&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Solit 03 Depok Sawangan"
            className="w-full"
          ></iframe>
        </div>
      </Reveal>
    </section>
  );
}
