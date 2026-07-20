import Reveal from "./ui/Reveal";

export default function Testimoni() {
  const videos = [
    { src: "/videos/video1.mp4" },
    { src: "/videos/video2.mp4" },
    { src: "/videos/video3.mp4" },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-slate-50 text-center">

      <Reveal as="h2" className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-10 md:mb-12">
        Bukti <span className="text-blue-600">Kepuasan Pelanggan</span>
      </Reveal>

      {/* Video Grid */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-6 max-w-5xl mx-auto">

        {videos.map((item, index) => (
          <Reveal
            key={index}
            delay={index * 0.12}
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-soft-lg transition duration-300 hover:-translate-y-1 w-full sm:w-auto"
          >
            <video
              src={item.src}
              controls
              className="w-full sm:w-48 md:w-52 h-80 sm:h-96 object-cover"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
