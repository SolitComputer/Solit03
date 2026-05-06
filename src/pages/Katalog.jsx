import { useEffect, useState } from "react";
import { fetchProducts } from "../services/products";

export default function Katalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await fetchProducts();
    setProducts(data);
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-10">
        Katalog Laptop
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">
              <h2 className="font-semibold text-lg">
                {product.name}
              </h2>

              <p className="text-blue-700 font-bold mt-2">
                Rp {product.price.toLocaleString("id-ID")}
              </p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  {product.product_specs?.[0]?.processor}
                </p>

                <p>
                  RAM {product.product_specs?.[0]?.ram}
                </p>

                <p>
                  SSD {product.product_specs?.[0]?.storage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}