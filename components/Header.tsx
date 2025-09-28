import React from 'react';

interface HeaderProps {
    title: React.ReactNode;
    showAvatar?: boolean;
    onAvatarClick?: () => void;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, showAvatar = true, onAvatarClick, className = '' }) => {
    return (
        <header className={className}>
            {showAvatar && onAvatarClick && (
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={onAvatarClick} 
                        className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white hover:ring-teal-400 transition-all duration-300"
                        aria-label="Open settings"
                    >
                        <img src="https://picsum.photos/seed/user/64/64" alt="User" className="w-full h-full object-cover" />
                    </button>
                </div>
            )}
            <div>{title}</div>
        </header>
    );
};

export default Header;