import React from 'react';
import type { Screen } from '../types';
import { HomeIcon, CheckSquareIcon, ChartBarIcon, CogIcon } from './Icons';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

interface NavItemProps {
    screen: Screen;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: (screen: Screen) => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, icon, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(screen)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 h-16 rounded-2xl ${isActive ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'}`}
            aria-label={screen}
        >
            <div className="w-7 h-7">{icon}</div>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    const navItems: { screen: Screen; icon: React.ReactNode }[] = [
        { screen: 'home', icon: <HomeIcon className="w-full h-full" /> },
        { screen: 'tasks', icon: <CheckSquareIcon className="w-full h-full" /> },
        { screen: 'tracker', icon: <ChartBarIcon className="w-full h-full" /> },
        { screen: 'settings', icon: <CogIcon className="w-full h-full" /> },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-transparent">
             <div className="mx-4 h-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50">
                <nav className="h-full w-full flex justify-around items-center px-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.screen}
                            screen={item.screen}
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
