import React from 'react';
import { ChevronRightIcon } from '../components/Icons';

const SettingsItem: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
    <button className="w-full flex items-center p-4 bg-white rounded-xl mb-3 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="text-2xl mr-4">{icon}</div>
        <span className="flex-grow text-left font-semibold text-gray-700">{label}</span>
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
    </button>
);

const SettingsScreen: React.FC = () => {
    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Settings</h1>
            </header>
            
            <section>
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                     <img src="https://picsum.photos/seed/user/64/64" alt="User" className="w-16 h-16 rounded-full" />
                    <div>
                        <p className="font-bold text-xl text-gray-800">Lilya</p>
                        <p className="text-gray-500">lilya.dev@example.com</p>
                    </div>
                </div>
            </section>

            <section>
                <SettingsItem icon="👤" label="Account" />
                <SettingsItem icon="🎨" label="Appearance" />
                <SettingsItem icon="🔔" label="Notifications" />
                <SettingsItem icon="🛡️" label="Privacy & Security" />
                <SettingsItem icon="❓" label="Help & Support" />
            </section>

             <div className="text-center">
                <button className="font-semibold text-red-500 hover:text-red-700">
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
