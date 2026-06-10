/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/MainLayout";
import { StudentDashboard } from "./pages/StudentDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AIRecommendation } from "./pages/AIRecommendation";
import { AIChatbot } from "./pages/AIChatbot";
import { AIQuiz } from "./pages/AIQuiz";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { InteractiveLearning } from "./pages/InteractiveLearning";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student" replace />} />
            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="instructor"
              element={
                <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="recommendations" element={<AIRecommendation />} />
            <Route path="chatbot" element={<AIChatbot />} />
            <Route path="quiz" element={<AIQuiz />} />
            <Route path="profile" element={<Profile />} />
            <Route path="learn/:courseId" element={<InteractiveLearning />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
