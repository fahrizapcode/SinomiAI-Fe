// API to connect to Express backend

const API_URL = 'http://localhost:5000/api';

export const classifyWaste = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error classifying waste:", error);
    throw error;
  }
};

export const generateRecommendation = async (category) => {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw error;
  }
};
