import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResumeResult from './pages/ResumeResult';
import ScoreResult from './pages/ScoreResult';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumeResult />} />
        <Route path="/score" element={<ScoreResult />} />
      </Routes>
    </BrowserRouter>
  );
}
