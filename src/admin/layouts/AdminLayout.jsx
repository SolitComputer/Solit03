import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      {/* Sidebar */}
      <Sidebar />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        {/* Main content dengan padding lebih kecil */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}