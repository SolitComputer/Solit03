export default function Location() {
  return (
    <section className="px-4 sm:px-6 py-10 md:py-12 bg-gray-50 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-900 mb-6 md:mb-10">
        Lokasi Toko Offline
      </h2>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-md">
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
      </div>
    </section>
  );
}