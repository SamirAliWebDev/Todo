
import React from 'react';

interface ComingSoonScreenProps {
    title: string;
}

const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fadeIn">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter mb-4">{title}</h1>
            <p className="text-lg text-gray-500">This section is coming soon!</p>
            <div className="mt-8 text-6xl">🚀</div>
        </div>
    );
};

export default ComingSoonScreen;
