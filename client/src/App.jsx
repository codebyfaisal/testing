import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Layout,
  ScrollToTop,
  SEO,
  ErrorBoundary,
  PrivacyBanner,
} from "./components";
import {
  Home,
  About,
  Services,
  ServiceDetail,
  Projects,
  ProjectDetail,
  Contact,
  NotFound,
} from "./pages";
import usePortfolioStore from "./store/usePortfolioStore";
import { Toaster } from "react-hot-toast";
import { API_URL as BASE_API_URL } from "./services/api";

function App() {
  const { fetchData, config } = usePortfolioStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const logVisit = async () => {
      try {
        let userAgent = navigator.userAgent;
        const brands = navigator.userAgentData?.brands;
        const braveBrand = brands?.find(
          (b) => b.brand.toLowerCase() === "brave"
        );

        if (braveBrand || navigator.brave) {
          const version = braveBrand?.version ?? "";
          userAgent += ` Brave/${version}`;
        }

        await fetch(`${BASE_API_URL}/visits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: window.location.pathname, userAgent }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to log visit:", error);
      }
    };

    logVisit();
  }, []);

  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      const borderRadius = config.appearance?.theme?.borderRadius;
      const isCustom = config.appearance?.theme?.isCustom;
      const colors = config.appearance?.theme?.colors;

      if (borderRadius) {
        root.style.setProperty("--radius-2xl", "1rem");
        root.style.setProperty("--radius-xl", "0.75rem");
        root.style.setProperty("--radius-lg", "0.5rem");
        root.style.setProperty("--radius-md", "0.375rem");
        root.style.setProperty("--radius-sm", "0.125rem");
      } else {
        root.style.setProperty("--radius-2xl", "0px");
        root.style.setProperty("--radius-xl", "0px");
        root.style.setProperty("--radius-lg", "0px");
        root.style.setProperty("--radius-md", "0px");
        root.style.setProperty("--radius-sm", "0px");
      }

      if (isCustom && colors) {
        if (colors.secondary)
          root.style.setProperty("--color-secondary", colors.secondary);
      } else {
        root.style.removeProperty("--color-secondary");
      }
    }
  }, [config]);

  return (
    <Router>
      <ErrorBoundary>
        <SEO />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #27272a",
            },
          }}
        />
        <PrivacyBanner />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
