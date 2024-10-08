import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Game from "./pages/Game";
import "/src/assets/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
