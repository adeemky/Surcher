import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../services/auth";
import React, { useState } from "react";
import sideImage from "../images/s.png";

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    password2: "",
    age: "",
    gender: "",
    marital_status: "",
    education_level: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      username,
      email,
      name,
      password,
      password2,
      age,
      gender,
      marital_status,
      education_level,
    } = formData;

    const payload = {
      username,
      email,
      name,
      password,
      password2,
      age,
      gender,
      marital_status,
      education_level,
    };

    try {
      const response = await axios.post("http://localhost:8000/api/user/register/", payload);
      if (response.status === 201) {
        try {
          await loginUser(username, password);
          setIsAuthenticated(true);
          navigate("/");
        } catch (loginError) {
          const message = loginError.response?.data?.detail || "Login failed.";
          alert(message);
        }
      }
    } catch (error) {
      let message = "Registration failed.";
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
    <div className=" bg-slate-50 flex">
      <div className="hidden md:flex w-1/3 h-[calc(90vh-5rem)] items-center justify-center">
        <img src={sideImage} alt="Side Visual" className="w-full h-full object-cover mt-40" />
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
          <h2 className="text-3xl font-bold text-center mb-6 text-slate-800 font-nunito">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Username</label>
                <input
                  required
                  name="username"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Full Name</label>
                <input
                  required
                  name="name"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-nunito mb-1">Email</label>
              <input
                type="email"
                required
                name="email"
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Password</label>
                <input
                  type="password"
                  required
                  name="password"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-nunito mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  name="password2"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Age</label>
                <select
                  required
                  name="age"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="18-30">18-30</option>
                  <option value="31-45">31-45</option>
                  <option value="46-65">46-65</option>
                  <option value="65+">65+</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Gender</label>
                <select
                  required
                  name="gender"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-nunito mb-1">Marital Status</label>
                <select
                  required
                  name="marital_status"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="S">Single</option>
                  <option value="M">Married</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-nunito mb-1">
                  Education Level
                </label>
                <select
                  required
                  name="education_level"
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="primary_school">Primary School</option>
                  <option value="high_school">High School</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 text-white py-3 rounded font-nunito hover:bg-slate-900 transition"
            >
              Register
            </button>
            <p className="mt-4 text-center text-slate-600 font-nunito">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
