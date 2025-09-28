import React from 'react';
import type { Task, Screen } from '../types';
import { ChevronRightIcon } from '../components/Icons';
import Header from '../components/Header';

interface HomeScreenProps {
    tasks: Task[];
    userName: string;
    setActiveScreen: (screen: Screen) => void;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full origin-left transition-transform duration-500 ease-out" 
                style={{ transform: `scaleX(${value / 100})` }}
            ></div>
        </div>
    );
};

const TaskQuickView: React.FC<{ task: Task }> = ({ task }) => (
    <div className="flex items-center p-3 bg-white rounded-xl mb-2">
        <div className={`w-5 h-5 rounded-md flex-shrink-0 mr-3 ${task.completed ? 'bg-purple-200' : 'bg-yellow-200'}`}></div>
        <span className={`flex-grow text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.text}
        </span>
    </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ tasks, userName, setActiveScreen }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);

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

            <section className="bg-white p-8 rounded-3xl shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{progressTitle}</h2>
                        <p className="text-base text-gray-500">{completedTasks}/{totalTasks} tasks done</p>
                    </div>
                    <div className="font-bold text-purple-600 text-3xl">{completionPercentage}%</div>
                </div>
                <ProgressBar value={completionPercentage} />
            </section>
            
            <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Upcoming Tasks</h2>
                    <button className="text-sm font-semibold text-purple-600 flex items-center">
                        See All <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map(task => <TaskQuickView key={task.id} task={task} />)
                    ) : (
                        <p className="text-gray-500 text-center py-4">No upcoming tasks. Great job!</p>
                    )}
                </div>
            </section>

             <section className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-3xl text-white">
                <h2 className="text-lg font-bold">Go Premium!</h2>
                <p className="text-sm opacity-80 mt-1 mb-4">Unlock more features and boost your productivity.</p>
                <button className="bg-white text-purple-600 font-bold py-2 px-5 rounded-full text-sm">Upgrade Now</button>
            </section>
        </div>
    );
};

export default HomeScreen;