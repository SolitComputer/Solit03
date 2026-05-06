export default function StepCard({ title, desc, steps }) {
  return (
    <section className="px-6 py-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto text-left">
        <p className="text-gray-600 mb-6">{desc}</p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              
              <div className="min-w-[32px] h-8 bg-primary text-gray-500 flex items-center justify-center rounded-full text-sm font-semibold">
                {i + 1}
              </div>

              <p className="text-gray-700">{step}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}