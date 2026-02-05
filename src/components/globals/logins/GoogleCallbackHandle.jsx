import { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { jwtDecode } from "jwt-decode";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthContext);

  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    // -----------------------------
    // BACKEND ERROR
    // -----------------------------
    if (error || !token) {
      navigate("/login", { replace: true });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      navigate("/login", { replace: true });
      return;
    }

    // -----------------------------
    // PERSIST TOKEN (SINGLE SOURCE OF TRUTH)
    // -----------------------------
    setToken(token);

    // -----------------------------
    // ONBOARDING FLOW (BACKEND DECIDES)
    // -----------------------------
    if (decoded.onboarding_complete === false) {
      navigate("/set-password", { replace: true });
      return;
    }

    // -----------------------------
    // ROLE ROUTING
    // -----------------------------
    const roleRoutes = {
      admin: "/admindashboard",
      superadmin: "/spr.dmn",
      seller: "/slr.drb",
      buyer: "/byr.drb",
      farmer: "/fmr.drb",
      porter: "/porterdashboard",
      manager: "/man.drb",
    };

    navigate(roleRoutes[decoded.role] || "/", { replace: true });
  }, [location, navigate, setToken]);

  return null;
};

export default GoogleCallbackHandler;
