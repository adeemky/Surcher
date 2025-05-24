import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useState } from "react";
import sideImage from "../images/s.png";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData.username, formData.password);
      setIsAuthenticated(true);
      navigate("/surveys");
    } catch (error) {
      let message = "Login failed.";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = Object.values(data).flat().join(" ");
        }
      }
      alert(message);
    }
  };

  return (
    <div className="md:min-h-screen bg-slate-50 flex">
      <div className="hidden md:flex w-1/3 h-[calc(90vh-5rem)] items-center justify-center">
        <img src={sideImage} alt="Side Visual" className="w-full h-full object-cover mt-40" />
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded shadow responsive-login-container">
          <h2 className="text-3xl font-bold text-center mb-6 text-slate-800 font-nunito">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-nunito mb-1">Username</label>
              <input
                name="username"
                required
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-nunito mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 text-white py-3 rounded font-nunito hover:bg-slate-900 transition"
            >
              Login
            </button>
            <p className="mt-4 text-center text-slate-600 font-nunito">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-amber-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
