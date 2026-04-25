export const API_URL = 'http://localhost:3000/api';

export const createLink = async (url: string) => {
  const res = await fetch(`${API_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error('Failed to create link');
  }

  return res.json();
};