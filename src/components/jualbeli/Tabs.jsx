export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "jual", label: "Jual Laptop" },
    { key: "lelang", label: "Lelang Kantor" },
    { key: "sewa", label: "Sewa Laptop" },
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-surface-muted border border-border p-1 rounded-xl flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-soft-sm"
                : "text-content-muted hover:text-blue-600 hover:bg-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}