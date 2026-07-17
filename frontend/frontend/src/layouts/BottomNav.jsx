import {NavLink} from 'react-router-dom'
import {Home,List,Plus,Target,User} from 'lucide-react'
import {cn} from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/transactions', icon: List, label: 'Entries' },
  null, // placeholder for the center "+" button
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/profile', icon: User, label: 'Profile' },
];
export default function BottomNav({ onAddClick }) {
  return (
 <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-t-3xl shadow-lg">
 <div className="relative flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          if (!item) {
            // Raised center button
            return (
              <button
                key="add"
                onClick={onAddClick}
                className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={26} />
              </button>
            );
          }

          const { to, icon: Icon, label } = item;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 text-xs px-3 py-2 rounded-xl transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-400:text-gray-500'
                )
              }
            >
              <Icon size={22} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}


