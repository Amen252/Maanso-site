import api from '../lib/axios.js';

export const getAllGabays = async () => {
  const response = await api.get('/gabays');
  return response.data;
};

export const getGabayById = async (id) => {
  const response = await api.get(`/gabays/${id}`);
  return response.data;
};

export const createGabay = async (gabayData) => {
  const response = await api.post('/gabays/create', gabayData);
  return response.data;
};

export const updateGabay = async ({ id, ...gabayData }) => {
  const response = await api.put(`/gabays/${id}`, gabayData);
  return response.data;
};

export const deleteGabay = async (id) => {
  const response = await api.delete(`/gabays/${id}`);
  return response.data;
};

export const toggleLike = async (id) => {
  const response = await api.post(`/gabays/${id}/like`);
  return response.data;
};

export const addComment = async ({ id, content }) => {
  const response = await api.post(`/gabays/${id}/comments`, { content });
  return response.data;
};

export const deleteComment = async ({ id, commentId }) => {
  const response = await api.delete(`/gabays/${id}/comments/${commentId}`);
  return response.data;
};
