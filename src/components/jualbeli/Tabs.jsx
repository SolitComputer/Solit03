export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "jual", label: "Jual - Beli Laptop" },
    { key: "lelang", label: "Lelang Kantor" },
    { key: "sewa", label: "Sewa Laptop" },
  ];

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-[#43b0c8] p-1 rounded-full flex gap-2 hover:">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-primary text-white shadow"
                : "text-gray-700 hover:text-primary"
        }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}