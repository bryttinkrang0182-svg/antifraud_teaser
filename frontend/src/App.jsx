import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VictimCountPage from './pages/VictimCountPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/victim-count" element={<VictimCountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
