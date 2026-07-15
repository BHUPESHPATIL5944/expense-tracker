export const formatCurrency=(amount)=>{
    return new Intl.NumberFormat('en-In',{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0,
    }).format(amount||0);
};