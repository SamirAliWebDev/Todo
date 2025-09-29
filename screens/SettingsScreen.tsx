import React from 'react';
import { ChevronRightIcon } from '../components/Icons';
import Header from '../components/Header';

interface SettingsScreenProps {
    userName: string;
    userEmail: string;
}

const SettingsItem: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
    <button className="w-full flex items-center p-4 lg:p-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <div className="text-2xl lg:text-3xl mr-4">{icon}</div>
        <span className="flex-grow text-left font-semibold text-gray-700 lg:text-lg">{label}</span>
        <ChevronRightIcon className="w-6 h-6 lg:w-7 lg:h-7 text-gray-400" />
    </button>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userName, userEmail }) => {
    const pageTitle = (
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Settings</h1>
    );
    
    return (
        <div className="p-6 space-y-8 max-w-2xl mx-auto">
            <Header title={pageTitle} showAvatar={false} />
            
            <section>
                <div className="flex items-center gap-4 lg:gap-6 bg-white p-4 lg:p-6 rounded-2xl shadow-sm">
                     <img src="https://picsum.photos/seed/user/64/64" alt="User" className="w-16 h-16 lg:w-20 lg:h-20 rounded-full" />
                    <div>
                        <p className="font-bold text-xl lg:text-2xl text-gray-800">{userName}</p>
                        <p className="text-gray-500 lg:text-lg">{userEmail}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <SettingsItem icon="👤" label="Account" />
                    <SettingsItem icon="🎨" label="Appearance" />
                    <SettingsItem icon="🔔" label="Notifications" />
                    <SettingsItem icon="🛡️" label="Privacy & Security" />
                    <SettingsItem icon="❓" label="Help & Support" />
                    <div></div> {/* Empty div to balance the grid */}
                </div>
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