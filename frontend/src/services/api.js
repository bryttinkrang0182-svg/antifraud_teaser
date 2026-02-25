// API service for communicating with the PHP backend
const API_BASE_URL = '/api';

export const submitForm = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/submit.php`, {
    method: 'POST',
    body: formData
  });
  return response.json();
};

export const getVictimCount = async () => {
  const response = await fetch(`${API_BASE_URL}/submit.php?action=count`);
  return response.json();
};
