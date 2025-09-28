import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { PlusIcon, TrashIcon } from '../components/Icons';

interface TasksScreenProps {
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }> = ({ task, onToggle, onDelete }) => (
    <div className="flex items-center p-4 bg-white rounded-2xl mb-3 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/80 group">
        <button onClick={() => onToggle(task.id)} className="flex items-center w-full text-left">
            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300 group-hover:border-purple-400'}`}>
                {task.completed && <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
            <span className={`flex-grow ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.text}
            </span>
        </button>
         <button onClick={() => onDelete(task.id)} className="ml-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
);


const TasksScreen: React.FC<TasksScreenProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    }, []);
    
    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(newTaskText);
        setNewTaskText('');
        setIsModalOpen(false);
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Today's Tasks</h1>
                <p className="text-gray-500">{currentDate}</p>
            </header>
            
            <div className="pr-2 -mr-2">
                 {activeTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />)}
                
                {completedTasks.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-gray-500 font-bold mb-4">Completed</h2>
                        {completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask}/>)}
                    </div>
                )}
            </div>
            
            {/* FAB to open modal */}
            <div className="fixed bottom-28 right-0 max-w-md w-full mx-auto flex justify-end pr-6">
                <button onClick={() => setIsModalOpen(true)} className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-purple-500/50">
                    <PlusIcon className="w-8 h-8" />
                </button>
            </div>
            
            {/* --- Add Task Modal --- */}
            <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsModalOpen(false)}>
                 <div 
                    className={`absolute bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 backdrop-blur-xl rounded-t-3xl transition-transform duration-300 ease-out ${isModalOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={(e) => e.stopPropagation()}
                 >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">New Task</h2>
                    <form onSubmit={handleAddTaskSubmit}>
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="e.g., Learn React Native"
                            className="w-full h-14 bg-white/50 rounded-xl px-4 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500"
                            autoFocus
                        />
                         <button type="submit" className="w-full h-14 mt-4 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TasksScreen;
