import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductTable({
  products,
  onDelete
}) {

  return (
    <div className="bg-surface rounded-3xl overflow-hidden shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              Produk
            </th>

            <th className="p-4 text-left">
              Brand
            </th>

            <th className="p-4 text-left">
              Category
            </th>

            <th className="p-4 text-left">
              Harga
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-b"
            >

              <td className="p-4">

                <div className="flex items-center gap-4">

                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-sm text-content-muted">
                      {product.slug}
                    </p>

                  </div>

                </div>

              </td>

              <td className="p-4">
                {product.brands?.name}
              </td>

              <td className="p-4">
                {product.categories?.name}
              </td>

              <td className="p-4 font-semibold">
                Rp {product.price?.toLocaleString("id-ID")}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">

                <div className="flex gap-2">

                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() =>
                      onDelete(product.id)
                    }
                    className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}