export default function Testimoni() {
  const videos = [
    { src: "/videos/video1.mp4" },
    { src: "/videos/video2.mp4" },
    { src: "/videos/video3.mp4" },
  ];

  return (
    <section className="px-4 sm:px-6 py-10 md:py-12 bg-gray-50 text-center">

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-900 mb-6 md:mb-10">
        Bukti Kepuasan Pelanggan
      </h2>

      {/* Video Grid */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-6 max-w-5xl mx-auto">

        {videos.map((item, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-1 w-full sm:w-auto"
          >
            <video
              src={item.src}
              controls
              className="w-full sm:w-48 md:w-52 h-80 sm:h-96 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}