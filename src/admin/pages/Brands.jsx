import { useEffect, useState }
from "react";

import {
  getBrands,
  createBrand,
  deleteBrand
} from "../services/AdminBrands";

export default function Brands() {

  const [brands, setBrands] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      slug: ""
    });

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {

    const data =
      await getBrands();

    setBrands(data);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    await createBrand(form);

    setForm({
      name: "",
      slug: ""
    });

    loadBrands();
  }

  async function handleDelete(id) {

    await deleteBrand(id);

    loadBrands();
  }

  return (
    <section>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Brands
        </h1>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl mb-8 flex gap-4"
      >

        <input
          type="text"
          placeholder="Brand Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          className="flex-1 border p-4 rounded-2xl"
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
          className="flex-1 border p-4 rounded-2xl"
        />

        <button
          className="bg-blue-700 text-white px-6 rounded-2xl"
        >
          Tambah
        </button>

      </form>

      <div className="bg-white rounded-3xl p-6">

        <div className="space-y-4">

          {brands.map((brand) => (

            <div
              key={brand.id}
              className="flex items-center justify-between border p-4 rounded-2xl"
            >

              <div>

                <h2 className="font-semibold">
                  {brand.name}
                </h2>

                <p className="text-gray-500">
                  {brand.slug}
                </p>

              </div>

              <button
                onClick={() =>
                  handleDelete(brand.id)
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