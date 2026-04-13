import { useState, useEffect } from 'react';
import { getTrainingsWithCustomers } from '../services/api';
import dayjs from 'dayjs';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    getTrainingsWithCustomers().then(data => setTrainings(data));
  }, []);

  const filtered = trainings.filter(t => 
    `${t.customer?.firstname} ${t.customer?.lastname} ${t.activity}`.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'customerName') {
      aVal = `${a.customer?.firstname} ${a.customer?.lastname}`;
      bVal = `${b.customer?.firstname} ${b.customer?.lastname}`;
    } else if (sortBy === 'date') {
      aVal = new Date(a.date);
      bVal = new Date(b.date);
    } else {
      aVal = a[sortBy];
      bVal = b[sortBy];
    }
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  };

  return (
    <div>
      <h2>Trainings</h2>
      
      <input 
        type="text" 
        placeholder="Search by customer or activity..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
      />
      
      <table border="1">
        <thead>
          <tr>
            <th onClick={() => handleSort('customerName')}>Customer {sortBy === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('activity')}>Activity {sortBy === 'activity' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('duration')}>Duration (min) {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('date')}>Date & Time {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.id}>
              <td>{t.customer?.firstname} {t.customer?.lastname}</td>
              <td>{t.activity}</td>
              <td>{t.duration}</td>
              <td>{formatDate(t.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrainingList;