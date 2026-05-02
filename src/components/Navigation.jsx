import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Customers</Link> |{' '}
      <Link to="/trainings">Trainings</Link> |{' '}
      <Link to="/calendar">Calendar</Link> |{' '}
      <Link to="/statistics">Statistics</Link>
    </nav>
  );
}

export default Navigation;