import { BrowserRouter, Routes, Route } from "react-router-dom";
import Levels from "./pages/Levels";
import Crossword from "./pages/Crossword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import Cards from "./pages/Home";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cards" element={<Cards />} />
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/crossword/:id" element={<Crossword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
