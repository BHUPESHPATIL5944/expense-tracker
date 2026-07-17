import api from '@/lib/axios';


export const getTransaction=async({pageParam,filters})=>{
    const res=await api.get('/transactions',{
        params:{cursor:pageParam,limit:10,...filters},
    });
    return res.data;
};

export const createTransaction=async(data)=>{
    const res=await api.post('/transactions',data);
    return res.data.transaction;
};

export const updateTransaction=async({id,data})=>{
    const res=await api.put('/transactions/${id}',data);
    return res.data.transaction;
};
export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};
export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data.categories;
};





