import React from 'react';
import type { Screen } from '../types';
import { HomeIcon, CheckSquareIcon, ChartBarIcon, CogIcon } from './Icons';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
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
            className={`flex flex-col items-center justify-center gap-1.5 w-20 py-3 rounded-lg group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                isActive ? 'text-teal-300' : 'text-gray-400 hover:text-white'
            }`}
            aria-label={screen}
            aria-current={isActive ? 'page' : undefined}
        >
            <div className={`w-7 h-7 transform transition-transform duration-300 ease-out ${isActive ? 'scale-110' : 'scale-100'}`}>
                {icon}
            </div>
            <span className="text-sm font-medium tracking-tight">{label}</span>
        </button>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    const navItems: { screen: Screen; icon: React.ReactNode; label: string }[] = [
        { screen: 'home', icon: <HomeIcon className="w-full h-full" />, label: 'Home' },
        { screen: 'tasks', icon: <CheckSquareIcon className="w-full h-full" />, label: 'Tasks' },
        { screen: 'tracker', icon: <ChartBarIcon className="w-full h-full" />, label: 'Tracker' },
        { screen: 'settings', icon: <CogIcon className="w-full h-full" />, label: 'Settings' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-tl-3xl rounded-tr-3xl border-t border-gray-700/50 shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.2)]">
                <nav className="flex items-center justify-around w-full py-2">
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