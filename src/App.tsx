import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Landing from "./pages/landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
