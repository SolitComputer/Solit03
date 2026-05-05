export default function Location() {
  return (
    <section className="px-12 py-20 bg-gray-50 text-center">
      
      <h2 className="text-3xl font-semibold text-blue-900 mb-16">
        Lokasi Toko Offline
      </h2>

      <div className="flex justify-center mb-20">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps?q=Depok&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}