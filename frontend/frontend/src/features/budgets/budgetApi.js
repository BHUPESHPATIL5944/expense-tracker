import api from '@/lib/axios';

export const getBudgets=async(month,year)=>{
    const res=await api.get('/budgets',{params:{month,year}});
    return res.data.budgets;
};

export const setBudget = async (data) => {
  const res = await api.post('/budgets', data);
  return res.data.budget;
};




