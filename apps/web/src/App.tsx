import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "@/features/auth/login-page";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { RegisterPage } from "@/features/auth/register-page";

const DashboardPage = lazy(() =>
  import("@/features/dashboard/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <Suspense
              fallback={
                <div className="grid min-h-svh place-items-center bg-background text-muted-foreground">
                  Preparando el gran premio...
                </div>
              }
            >
              <DashboardPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
