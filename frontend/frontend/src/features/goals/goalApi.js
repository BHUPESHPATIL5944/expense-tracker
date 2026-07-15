import api from '@/lib/axios.js';

export const getGoals=async()=>{
    const res=await api.get('/goals');
    return res.data.goals;
};

export const createGoal = async (data) => {
  const res = await api.post('/goals', data);
  return res.data.goal;
};

export const contributeToGoal = async ({ id, amount }) => {
  const res = await api.patch(`/goals/${id}/contribute`, { amount });
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await api.delete(`/goals/${id}`);
  return res.data;
};



