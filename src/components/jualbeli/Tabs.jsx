export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "jual", label: "Jual - Beli Laptop" },
    { key: "lelang", label: "Lelang Kantor" },
    { key: "sewa", label: "Sewa Laptop" },
  ];

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-gray-100 p-1 rounded-full flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-primary text-white shadow"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}