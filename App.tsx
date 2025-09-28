import React, { useState } from 'react';
import type { Task, Screen } from './types';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import TasksScreen from './screens/TasksScreen';
import TrackerScreen from './screens/TrackerScreen';
import SettingsScreen from './screens/SettingsScreen';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', text: 'Design the new logo', completed: false, category: 'Work' },
        { id: '2', text: 'Develop the landing page', completed: false, category: 'Work' },
        { id: '3', text: 'Go for a 30-min run', completed: true, category: 'Fitness' },
        { id: '4', text: 'Buy groceries', completed: false, category: 'Personal' },
    ]);
    const [activeScreen, setActiveScreen] = useState<Screen>('home');

    const handleAddTask = (text: string) => {
        if (text.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text,
                completed: false,
            };
            setTasks([newTask, ...tasks]);
        }
    };
    
    const handleToggleTask = (id: string) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen tasks={tasks} />;
            case 'tasks':
                return <TasksScreen tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />;
            case 'tracker':
                return <TrackerScreen tasks={tasks} />;
            case 'settings':
                return <SettingsScreen />;
            default:
                return <HomeScreen tasks={tasks} />;
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