import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LinkAnalytics from "./pages/LinkAnalytics"
import AppLayout from "@/components/layout/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        <Route
          path="/links/:shortCode"
          element={
            <AppLayout>
              <LinkAnalytics />
            </AppLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
