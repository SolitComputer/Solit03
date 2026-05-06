import {
  LayoutDashboard,
  Laptop,
  Tags,
  Layers3,
  Shapes
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      name: "Products",
      icon: Laptop,
      path: "/admin/products"
    },
    {
      name: "Brands",
      icon: Tags,
      path: "/admin/brands"
    },
    {
      name: "Categories",
      icon: Layers3,
      path: "/admin/categories"
    },
    {
      name: "Tags",
      icon: Shapes,
      path: "/admin/tags"
    }
  ];

  return (
    <aside className="w-72 bg-white border-r min-h-screen">

      <div className="h-20 flex items-center px-6 border-b">

        <h1 className="text-2xl font-bold text-blue-700">
          Solit Admin
        </h1>

      </div>

      <nav className="p-4 space-y-2">

        {menus.map((menu, index) => {

          const Icon = menu.icon;

          const active =
            location.pathname === menu.path;

          return (
            <Link
              key={index}
              to={menu.path}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-2xl
                transition-all duration-300
                ${
                  active
                    ? "bg-blue-700 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >

              <Icon size={20} />

              <span className="font-medium">
                {menu.name}
              </span>

            </Link>
          );
        })}

      </nav>

    </aside>
  );
}