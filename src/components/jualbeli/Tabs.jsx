export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "jual", label: "Jual Laptop" },
    { key: "lelang", label: "Lelang Kantor" },
    { key: "sewa", label: "Sewa Laptop" },
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 p-0.5 rounded-lg flex gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}