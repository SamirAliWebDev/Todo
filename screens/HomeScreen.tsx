
import React from 'react';
import type { Task, Screen } from '../types';
import { ChevronRightIcon } from '../components/Icons';
import Header from '../components/Header';

interface HomeScreenProps {
    tasks: Task[];
    userName: string;
    setActiveScreen: (screen: Screen) => void;
}

const TaskQuickView: React.FC<{ task: Task }> = ({ task }) => (
    <div className="flex items-start p-3 bg-white rounded-xl mb-2">
        <div className={`w-5 h-5 rounded-md flex-shrink-0 mr-3 mt-1 ${task.completed ? 'bg-teal-200' : 'bg-yellow-200'}`}></div>
        <div className="flex-grow">
            <span className={`text-sm truncate block ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text}
            </span>
            {(task.category || task.time) && (
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                     {task.category && (
                        <span className={`px-1.5 py-0.5 rounded text-white text-[9px] font-bold ${
                            task.category === 'Work' ? 'bg-blue-400' :
                            task.category === 'Fitness' ? 'bg-green-400' :
                            'bg-yellow-500' // Personal
                        }`}>
                            {task.category}
                        </span>
                    )}
                    {task.time && <span>{task.time}</span>}
                </div>
            )}
        </div>
    </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ tasks, userName, setActiveScreen }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let progressTitle: string;
    if (totalTasks === 0) {
        progressTitle = "Ready for a new day!";
    } else if (completionPercentage === 100) {
        progressTitle = "Awesome! All done!";
    } else if (completionPercentage >= 75) {
        progressTitle = "Almost there!";
    } else if (completionPercentage >= 25) {
        progressTitle = "Keep up the momentum!";
    } else if (completionPercentage > 0) {
        progressTitle = "Getting started!";
    } else {
        progressTitle = "Let's get started!";
    }

    const pageTitle = (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Let's get this done, {userName}!</h1>
            <p className="text-gray-500 mt-1">What's your focus for today?</p>
        </div>
    );

    return (
        <div className="p-6 space-y-8">
            <Header title={pageTitle} onAvatarClick={() => setActiveScreen('settings')} />

            <section className="bg-white rounded-3xl shadow-sm flex overflow-hidden items-stretch">
                <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">{progressTitle}</h2>
                        <p className="text-sm text-gray-500 mt-1">{completedTasks} of {totalTasks} tasks done</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-cyan-400 to-teal-500 h-3 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>
                <div className="w-1/3">
                    <img
                        src="https://i.postimg.cc/KYCDcR3t/69eeccd4513dc197ae937877451097d9.png"
                        alt="Progress illustration"
                        className="w-full h-full object-cover object-right"
                    />
                </div>
            </section>
            
            <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Upcoming Tasks</h2>
                    <button className="text-sm font-semibold text-teal-500 flex items-center">
                        See All <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    {tasks.filter(t => !t.completed).slice(0, 3).length > 0 ? (
                        tasks.filter(t => !t.completed).slice(0, 3).map(task => <TaskQuickView key={task.id} task={task} />)
                    ) : (
                        <p className="text-gray-500 text-center py-4">No upcoming tasks. Great job!</p>
                    )}
                </div>
            </section>

             <section className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-3xl text-white">
                <h2 className="text-lg font-bold">Go Premium!</h2>
                <p className="text-sm opacity-80 mt-1 mb-4">Unlock more features and boost your productivity.</p>
                <button className="bg-white text-teal-600 font-bold py-2 px-5 rounded-full text-sm">Upgrade Now</button>
            </section>
        </div>
    );
};

export default HomeScreen;