import {useState,useEffect,createContext,useContext} from 'react';
import {getCurrentUser,loginUser,logoutUser} from '@/features/auth/authApi.js'

const AuthContext=createContext(null);// making constext-api

export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const [isLoading,setLoading]=useState(true);

    useEffect(()=>{
        const checkAuth=async()=>{
            try{
                const data=await getCurrentUser()
                setUser(data.user);
            }catch{
                setUser(null);// no valid session
            }finally{
                setLoading(false);
            }
        };
        checkAuth();
    },[]);
    const login=async(Credential)=>{
        const data=await loginUser(Credential);
        setUser(data.user);
        return data;
    };
     const logout = async () => {
    await logoutUser();
    setUser(null);
  };
  return(
    <AuthContext.Provider value={{user,isLoading,login,logout}}>
        {children}
    </AuthContext.Provider>
  );
}
export function useAuth(){
    const context=useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}



