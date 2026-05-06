import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b px-6 flex items-center justify-between">

      <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl w-[350px]">

        <Search size={18} />

        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="bg-transparent outline-none w-full"
        />

      </div>

      <div className="flex items-center gap-4">

        <button className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold">
            S
          </div>

          <div>
            <p className="font-semibold">
              Solit Admin
            </p>

            <p className="text-sm text-gray-500">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}