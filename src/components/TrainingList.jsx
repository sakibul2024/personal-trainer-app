import { useState, useEffect } from 'react';
import { getTrainingsWithCustomers, deleteTraining, addTraining, getCustomers } from '../services/api';
import dayjs from 'dayjs';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    activity: '',
    duration: '',
    date: ''
  });

  const loadData = async () => {
    const trainingsData = await getTrainingsWithCustomers();
    const customersData = await getCustomers();
    setTrainings(trainingsData);
    setCustomers(customersData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
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

  const handleDelete = async (training) => {
    if (window.confirm(`Delete this ${training.activity} training?`)) {
      await deleteTraining(training.id);
      await loadData();
    }
  };

  const openAddForm = () => {
    setSelectedCustomer(null);
    setFormData({
      activity: '',
      duration: '',
      date: ''
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trainingData = {
      customer: selectedCustomer._links.self.href,
      activity: formData.activity,
      duration: parseInt(formData.duration),
      date: formData.date
    };
    
    await addTraining(trainingData);
    await loadData();
    closeForm();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Trainings</h2>
        <button onClick={openAddForm}>Add Training</button>
      </div>
      
      <input 
        type="text" 
        placeholder="Search by customer or activity..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
      />
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th onClick={() => handleSort('customerName')} style={{ cursor: 'pointer' }}>
              Customer {sortBy === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('activity')} style={{ cursor: 'pointer' }}>
              Activity {sortBy === 'activity' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }}>
              Duration (min) {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
              Date & Time {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.id}>
              <td>{t.customer?.firstname} {t.customer?.lastname}</td>
              <td>{t.activity}</td>
              <td>{t.duration}</td>
              <td>{formatDate(t.date)}</td>
              <td>
                <button onClick={() => handleDelete(t)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Training Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            width: '400px'
          }}>
            <h3>Add Training</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Customer: </label><br/>
                <select 
                  value={selectedCustomer?._links?.self?.href || ''} 
                  onChange={(e) => {
                    const customer = customers.find(c => c._links.self.href === e.target.value);
                    setSelectedCustomer(customer);
                  }}
                  required
                  style={{ width: '100%', padding: '5px' }}
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._links.self.href} value={c._links.self.href}>
                      {c.firstname} {c.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Activity: </label><br/>
                <input 
                  type="text" 
                  name="activity" 
                  value={formData.activity} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Duration (minutes): </label><br/>
                <input 
                  type="number" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Date & Time: </label><br/>
                <input 
                  type="datetime-local" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Save</button>
                <button type="button" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingList;