import React, { useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import useDashboardStore from "./store/useDashboardStore";
import Layout from "./Layout";
import {
  Overview,
  User,
  Visitors,
  Services,
  Projects,
  Testimonials,
  Settings,
  Messages,
  Login,
  Register,
  FileManager,
  Plans,
} from "./pages";
import { ErrorBoundary, LogoPulse } from "./components";

import { Toaster } from "react-hot-toast";

const AuthGuard = ({ children }) => {
  const { user, hasAdmin } = useDashboardStore();

  if (!user) return <Navigate to={hasAdmin ? "/login" : "/register"} replace />;

  return children;
};

const PublicGuard = ({ children, requireAdminCheck = false }) => {
  const { user, hasAdmin } = useDashboardStore();

  if (requireAdminCheck && !hasAdmin) return children;
  if (requireAdminCheck && hasAdmin) return <Navigate to="/login" replace />;

  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { checkAdminStatus, getUser, user } = useDashboardStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAdminStatus();
      await getUser();
      setIsReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          {/* Public Routes */}
          <Route
            path="/register"
            element={
              <PublicGuard requireAdminCheck={true}>
                <Register />
              </PublicGuard>
            }
          />

          <Route
            path="/login"
            element={
              <PublicGuard>
                <Login />
              </PublicGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
            errorElement={<ErrorBoundary />}
          >
            <Route
              index
              element={
                <ErrorBoundary>
                  <Overview />
                </ErrorBoundary>
              }
            />
            <Route
              path="user"
              element={
                <ErrorBoundary>
                  <User />
                </ErrorBoundary>
              }
            />
            <Route
              path="visitors"
              element={
                <ErrorBoundary>
                  <Visitors />
                </ErrorBoundary>
              }
            />
            <Route
              path="services"
              element={
                <ErrorBoundary>
                  <Services />
                </ErrorBoundary>
              }
            />
            <Route
              path="plans"
              element={
                <ErrorBoundary>
                  <Plans />
                </ErrorBoundary>
              }
            />
            <Route
              path="projects"
              element={
                <ErrorBoundary>
                  <Projects />
                </ErrorBoundary>
              }
            />
            <Route
              path="testimonials"
              element={
                <ErrorBoundary>
                  <Testimonials />
                </ErrorBoundary>
              }
            />

            <Route
              path="messages"
              element={
                <ErrorBoundary>
                  <Messages />
                </ErrorBoundary>
              }
            />
            <Route
              path="settings"
              element={
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              }
            />
            <Route
              path="file-manager"
              element={
                <ErrorBoundary>
                  <FileManager />
                </ErrorBoundary>
              }
            />
            <Route
              path="files"
              element={
                <ErrorBoundary>
                  <FileManager />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )
    );
  }, []);

  if (!isReady)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LogoPulse />
      </div>
    );

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
          error: {
            style: {
              border: "1px solid #ef4444",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
