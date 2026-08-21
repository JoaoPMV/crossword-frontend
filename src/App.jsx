import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Crossword from "./pages/Crossword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import List from "./pages/list/List";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken"); // ajuste conforme sua auth

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      <Route
        path="/crossword/:level"
        element={
          <PrivateRoute>
            <Crossword />
          </PrivateRoute>
        }
      />

      <Route
        path="/list"
        element={
          <PrivateRoute>
            <List />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
