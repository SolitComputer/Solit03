import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/auth";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {

      setLoading(true);

      await loginAdmin(
        form.email,
        form.password
      );

      navigate("/admin");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-4 rounded-xl mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-6"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-blue-700 text-white py-4 rounded-xl"
        >
          {loading
            ? "Loading..."
            : "Login"}
        </button>

      </form>

    </section>
  );
}