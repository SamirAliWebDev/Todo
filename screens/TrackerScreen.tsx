import React from 'react';
import type { Task } from '../types';

interface TrackerScreenProps {
    tasks: Task[];
}

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
        <p className="text-3xl font-bold text-purple-600">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
);

const CalendarDay: React.FC<{ day: number, active: boolean }> = ({ day, active }) => (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${active ? 'bg-green-400 text-white' : 'bg-gray-100'}`}>
        {day}
    </div>
);

const TrackerScreen: React.FC<TrackerScreenProps> = ({ tasks }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;

    // Mock data for calendar/streak
    const streak = 5; 
    const activeDays = [3, 4, 5, 6, 7];

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Your Progress</h1>
                <p className="text-gray-500">Keep up the great work!</p>
            </header>

            <section className="grid grid-cols-2 gap-4">
                <StatCard label="Completed Tasks" value={completedTasks} />
                <StatCard label="Active Tasks" value={activeTasks} />
                <StatCard label="Completion Rate" value={`${totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}%`} />
                <StatCard label="Current Streak" value={`${streak} Days`} />
            </section>

            <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4">This Week's Activity</h2>
                 <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                     <div className="grid grid-cols-7 gap-2 text-sm">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(day => (
                            <CalendarDay key={day} day={day} active={activeDays.includes(day)} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TrackerScreen;
