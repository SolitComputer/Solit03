import { useEffect, useState }
from "react";

import {
  getCategories,
  createCategory,
  deleteCategory
} from "../services/AdminCategories";

export default function Categories() {

  const [categories, setCategories] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      slug: "",
      icon: ""
    });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {

    try {

      const data =
        await getCategories();

      setCategories(data);

    } catch (error) {

      console.error(error);

    }
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await createCategory(form);

      setForm({
        name: "",
        slug: "",
        icon: ""
      });

      loadCategories();

    } catch (error) {

      console.error(error);

      alert(error.message);

    }
  }

  async function handleDelete(id) {

    const confirmDelete =
      confirm(
        "Yakin ingin hapus category?"
      );

    if (!confirmDelete) return;

    try {

      await deleteCategory(id);

      loadCategories();

    } catch (error) {

      console.error(error);

    }
  }

  return (
    <section>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <p className="text-gray-500 mt-2">
          Kelola kategori produk
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-sm mb-8 grid md:grid-cols-3 gap-4"
      >

        <input
          type="text"
          placeholder="Category Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          className="border p-4 rounded-2xl"
        />

        <input
          type="text"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value
            })
          }
          className="border p-4 rounded-2xl"
        />

        <input
          type="text"
          placeholder="Icon"
          value={form.icon}
          onChange={(e) =>
            setForm({
              ...form,
              icon: e.target.value
            })
          }
          className="border p-4 rounded-2xl"
        />

        <button
          className="bg-blue-700 text-white py-4 rounded-2xl md:col-span-3"
        >
          Tambah Category
        </button>

      </form>

      {/* LIST */}

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <div className="space-y-4">

          {categories.map((category) => (

            <div
              key={category.id}
              className="border rounded-2xl p-4 flex items-center justify-between"
            >

              <div>

                <h2 className="font-semibold text-lg">
                  {category.name}
                </h2>

                <p className="text-gray-500">
                  {category.slug}
                </p>

              </div>

              <button
                onClick={() =>
                  handleDelete(category.id)
                }
                className="bg-red-100 text-red-700 px-4 py-2 rounded-xl"
              >
                Hapus
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}