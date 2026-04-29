const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

export const getCustomers = async () => {
  const response = await fetch(`${BASE_URL}/customers`);
  const data = await response.json();
  return data._embedded?.customers || [];
};

export const getTrainingsWithCustomers = async () => {
  const response = await fetch(`${BASE_URL}/gettrainings`);
  return response.json();
};

// Add new customer
export const addCustomer = async (customer) => {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  return response.json();
};

// Update customer
export const updateCustomer = async (url, customer) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  return response.json();
};

// Delete customer
export const deleteCustomer = async (url) => {
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return response;
};

// Add training
export const addTraining = async (training) => {
  const response = await fetch(`${BASE_URL}/trainings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(training),
  });
  return response.json();
};

// Delete training
export const deleteTraining = async (id) => {
  const response = await fetch(`${BASE_URL}/trainings/${id}`, {
    method: 'DELETE',
  });
  return response;
};