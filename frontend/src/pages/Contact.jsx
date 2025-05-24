import React, { useState } from "react";

const Contact = () => {
  const [userType, setUserType] = useState("individual");

  return (
    <div className="min-h-screen pt-20 px-4 md:px-10 py-10 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-semibold text-slate-800 mb-6 font-nunito text-center">
          Contact Us
        </h2>
        <form
          action="https://formsubmit.co/adeemkaya16@gmail.com"
          method="POST"
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-slate-700 font-nunito">Gender:</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="male" required />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="female" required />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="prefer_not_say" required />
                <span>Prefer not to say</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-700 font-nunito">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-700 font-nunito">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-700 font-nunito">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-700 font-nunito">
              Are you an individual or an organization?
            </label>
            <select
              name="userType"
              required
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full border rounded px-4 py-2"
            >
              <option value="individual">Individual</option>
              <option value="institution">Organization</option>
            </select>
          </div>

          {userType === "institution" && (
            <div>
              <label className="block mb-1 text-slate-700 font-nunito">
                Organization Name
              </label>
              <input
                type="text"
                name="institutionName"
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-slate-700 font-nunito">Subject</label>
            <input
              type="text"
              name="subject"
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-700 font-nunito">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded font-nunito hover:bg-slate-900 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
