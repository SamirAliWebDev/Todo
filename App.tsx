import React, { useState, useCallback } from 'react';
import type { Task, Screen } from './types';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import TasksScreen from './screens/TasksScreen';
import TrackerScreen from './screens/TrackerScreen';
import SettingsScreen from './screens/SettingsScreen';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [user] = useState({ name: 'Lilya', email: 'lilya.dev@example.com' });

    const handleAddTask = useCallback((taskDetails: { text: string; category?: 'Personal' | 'Work' | 'Fitness', time?: string, date: string }) => {
        if (taskDetails.text.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text: taskDetails.text,
                completed: false,
                category: taskDetails.category,
                time: taskDetails.time,
                date: taskDetails.date,
            };
            setTasks(currentTasks => [newTask, ...currentTasks]);
        }
    }, []);

    const handleToggleTask = useCallback((id: string) => {
        setTasks(currentTasks => currentTasks.map(task => {
            if (task.id === id) {
                const isCompleted = !task.completed;
                let completionDate;
                if (isCompleted) {
                    // Use the task's assigned date for completion, not the current date.
                    // This ensures streaks are calculated correctly for past tasks.
                    completionDate = task.date;
                    // Fallback for any older tasks that might not have a date property
                    if (!completionDate) {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = (today.getMonth() + 1).toString().padStart(2, '0');
                        const day = today.getDate().toString().padStart(2, '0');
                        completionDate = `${year}-${month}-${day}`;
                    }
                }
                return { 
                    ...task, 
                    completed: isCompleted,
                    completionDate 
                };
            }
            return task;
        }));
    }, []);

    const handleDeleteTask = useCallback((id: string) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
    }, []);

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen tasks={tasks} userName={user.name} setActiveScreen={setActiveScreen} />;
            case 'tasks':
                return <TasksScreen tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} setActiveScreen={setActiveScreen} />;
            case 'tracker':
                return <TrackerScreen tasks={tasks} setActiveScreen={setActiveScreen} />;
            case 'settings':
                return <SettingsScreen userName={user.name} userEmail={user.email} />;
            default:
                return <HomeScreen tasks={tasks} userName={user.name} setActiveScreen={setActiveScreen} />;
        }
    };
    
    return (
        <div className="min-h-screen w-full max-w-6xl mx-auto flex flex-col font-sans bg-gray-50 lg:flex-row lg:gap-6 lg:p-6">
            <main className="flex-1 overflow-y-auto pb-28 lg:pb-6 scrollbar-hide lg:bg-white lg:rounded-2xl lg:shadow-sm">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} tasks={tasks} />
        </div>
    );
};

export default App;