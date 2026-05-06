import {
  Laptop,
  Package,
  Tags,
  Layers3
} from "lucide-react";

export default function Dashboard() {

  const stats = [
    {
      title: "Total Products",
      value: "120",
      icon: Laptop
    },
    {
      title: "Brands",
      value: "12",
      icon: Tags
    },
    {
      title: "Categories",
      value: "6",
      icon: Layers3
    },
    {
      title: "Stock Products",
      value: "245",
      icon: Package
    }
  ];

  return (
    <section>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Selamat datang di admin panel Solit 03
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >

              <div className="flex items-center justify-between mb-5">

                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">

                  <Icon size={28} />

                </div>

              </div>

              <h2 className="text-gray-500 mb-1">
                {item.title}
              </h2>

              <p className="text-4xl font-bold">
                {item.value}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}