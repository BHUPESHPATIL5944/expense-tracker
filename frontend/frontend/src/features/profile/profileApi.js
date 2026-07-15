import api from '@/lib/axios';

export const updateProfile = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data.user;
};

export const changePassword = async (data) => {
  const res = await api.put('/users/change-password', data);
  return res.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.user;
};


