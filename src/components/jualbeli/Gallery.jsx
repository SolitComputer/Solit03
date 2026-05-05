export default function Gallery({ images }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-20 px-6">
      {images.map((img, i) => (
        <div
          key={i}
          className="w-full h-[360px] overflow-hidden rounded-2xl shadow group"
        >
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
          />
        </div>
      ))}
    </section>
  );
}