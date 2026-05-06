import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProductTable from "../components/ProductTable";

import {
  getProducts,
  deleteProduct
} from "../services/AdminProducts";

export default function Products() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    try {

      const data =
        await getProducts();

      setProducts(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function handleDelete(id) {

    const confirmDelete =
      confirm(
        "Yakin ingin hapus produk?"
      );

    if (!confirmDelete) return;

    try {

      await deleteProduct(id);

      loadProducts();

    } catch (error) {

      console.error(error);

    }
  }

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <section>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola semua produk laptop
          </p>

        </div>

        <Link
          to="/admin/products/create"
          className="bg-blue-700 text-white px-6 py-4 rounded-2xl"
        >
          Tambah Produk
        </Link>

      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
      />

    </section>
  );
}