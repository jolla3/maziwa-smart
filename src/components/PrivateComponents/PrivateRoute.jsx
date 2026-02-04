import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthGate = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Auth resolved if:
    // - logged out
    // - OR logged in with decoded user
    if (!token || (token && user)) {
      setReady(true);
    }
  }, [token, user]);

  if (!ready) return null; // DO NOT redirect here

  return children;
};

export default AuthGate;
