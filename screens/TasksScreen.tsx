
import React, { useState, useEffect, useRef } from 'react';
import type { Task, Screen } from '../types';
import { PlusIcon, TrashIcon } from '../components/Icons';
import Header from '../components/Header';

interface TasksScreenProps {
    tasks: Task[];
    onAddTask: (taskDetails: { text: string; category?: 'Personal' | 'Work' | 'Fitness'; time?: string }) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    setActiveScreen: (screen: Screen) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }> = React.memo(({ task, onToggle, onDelete }) => (
    <div className="flex items-center p-4 bg-white rounded-2xl mb-3 shadow-sm transition-transform duration-300 hover:shadow-md hover:bg-white/80 group will-change-transform hover:-translate-y-1">
        <button onClick={() => onToggle(task.id)} className="flex items-center w-full text-left">
            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-colors duration-300 ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'}`}>
                {task.completed && <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
            <div className="flex-grow">
                 <span className={`truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.text}
                </span>
                {(task.category || task.time) && (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        {task.category && (
                            <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-semibold ${
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
        </button>
         <button onClick={() => onDelete(task.id)} className="ml-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
));


const TasksScreen: React.FC<TasksScreenProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, setActiveScreen }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [newCategory, setNewCategory] = useState<'Personal' | 'Work' | 'Fitness'>();
    const [newTime, setNewTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const date = new Date();
        setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);
    
    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask({ text: newTaskText, category: newCategory, time: newTime });
        setNewTaskText('');
        setNewCategory(undefined);
        setNewTime('');
        setIsModalOpen(false);
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const categories: ('Personal' | 'Work' | 'Fitness')[] = ['Personal', 'Work', 'Fitness'];


    const pageTitle = (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Today's Tasks</h1>
            <p className="text-gray-500 mt-1">{currentDate}</p>
        </div>
    );
    
    return (
        <div className="p-6">
            <Header title={pageTitle} onAvatarClick={() => setActiveScreen('settings')} className="mb-8" />
            
            <div className="pr-2 -mr-2">
                {tasks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📝</div>
                        <p className="text-lg font-semibold text-gray-600">No tasks yet</p>
                        <p className="text-gray-500">Tap the <span className="font-bold text-teal-600">+</span> button to add your first task!</p>
                    </div>
                ) : (
                    <>
                        {activeTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />)}
                        
                        {completedTasks.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-gray-500 font-bold mb-4">Completed</h2>
                                {completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask}/>)}
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* FAB to open modal */}
            <div className="fixed bottom-28 right-6 z-20">
                <button onClick={() => setIsModalOpen(true)} className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg font-semibold hover:bg-teal-600 transition-transform duration-300 transform hover:scale-110 shadow-lg shadow-teal-500/50 will-change-transform">
                    <PlusIcon className="w-8 h-8" />
                </button>
            </div>
            
            {/* --- Add Task Modal --- */}
            <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-10 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsModalOpen(false)}>
                 <div 
                    className={`absolute bottom-48 right-6 w-[calc(100%-3rem)] max-w-sm p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 ease-out origin-bottom-right will-change-transform ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                    onClick={(e) => e.stopPropagation()}
                 >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">New Task</h2>
                    <form onSubmit={handleAddTaskSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="e.g., Learn React Native"
                            className="w-full h-14 bg-white/50 rounded-xl px-4 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500 border border-transparent focus:border-teal-500"
                        />

                        <div className="mt-4">
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">Category</label>
                            <div className="flex space-x-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setNewCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                            newCategory === cat
                                                ? 'bg-teal-500 text-white'
                                                : 'bg-white/50 text-gray-700 hover:bg-white'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">Time</label>
                            <input
                                type="text"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                placeholder="e.g., 10:30 AM"
                                className="w-full h-14 bg-white/50 rounded-xl px-4 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500 border border-transparent focus:border-teal-500"
                            />
                        </div>
                        
                         <button type="submit" className="w-full h-14 mt-6 bg-teal-500 text-white rounded-xl text-lg font-semibold hover:bg-teal-600 transition-colors">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TasksScreen;
