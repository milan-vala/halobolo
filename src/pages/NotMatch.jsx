import { useEffect } from "react";
import { useLocation } from "react-router";

export function NotMatch() {
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem("redirectTo", location.pathname);
    window.location.replace("/");
  }, [location.pathname]);

  return <div></div>;
}
