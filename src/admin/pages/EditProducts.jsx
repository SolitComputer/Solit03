import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import ProductForm from "../components/ProductForm";

import {
  getProductById,
  updateProduct
} from "../services/AdminProducts";

export default function EditProducts() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      name: "",
      slug: "",
      price: "",
      stock: "",
      thumbnail: "",
      brand_id: "",
      category_id: "",
      description: "",
      short_description: ""
    });

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {

    try {

      const data =
        await getProductById(id);

      setForm(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await updateProduct(id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });

      navigate("/admin/products");

    } catch (error) {

      console.error(error);
      alert(error.message);

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

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Edit Produk
        </h1>

        <p className="text-gray-500 mt-2">
          Edit data produk
        </p>

      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        buttonText="Update Produk"
      />

    </section>
  );
}