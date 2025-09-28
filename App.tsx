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

    const handleAddTask = useCallback((text: string) => {
        if (text.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text,
                completed: false,
            };
            setTasks(currentTasks => [newTask, ...currentTasks]);
        }
    }, []);

    const handleToggleTask = useCallback((id: string) => {
        setTasks(currentTasks => currentTasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
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
        <div className="h-screen w-screen max-w-md mx-auto flex flex-col font-sans bg-gray-50">
            <main className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default App;
