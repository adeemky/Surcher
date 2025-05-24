import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Surveys from "./pages/Surveys";
import SurveyRetrieve from "./pages/SurveyRetrieve";
import Results from "./pages/Results";
import ResultRetrieve from "./pages/ResultRetrieve";
import OrgRetrieve from "./pages/OrgRetrieve";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({ username: decoded.username, name: decoded.name });
      } catch (e) {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userInfo={userInfo} />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/contact" element={<Contact />} />
          {!isAuthenticated && (
            <>
              <Route
                path="/register"
                element={<Register setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route
                path="/login"
                element={<Login setIsAuthenticated={setIsAuthenticated} />}
              />
            </>
          )}
          {isAuthenticated && (
            <>
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/surveys/:id" element={<SurveyRetrieve />} />
              <Route path="/results" element={<Results />} />
              <Route path="/results/:id" element={<ResultRetrieve />} />
              <Route path="/organizations/:id" element={<OrgRetrieve />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
