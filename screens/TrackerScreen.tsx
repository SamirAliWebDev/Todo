import React from 'react';
import type { Task, Screen } from '../types';
import Header from '../components/Header';

interface TrackerScreenProps {
    tasks: Task[];
    setActiveScreen: (screen: Screen) => void;
}

const CalendarDay: React.FC<{ day: number, active: boolean, isToday: boolean }> = ({ day, active, isToday }) => (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
        active ? 'bg-green-400 text-white font-bold' : 
        isToday ? 'bg-teal-100 text-teal-600' : 
        'bg-gray-100'
    }`}>
        {day}
    </div>
);

const categoryDetails: { [key in 'Work' | 'Personal' | 'Fitness']: { icon: string; gradient: string; } } = {
    Work: { icon: '💼', gradient: 'from-blue-400 to-blue-500' },
    Personal: { icon: '🏠', gradient: 'from-yellow-400 to-yellow-500' },
    Fitness: { icon: '🧘', gradient: 'from-green-400 to-green-500' },
};
const categories: ('Work' | 'Personal' | 'Fitness')[] = ['Work', 'Personal', 'Fitness'];


const TrackerScreen: React.FC<TrackerScreenProps> = ({ tasks, setActiveScreen }) => {
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
            active: fullyCompletedDates.has(dayYYYYMMDD)
        };
    });

    const categoryStats = categories.map(category => {
        const categoryTasks = tasks.filter(t => t.category === category);
        const completed = categoryTasks.filter(t => t.completed).length;
        const total = categoryTasks.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { name: category, completed, total, percentage };
    }).filter(stat => stat.total > 0);

    const pageTitle = (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Your Progress</h1>
            <p className="text-gray-500 mt-1">Keep up the great work!</p>
        </div>
    );

    return (
        <div className="p-6 space-y-8">
            <Header title={pageTitle} onAvatarClick={() => setActiveScreen('settings')} />

            <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Category Progress</h2>
                 {categoryStats.length > 0 ? (
                    <div className={`grid gap-4 ${
                        categoryStats.length === 2 ? 'grid-cols-2' : 
                        categoryStats.length >= 3 ? 'grid-cols-3' :
                        'grid-cols-1'
                    }`}>
                        {categoryStats.map(stat => {
                            const details = categoryDetails[stat.name];
                            return (
                                <div key={stat.name} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col text-center">
                                    <div className="text-3xl mx-auto mb-2">{details.icon}</div>
                                    <h3 className="font-bold text-gray-800 text-sm">{stat.name}</h3>
                                    <span className="text-xs font-semibold text-gray-400 mt-1 mb-3">{stat.completed} of {stat.total} done</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-auto">
                                        <div
                                            className={`bg-gradient-to-r ${details.gradient} h-2 rounded-full transition-all duration-700 ease-out`}
                                            style={{ width: `${stat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500">No categorized tasks yet. Add some to see your progress!</p>
                    </div>
                )}
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