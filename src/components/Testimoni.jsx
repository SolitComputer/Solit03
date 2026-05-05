export default function Testimoni() {
  const videos = [
    {
      src: "/videos/video1.mp4",
    },
    {
      src: "/videos/video2.mp4",
    },
    {
      src: "/videos/video3.mp4",
    },
  ];

  return (
    <section className="px-12 py-20 bg-gray-50 text-center">
      
      <h2 className="text-3xl font-semibold text-blue-900 mb-16">
        Bukti Kepuasan Pelanggan
      </h2>

      {/* Video Grid */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        
        {videos.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
          >
            
            <video
              src={item.src}
              controls
              className="w-[260px] h-[460px] object-cover"
            />

          </div>
        ))}

      </div>

    </section>
  );
}