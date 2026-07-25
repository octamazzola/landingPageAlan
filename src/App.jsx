import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import PlatformApp from "./platform/App";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (route.startsWith("/app")) {
    return <PlatformApp />;
  }
  
  return <LandingPage />;
}
