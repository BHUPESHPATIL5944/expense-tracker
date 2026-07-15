import api from '@/lib/axios';

export const getSummary=async(month,year)=>{
    const res=await api.get('/dashboard/summary',{params:{month,year}});
    return res.data.summary;
};

export const getRecentTransaction=async(limit=5)=>{
    const res=await api.get('/dashboard/recent',{params:{limit}});
    return res.data.transactions;
};

export const getCategoryBreakdown=async(month,year,type='EXPENSE')=>{
    const res=await api.get('/dashboard/category-breakdown',{params:{month,year,type}});
    return res.data.breakdown;
};



