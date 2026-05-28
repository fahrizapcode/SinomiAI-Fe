// API to connect to Express backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const generateProducts = async (wasteType) => {
  try {
    const response = await fetch(`${API_URL}/generate/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wasteType }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating products:", error);
    throw error;
  }
};

export const generateStepByStep = async (wasteType, productName) => {
  try {
    const response = await fetch(`${API_URL}/generate/steps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wasteType, productName }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating steps:", error);
    throw error;
  }
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Register failed');
  return await res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  return await res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
};

export const uploadProduct = async (formData, token) => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
  return await res.json();
};
