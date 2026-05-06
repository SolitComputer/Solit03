import { useEffect, useState } from "react";
import {
    uploadProductImage,
    uploadMultipleImages
} from "../../services/storage";
import { supabase } from "../../services/supabase";

export default function ProductForm({
    form,
    setForm,
    onSubmit,
    buttonText
}) {

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [tags, setTags] =
        useState([]);

    const [uploading, setUploading] =
        useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {

        const {
            data: brandsData
        } = await supabase
            .from("brands")
            .select("*");

        const {
            data: categoriesData
        } = await supabase
            .from("categories")
            .select("*");

        const {
            data: tagsData
        } = await supabase
            .from("tags")
            .select("*");

        setBrands(brandsData || []);

        setCategories(categoriesData || []);

        setTags(tagsData || []);
    }

    async function handleImageUpload(e) {

        try {

            setUploading(true);

            const file =
                e.target.files[0];

            if (!file) return;

            const imageUrl =
                await uploadProductImage(file);

            setForm({
                ...form,
                thumbnail: imageUrl
            });

        } catch (error) {

            console.error(error);
            alert(error.message);

        } finally {

            setUploading(false);

        }
    }

    async function handleGalleryUpload(e) {

        try {

            setUploading(true);

            const files =
                Array.from(e.target.files);

            if (!files.length) return;

            const urls =
                await uploadMultipleImages(files);

            setForm({
                ...form,
                gallery: [
                    ...(form.gallery || []),
                    ...urls
                ]
            });

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setUploading(false);

        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white rounded-3xl p-8 shadow-sm space-y-5"
        >

            <input
                type="text"
                placeholder="Nama Produk"
                value={form.name}
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            />

            <input
                type="text"
                placeholder="Slug Produk"
                value={form.slug}
                onChange={(e) =>
                    setForm({
                        ...form,
                        slug: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            />

            <input
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={(e) =>
                    setForm({
                        ...form,
                        price: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            />

            <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                    setForm({
                        ...form,
                        stock: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            />

            {uploading && (

                <div className="text-blue-700">
                    Uploading...
                </div>

            )}

            {form.thumbnail && (

                <div className="mt-4">

                    <img
                        src={form.thumbnail}
                        alt="Preview"
                        className="w-48 h-48 rounded-2xl object-cover border"
                    />

                </div>

            )}

            <div>
                <label className="block mb-3 font-medium">
                    Thumbnail Produk
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border p-4 rounded-2xl"
                />
            </div>

            <div>

                <label className="block mb-3 font-medium">
                    Gallery Produk
                </label>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="w-full border p-4 rounded-2xl"
                />

            </div>

            {form.gallery?.length > 0 && (

                <div className="grid grid-cols-4 gap-4">

                    {form.gallery.map((image, index) => (

                        <div
                            key={index}
                            className="relative"
                        >

                            <img
                                src={image}
                                alt=""
                                className="w-full h-32 rounded-2xl object-cover border"
                            />

                        </div>

                    ))}

                </div>

            )}

            <select
                value={form.brand_id}
                onChange={(e) =>
                    setForm({
                        ...form,
                        brand_id: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            >

                <option value="">
                    Pilih Brand
                </option>

                {brands.map((brand) => (

                    <option
                        key={brand.id}
                        value={brand.id}
                    >
                        {brand.name}
                    </option>

                ))}

            </select>

            <select
                value={form.category_id}
                onChange={(e) =>
                    setForm({
                        ...form,
                        category_id: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl"
            >

                <option value="">
                    Pilih Category
                </option>

                {categories.map((category) => (

                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>

                ))}

            </select>

            <div>

                <label className="block mb-3 font-medium">
                    Tags Produk
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {tags.map((tag) => {

                        const checked =
                            form.tag_ids?.includes(tag.id);

                        return (

                            <button
                                type="button"
                                key={tag.id}
                                onClick={() => {

                                    if (checked) {

                                        setForm({
                                            ...form,
                                            tag_ids:
                                                form.tag_ids.filter(
                                                    (id) => id !== tag.id
                                                )
                                        });

                                    } else {

                                        setForm({
                                            ...form,
                                            tag_ids: [
                                                ...form.tag_ids,
                                                tag.id
                                            ]
                                        });

                                    }

                                }}
                                className={`
                        p-3 rounded-2xl border transition-all
                        ${checked
                                        ? "bg-blue-700 text-white border-blue-700"
                                        : "bg-white hover:bg-gray-100"
                                    }
                    `}
                            >

                                {tag.name}

                            </button>

                        );
                    })}

                </div>

            </div>

            <textarea
                placeholder="Short Description"
                value={form.short_description}
                onChange={(e) =>
                    setForm({
                        ...form,
                        short_description: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl h-28"
            />

            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                    setForm({
                        ...form,
                        description: e.target.value
                    })
                }
                className="w-full border p-4 rounded-2xl h-40"
            />

            <div className="border-t pt-8">

                <h2 className="text-2xl font-bold mb-6">
                    Spesifikasi Laptop
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                    <input
                        type="text"
                        placeholder="Processor"
                        value={form.specs?.processor || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    processor: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="RAM"
                        value={form.specs?.ram || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    ram: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="Storage"
                        value={form.specs?.storage || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    storage: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="GPU"
                        value={form.specs?.gpu || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    gpu: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="Display"
                        value={form.specs?.display || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    display: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="System OS"
                        value={form.specs?.system_os || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    system_os: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                    <input
                        type="text"
                        placeholder="Battery"
                        value={form.specs?.battery || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                specs: {
                                    ...form.specs,
                                    battery: e.target.value
                                }
                            })
                        }
                        className="w-full border p-4 rounded-2xl"
                    />

                </div>

            </div>

            <button
                className="bg-blue-700 text-white px-6 py-4 rounded-2xl"
            >
                {buttonText}
            </button>

        </form>
    );
}