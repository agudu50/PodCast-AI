// src/api/index.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Upload and process file
export async function uploadAndProcessFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-and-process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Upload failed');
  }

  return await response.json();
}

// Get episode data
export async function getEpisodeData(episodeId) {
  return apiCall(`/get-data/${episodeId}`);
}

// Enhance blog content
export async function enhanceBlog(episodeId) {
  return apiCall(`/enhance-blog/${episodeId}`, {
    method: 'POST',
  });
}

// Health check
export async function healthCheck() {
  return apiCall('/health');
}

// Optional: Keep Appwrite functions for fallback or specific use cases
export { databases, storage, functions } from '../lib/appwrite';

export default {
  uploadAndProcessFile,
  getEpisodeData,
  enhanceBlog,
  healthCheck,
};