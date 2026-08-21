import { useState, useEffect } from "react";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import SplitText from "./ui/SplitText";
import { getTestimonials } from "../services/siteContent";

const DEFAULT_VIDEOS = [
  { id: "d1", video_url: "/videos/video1.mp4" },
  { id: "d2", video_url: "/videos/video2.mp4" },
  { id: "d3", video_url: "/videos/video3.mp4" },
];

export default function Testimoni() {
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);

  useEffect(() => {
    getTestimonials()
      .then((data) => { if (data.length) setVideos(data); })
      .catch(() => {});
  }, []);

  if (videos.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-surface-muted text-center">

      <div className="mb-10 md:mb-12">
        <span className="eyebrow">Testimoni</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content mt-5">
          <SplitText as="span" text="Bukti " />
          <span className="text-blue-600">Kepuasan Pelanggan</span>
        </h2>
        <p className="text-sm md:text-base text-content-muted mt-3 max-w-lg mx-auto">
          Cerita nyata dari pelanggan yang sudah membuktikan kualitas Solit 03.
        </p>
      </div>

      {/* Video Grid */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-6 max-w-5xl mx-auto">

        {videos.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.12} className="w-full sm:w-auto">
            <TiltCard
              max={5}
              scale={1.03}
              glare={false}
              className="rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
            >
              <video
                src={item.video_url}
                controls
                className="w-full sm:w-48 md:w-52 h-80 sm:h-96 object-cover"
              />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
