import { useState } from "react";

export default function TeamSlider() {
  const [index, setIndex] = useState(0);

  const members = [
    { name: "Reinaldy", role: "CEO", img: "/src/assets/reinaldy.webp" },
    { name: "Niva", role: "HRD", img: "/src/assets/sewa1.webp" },
    { name: "Rafi", role: "Marketing", img: "/src/assets/sewa2.webp" },
    { name: "Adit", role: "Tech", img: "/src/assets/sewa2.webp" },
    { name: "Fajar", role: "Admin", img: "/src/assets/sewa2.webp" },
    { name: "Dika", role: "Support", img: "/src/assets/sewa2.webp" },
  ];

  const prev = () => {
    setIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % members.length);
  };

  return (
    <section className="py-24 text-center overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-16">
        Team Solit
      </h2>

      {/* 3D */}
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        <div className="relative w-full max-w-6xl h-[420px] flex items-center justify-center">

          {members.map((member, i) => {
            let offset = i - index;

            // looping biar ga lompat
            if (offset > members.length / 2) offset -= members.length;
            if (offset < -members.length / 2) offset += members.length;

            // hanya render sekitar tengah (biar ringan)
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;

            return (
              <div
                key={i}
                onClick={() => {
                  if (offset === 1) next();
                  if (offset === -1) prev();
                }}
                className="absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `
                    translateX(${offset * 260}px)
                    translateZ(${-Math.abs(offset) * 200}px)
                    rotateY(${offset * -25}deg)
                    scale(${1 - Math.abs(offset) * 0.15})
                  `,
                  zIndex: 50 - Math.abs(offset),
                  filter: `blur(${Math.abs(offset) * 1}px)`,
                  opacity: isCenter ? 1 : 0.6,
                  willChange: "transform",
                }}
              >
                <div
                  className={`bg-white rounded-2xl shadow-2xl p-4 w-64 md:w-72 transition ${
                    !isCenter ? "cursor-pointer" : ""
                  }`}
                >
                  <img
                    src={member.img}
                    className="w-full h-72 object-cover rounded-xl"
                  />

                  <h3 className="mt-4 font-bold text-lg">
                    {member.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={prev}
          className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          ←
        </button>

        <button
          onClick={next}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          →
        </button>
      </div>
    </section>
  );
}