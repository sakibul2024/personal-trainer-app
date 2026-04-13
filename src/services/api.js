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