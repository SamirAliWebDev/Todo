
import React from 'react';
import type { Task, Screen } from '../types';
import Header from '../components/Header';

interface TrackerScreenProps {
    tasks: Task[];
    setActiveScreen: (screen: Screen) => void;
}

const StatCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`bg-white p-4 rounded-2xl shadow-sm text-center ${className}`}>
        <p className="text-3xl font-bold text-teal-500">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
);

const CalendarDay: React.FC<{ day: number, active: boolean, isToday: boolean }> = ({ day, active, isToday }) => (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
        active ? 'bg-green-400 text-white font-bold' : 
        isToday ? 'bg-teal-100 text-teal-600' : 
        'bg-gray-100'
    }`}>
        {day}
    </div>
);

const TrackerScreen: React.FC<TrackerScreenProps> = ({ tasks, setActiveScreen }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const toYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // Group tasks by date to check for full completion
    const tasksByDate = new Map<string, { total: number; completed: number }>();
    tasks.forEach(task => {
        if (task.date) {
            if (!tasksByDate.has(task.date)) {
                tasksByDate.set(task.date, { total: 0, completed: 0 });
            }
            const dayStats = tasksByDate.get(task.date)!;
            dayStats.total += 1;
            if (task.completed) {
                dayStats.completed += 1;
            }
        }
    });

    // A day is "fully complete" only if all tasks for that day are done.
    const fullyCompletedDates = new Set<string>();
    for (const [date, stats] of tasksByDate.entries()) {
        if (stats.total > 0 && stats.total === stats.completed) {
            fullyCompletedDates.add(date);
        }
    }
    
    const today = new Date();
    const todayYYYYMMDD = toYYYYMMDD(today);
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
    const startOfWeek = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday as start of week
    startOfWeek.setDate(today.getDate() + diff);
    
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayYYYYMMDD = toYYYYMMDD(day);
        return {
            dateNumber: day.getDate(),
            isToday: dayYYYYMMDD === todayYYYYMMDD,
            active: fullyCompletedDates.has(dayYYYYMMDD) // Use the new set here
        };
    });

    const pageTitle = (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Your Progress</h1>
            <p className="text-gray-500 mt-1">Keep up the great work!</p>
        </div>
    );

    let completedLabel: string;
    let activeLabel: string;
    let rateLabel: string;

    if (totalTasks === 0) {
        completedLabel = "Nothing yet";
        activeLabel = "Add a task";
        rateLabel = "Set a goal";
    } else {
        if (completedTasks === 0) completedLabel = "Let's start!";
        else if (completedTasks === totalTasks) completedLabel = "All clear!";
        else if (completedTasks >= totalTasks / 2) completedLabel = "Almost there!";
        else completedLabel = "Getting started";

        if (activeTasks === 0) activeLabel = "Well done!";
        else if (activeTasks === 1) activeLabel = "One left";
        else activeLabel = "Still to do";

        if (completionPercentage === 0) rateLabel = "Start crushing it";
        else if (completionPercentage === 100) rateLabel = "Perfection!";
        else if (completionPercentage >= 50) rateLabel = "On a roll!";
        else rateLabel = "Good progress";
    }

    return (
        <div className="p-6 space-y-8">
            <Header title={pageTitle} onAvatarClick={() => setActiveScreen('settings')} />

            <section className="grid grid-cols-2 gap-4">
                <StatCard className="col-span-2" label={rateLabel} value={`${completionPercentage}%`} />
                <StatCard label={completedLabel} value={completedTasks} />
                <StatCard label={activeLabel} value={activeTasks} />
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
                        {weekDays.map((day, index) => (
                            <CalendarDay key={index} day={day.dateNumber} active={day.active} isToday={day.isToday} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TrackerScreen;
