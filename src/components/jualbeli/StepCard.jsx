export default function StepCard({ title, desc, steps }) {
  return (
    <div className="card-3d p-5 md:p-6">
      <h3 className="text-sm md:text-base font-semibold text-slate-900 text-center mb-2">
        {title}
      </h3>
      <p className="text-[11px] md:text-xs text-slate-500 text-center mb-4">
        {desc}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-blue-600">{index + 1}</span>
            </div>
            <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}