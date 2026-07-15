import {Routes, Route} from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ProtectdRoute from '@/layouts/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import GoalsPage from '@/pages/GoalsPage';
import ProfilePage from '@/pages/Profilepage';

 
const Profile = () => <div className="p-4">Profile page</div>

function App(){
  return(
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center">
  <div className="w-full max-w-md bg-gray-50 dark:bg-gray-950 relative pb-24"></div>
     <Routes>
        
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

          <Route element={<ProtectdRoute/>}/>
         <Route element={<AppLayout />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<GoalsPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>        
    </Routes>
    </div>
    
  )
}
export default App;