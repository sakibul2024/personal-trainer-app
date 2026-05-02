import { useState, useEffect } from 'react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/api';
import Papa from 'papaparse';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('firstname');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadCustomers();
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

  // Export to CSV function
  const exportToCSV = () => {
    // Filter out extra data (only keep customer data, no buttons/links)
    const exportData = sorted.map(customer => ({
      'First Name': customer.firstname,
      'Last Name': customer.lastname,
      'Email': customer.email,
      'Phone': customer.phone,
      'Street Address': customer.streetaddress || '',
      'Postcode': customer.postcode || '',
      'City': customer.city || ''
    }));

    
    const csv = Papa.unparse(exportData);
    
   
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const openAddForm = () => {
    setEditingCustomer(null);
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      streetaddress: '',
      postcode: '',
      city: ''
    });
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      streetaddress: customer.streetaddress || '',
      postcode: customer.postcode || '',
      city: customer.city || ''
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCustomer) {
      await updateCustomer(editingCustomer._links.self.href, formData);
    } else {
      await addCustomer(formData);
    }
    await loadCustomers();
    closeForm();
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.firstname} ${customer.lastname}?`)) {
      await deleteCustomer(customer._links.self.href);
      await loadCustomers();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customers</h2>
        <div>
          <button onClick={exportToCSV} style={{ marginRight: '10px' }}>📥 Export to CSV</button>
          <button onClick={openAddForm}>Add Customer</button>
        </div>
      </div>
      
      <input 
        type="text" 
        placeholder="Search..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
      />
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th onClick={() => handleSort('firstname')} style={{ cursor: 'pointer' }}>
              First Name {sortBy === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('lastname')} style={{ cursor: 'pointer' }}>
              Last Name {sortBy === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
              Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
              Phone {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
              City {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
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
              <td>
                <button onClick={() => openEditForm(c)} style={{ marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(c)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
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
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>First Name: </label><br/>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Last Name: </label><br/>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email: </label><br/>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Phone: </label><br/>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Street Address: </label><br/>
                <input type="text" name="streetaddress" value={formData.streetaddress} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Postcode: </label><br/>
                <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>City: </label><br/>
                <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
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

export default CustomerList;