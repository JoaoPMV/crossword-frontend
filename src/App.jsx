import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from "./List";
import Crossword from "./Crossword";
import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/levels" element={<List />} />
        <Route path="/crossword/:id" element={<Crossword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
