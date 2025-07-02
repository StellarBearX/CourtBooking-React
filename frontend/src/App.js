import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SelectSportPage from "./pages/SelectSportPage";
import SelectTimePage from "./pages/SelectTimePage";
import SelectCourtPage from "./pages/SelectCourtPage";
import CheckoutPage from "./pages/CheckoutPage";
import BookSuccessPage from "./pages/BookSuccessPage";
import UserInfoBar from "./components/UserInfoBar";
function App() {
  return (
    
    <Router>
      <UserInfoBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-sport" element={<SelectSportPage />} />
        <Route path="/select-time" element={<SelectTimePage />} />
        <Route path="/select-court" element={<SelectCourtPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<BookSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;