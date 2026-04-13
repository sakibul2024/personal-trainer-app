import { useState, useEffect } from 'react';
import { getCustomers } from '../services/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('firstname');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    getCustomers().then(data => setCustomers(data));
  }, []);

  const filtered = customers.filter(c => 
    `${c.firstname} ${c.lastname} ${c.email} ${c.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
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

  return (
    <div>
      <h2>Customers</h2>
      
      <input 
        type="text" 
        placeholder="Search..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
      />
      
      <table border="1">
        <thead>
          <tr>
            <th onClick={() => handleSort('firstname')}>First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('lastname')}>Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('email')}>Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('phone')}>Phone {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('city')}>City {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(c => (
            <tr key={c._links?.self?.href}>
              <td>{c.firstname}</td>
              <td>{c.lastname}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;