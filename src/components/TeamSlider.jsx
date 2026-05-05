import { useState } from "react";

export default function TeamSlider() {
  const [index, setIndex] = useState(0);

  const members = [
    {
      name: "Reinaldy",
      role: "CEO",
      img: "/src/assets/team1.png",
    },
    {
      name: "Niva",
      role: "HRD",
      img: "/src/assets/team2.png",
    },
    {
      name: "Rafi",
      role: "Marketing",
      img: "/src/assets/team3.png",
    },
  ];

  const prev = () => {
    setIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 text-center overflow-hidden">
      
      <h2 className="text-2xl md:text-3xl font-bold mb-10">
        Team Solit
      </h2>

      <div className="relative flex items-center justify-center">

        {/* LEFT */}
        <div
          className="absolute left-10 opacity-40 scale-75 rotate-[-10deg] hidden md:block transition"
        >
          <img
            src={members[(index - 1 + members.length) % members.length].img}
            className="w-60 rounded-xl"
          />
        </div>

        {/* CENTER */}
        <div className="z-10">
          <img
            src={members[index].img}
            className="w-72 md:w-80 rounded-xl shadow-xl transition"
          />
          <h3 className="mt-4 font-bold text-lg">
            {members[index].name}
          </h3>
          <p className="text-gray-500">
            {members[index].role}
          </p>
        </div>

        {/* RIGHT */}
        <div
          className="absolute right-10 opacity-40 scale-75 rotate-[10deg] hidden md:block transition"
        >
          <img
            src={members[(index + 1) % members.length].img}
            className="w-60 rounded-xl"
          />
        </div>

      </div>

      {/* BUTTON */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          ←
        </button>

        <button
          onClick={next}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          →
        </button>
      </div>

    </section>
  );
}