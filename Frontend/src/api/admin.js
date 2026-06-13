import api from '../lib/axios.js';

export const getStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async ({ id, role }) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAllGabays = async () => {
  const response = await api.get('/admin/gabays');
  return response.data;
};

export const createGabay = async (gabayData) => {
  const response = await api.post('/admin/gabays', gabayData);
  return response.data;
};

export const updateGabay = async ({ id, ...gabayData }) => {
  const response = await api.put(`/admin/gabays/${id}`, gabayData);
  return response.data;
};

export const deleteGabay = async (id) => {
  const response = await api.delete(`/admin/gabays/${id}`);
  return response.data;
};
