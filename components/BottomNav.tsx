import React from 'react';
import type { Task } from '../types';
import type { Screen } from '../types';
import { HomeIcon, CheckSquareIcon, ChartBarIcon, CogIcon } from './Icons';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
    tasks: Task[];
}

interface NavItemProps {
    screen: Screen;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: (screen: Screen) => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(screen)}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-3 w-20 lg:w-full py-3 lg:px-4 rounded-lg group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                isActive 
                    ? 'text-teal-300 lg:text-teal-600 lg:bg-teal-50' 
                    : 'text-gray-400 hover:text-white lg:text-gray-600 lg:hover:text-teal-600 lg:hover:bg-gray-50'
            }`}
            aria-label={screen}
            aria-current={isActive ? 'page' : undefined}
        >
            <div className={`w-7 h-7 lg:w-6 lg:h-6 transform transition-transform duration-300 ease-out ${isActive ? 'scale-110 lg:scale-100' : 'scale-100'}`}>
                {icon}
            </div>
            <span className="text-sm font-medium tracking-tight lg:text-base">{label}</span>
        </button>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, tasks }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    
    const navItems: { screen: Screen; icon: React.ReactNode; label: string }[] = [
        { screen: 'home', icon: <HomeIcon className="w-full h-full" />, label: 'Home' },
        { screen: 'tasks', icon: <CheckSquareIcon className="w-full h-full" />, label: 'Tasks' },
        { screen: 'tracker', icon: <ChartBarIcon className="w-full h-full" />, label: 'Tracker' },
        { screen: 'settings', icon: <CogIcon className="w-full h-full" />, label: 'Settings' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 max-w-6xl mx-auto lg:static lg:w-80 lg:flex-shrink-0">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-tl-3xl rounded-tr-3xl lg:rounded-2xl border-t border-gray-700/50 lg:border lg:border-gray-200 shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.2)] lg:shadow-sm lg:bg-white">
                {/* Desktop Stats Section */}
                <div className="hidden lg:block p-6 border-b border-gray-100">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Today's Progress</h3>
                        <p className="text-sm text-gray-500">{completedTasks} of {totalTasks} tasks completed</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-teal-500 h-2 rounded-full transition-all duration-700 ease-out"
                            style={{ width: totalTasks > 0 ? `${Math.max((completedTasks / totalTasks) * 100, 2)}%` : '8px' }}
                        ></div>
                    </div>
                </div>
                
                <nav className="flex items-center justify-around w-full py-2 lg:flex-col lg:space-y-2 lg:p-4">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.screen}
                            screen={item.screen}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeScreen === item.screen}
                            onClick={setActiveScreen}
                        />
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default BottomNav;