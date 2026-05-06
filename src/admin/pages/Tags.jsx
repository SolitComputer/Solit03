import { useEffect, useState }
from "react";

import {
  getTags,
  createTag,
  deleteTag
} from "../services/AdminTags";

export default function Tags() {

  const [tags, setTags] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      slug: ""
    });

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {

    try {

      const data =
        await getTags();

      setTags(data);

    } catch (error) {

      console.error(error);

    }
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await createTag(form);

      setForm({
        name: "",
        slug: ""
      });

      loadTags();

    } catch (error) {

      console.error(error);

      alert(error.message);

    }
  }

  async function handleDelete(id) {

    const confirmDelete =
      confirm(
        "Yakin ingin hapus tag?"
      );

    if (!confirmDelete) return;

    try {

      await deleteTag(id);

      loadTags();

    } catch (error) {

      console.error(error);

    }
  }

  return (
    <section>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Tags
        </h1>

        <p className="text-gray-500 mt-2">
          Kelola tag produk
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-sm mb-8 flex gap-4"
      >

        <input
          type="text"
          placeholder="Tag Name"
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

      {/* LIST */}

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <div className="space-y-4">

          {tags.map((tag) => (

            <div
              key={tag.id}
              className="border rounded-2xl p-4 flex items-center justify-between"
            >

              <div>

                <h2 className="font-semibold text-lg">
                  {tag.name}
                </h2>

                <p className="text-gray-500">
                  {tag.slug}
                </p>

              </div>

              <button
                onClick={() =>
                  handleDelete(tag.id)
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