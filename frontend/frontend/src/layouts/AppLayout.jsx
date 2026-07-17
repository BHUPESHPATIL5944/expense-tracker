import { Outlet, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav';

export default function AppLayout() {
    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center">
            <div className="w-full max-w-md bg-gray-50 dark:bg-gray-950 relative pb-24">
                <Outlet />
                <BottomNav onAddClick={() => navigate('/transaction/new')} />
            </div>
        </div>

    );
}


