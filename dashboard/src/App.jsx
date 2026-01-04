import React, { useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import {
  Overview,
  User,
  Services,
  Projects,
  Testimonials,
  Configuration,
  Messages,
  Login,
  Register,
  FileManager,
  Plans,
  Blogs,
  Visitors,
  Jobs,
  JobApplications,
  Subscribers,
  Forms,
} from "@/pages";
import { Layout, ErrorBoundary, LogoPulse } from "@/components";
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

import { ThemeProvider } from "@/context/ThemeContext";

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

  useEffect(() => {}, [user]);

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
              path="jobs"
              element={
                <ErrorBoundary>
                  <Jobs />
                </ErrorBoundary>
              }
            />
            <Route
              path="applications"
              element={
                <ErrorBoundary>
                  <JobApplications />
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
              path="configuration"
              element={
                <ErrorBoundary>
                  <Configuration />
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
            <Route
              path="blogs"
              element={
                <ErrorBoundary>
                  <Blogs />
                </ErrorBoundary>
              }
            />
            <Route
              path="subscribers"
              element={
                <ErrorBoundary>
                  <Subscribers />
                </ErrorBoundary>
              }
            />
            <Route
              path="forms"
              element={
                <ErrorBoundary>
                  <Forms />
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LogoPulse />
      </div>
    );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-card !text-foreground !border !border-border",
          error: {
            className: "!border-destructive",
          },
        }}
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
