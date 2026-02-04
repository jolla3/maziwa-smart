import { useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { jwtDecode } from "jwt-decode";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useContext(AuthContext);

  // Prevent double execution (React strict mode / rerenders)
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    // -----------------------------
    // ERROR FROM BACKEND
    // -----------------------------
    if (error) {
      console.error("Google OAuth error:", error);
      navigate("/login", { replace: true });
      return;
    }

    // -----------------------------
    // NO TOKEN = INVALID CALLBACK
    // -----------------------------
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid Google JWT:", err);
      navigate("/login", { replace: true });
      return;
    }

    // -----------------------------
    // PASSWORD SETUP FLOW (ONLY IF FLAGGED)
    // -----------------------------
    if (decoded.needs_password_setup === true) {
      navigate(`/set-password?token=${token}`, { replace: true });
      return;
    }

    // -----------------------------
    // NORMAL LOGIN FLOW
    // -----------------------------
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(decoded));

    setToken(token);
    setUser(decoded);

    const roleRoutes = {
      admin: "/admindashboard",
      superadmin: "/spr.dmn",
      seller: "/slr.drb",
      buyer: "/byr.drb",
      farmer: "/fmr.drb",
      porter: "/porterdashboard",
      manager: "/man.drb",
    };

    const destination = roleRoutes[decoded.role] || "/";

    navigate(destination, { replace: true });
  }, [location, navigate, setToken, setUser]);

  return null;
};

export default GoogleCallbackHandler;
