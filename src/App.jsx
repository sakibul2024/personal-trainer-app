import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import TrainingCalendar from './components/TrainingCalendar';
import StatisticsPage from './components/StatisticsPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Personal Trainer Database</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/calendar" element={<TrainingCalendar />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;