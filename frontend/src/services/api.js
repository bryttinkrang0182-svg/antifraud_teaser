// API service for communicating with the PHP backend
// For production, set VITE_API_URL environment variable in Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
