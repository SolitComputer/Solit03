import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - fixed height */}
      <Sidebar />

      {/* Content - akan scroll sendiri */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        {/* Main content with scrolling */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}