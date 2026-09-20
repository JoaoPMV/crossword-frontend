import React from "react";
import { Routes, Route } from "react-router-dom";

import Crossword from "./pages/Crossword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import List from "./pages/List";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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

export default App;
