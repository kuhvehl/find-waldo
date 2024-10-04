import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
