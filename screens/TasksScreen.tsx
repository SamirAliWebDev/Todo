
import React, { useState, useEffect, useRef } from 'react';
import type { Task, Screen } from '../types';
import { PlusIcon, TrashIcon, XIcon } from '../components/Icons';
import Header from '../components/Header';

interface TasksScreenProps {
    tasks: Task[];
    onAddTask: (taskDetails: { text: string; category?: 'Personal' | 'Work' | 'Fitness'; time?: string; date: string }) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    setActiveScreen: (screen: Screen) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }> = React.memo(({ task, onToggle, onDelete }) => {
    const categoryColor = task.category === 'Work' ? 'bg-blue-400' :
                          task.category === 'Fitness' ? 'bg-green-400' :
                          'bg-yellow-500'; // Personal

    return (
        <div className="relative mb-3 group">
             <div className="absolute left-3 top-7 -translate-y-1/2 -translate-x-1/2 z-10">
                <div 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${task.completed ? 'bg-gray-300' : (task.category ? categoryColor : 'bg-gray-400')}`}
                    style={{boxShadow: '0 0 0 4px #F9FAFB'}} /* bg-gray-50 */
                ></div>
            </div>
            <div className="ml-8 flex items-center p-4 bg-white rounded-2xl shadow-sm transition-transform duration-300 hover:shadow-md hover:bg-white/80 will-change-transform hover:-translate-y-1">
                <button onClick={() => onToggle(task.id)} className="flex items-center w-full text-left">
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'}`}>
                        {task.completed && <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <div className="flex-grow ml-4">
                         <span className={`truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.text}
                        </span>
                        {(task.category || task.time) && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                                {task.category && (
                                    <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-semibold ${categoryColor}`}>
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
        </div>
    );
});


const TasksScreen: React.FC<TasksScreenProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, setActiveScreen }) => {
    const toLocalYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [newCategory, setNewCategory] = useState<'Personal' | 'Work' | 'Fitness'>();
    const [selectedDate, setSelectedDate] = useState<string>(toLocalYYYYMMDD(new Date()));

    // Time picker state
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('30');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    
    const inputRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const periodRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<number | null>(null);

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
    const periods: ('AM'|'PM')[] = ['AM', 'PM'];
    const ITEM_HEIGHT = 40; // Corresponds to h-10

    useEffect(() => {
        if (isModalOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                // Set initial scroll positions for time picker
                if(hourRef.current) hourRef.current.scrollTop = hours.indexOf(hour) * ITEM_HEIGHT;
                if(minuteRef.current) minuteRef.current.scrollTop = minutes.indexOf(minute) * ITEM_HEIGHT;
                if(periodRef.current) periodRef.current.scrollTop = periods.indexOf(period) * ITEM_HEIGHT;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);
    
    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedTime = `${hour}:${minute} ${period}`;
        onAddTask({ text: newTaskText, category: newCategory, time: formattedTime, date: selectedDate });
        setNewTaskText('');
        setNewCategory(undefined);
        setHour('08');
        setMinute('30');
        setPeriod('AM');
        setIsModalOpen(false);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'hour' | 'minute' | 'period') => {
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = window.setTimeout(() => {
            const target = e.target as HTMLDivElement;
            const index = Math.round(target.scrollTop / ITEM_HEIGHT);
            
            if (type === 'hour') setHour(hours[index]);
            if (type === 'minute') setMinute(minutes[index]);
            if (type === 'period') setPeriod(periods[index]);
        }, 150);
    };

    const tasksForSelectedDay = tasks.filter(task => task.date === selectedDate);
    const activeTasks = tasksForSelectedDay.filter(task => !task.completed);
    const completedTasks = tasksForSelectedDay.filter(task => task.completed);
    const categories: ('Personal' | 'Work' | 'Fitness')[] = ['Personal', 'Work', 'Fitness'];


    const pageTitle = (
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">My Tasks</h1>
    );

    const today = new Date();
    const todayStr = toLocalYYYYMMDD(today);
    const weekDays = [];
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Adjust to get Monday as the first day of the week
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + diff);

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayStr = toLocalYYYYMMDD(day);

        weekDays.push({
            date: dayStr,
            name: day.toLocaleDateString('en-US', { weekday: 'short' }),
            number: day.getDate(),
            isToday: dayStr === todayStr,
        });
    }
    
    return (
        <div className="p-6">
            <Header title={pageTitle} onAvatarClick={() => setActiveScreen('settings')} className="mb-4" />
            
            <div className="mb-6 -mx-6 px-6">
                 <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
                    {weekDays.map(({ date, name, number, isToday }) => {
                        const isSelected = date === selectedDate;
                        return (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`relative flex-shrink-0 w-14 h-20 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 transform will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 ${
                                isSelected
                                    ? 'bg-teal-500 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:-translate-y-1'
                            }`}
                        >
                            <span className={`text-sm font-semibold ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>{name}</span>
                            <span className="text-2xl font-bold mt-1">{number}</span>
                            {isToday && !isSelected && <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>}
                        </button>
                    )}
                    )}
                </div>
            </div>

            <div className="pr-2 -mr-2">
                {tasks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📝</div>
                        <p className="text-lg font-semibold text-gray-600">No tasks yet</p>
                        <p className="text-gray-500">Tap the <span className="font-bold text-teal-600">+</span> button to add your first task!</p>
                    </div>
                ) : tasksForSelectedDay.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🎉</div>
                        <p className="text-lg font-semibold text-gray-600">All clear for this day!</p>
                        <p className="text-gray-500">Add a new task or enjoy your break.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {activeTasks.length > 0 && <div className="absolute top-7 bottom-7 left-3 w-0.5 bg-gray-200 rounded-full" />}
                        {activeTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />)}
                        
                        {completedTasks.length > 0 && (
                            <div className="mt-8 relative">
                                <h2 className="text-gray-500 font-bold mb-4 ml-8">Completed</h2>
                                <div className="absolute top-7 bottom-7 left-3 w-0.5 bg-gray-200 rounded-full" />
                                {completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask}/>)}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* FAB to open modal */}
            <div className="fixed bottom-28 right-6 z-20">
                <button onClick={() => setIsModalOpen(true)} className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg font-semibold hover:bg-teal-600 transition-transform duration-300 transform hover:scale-110 shadow-lg shadow-teal-500/50 will-change-transform">
                    <PlusIcon className="w-8 h-8" />
                </button>
            </div>
            
            {/* --- Add Task Modal with Small Circular Reveal --- */}

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleCloseModal}
            />
            
            {/* Modal positioned above the FAB */}
            <div
                className={`fixed bottom-[12rem] right-6 z-40 w-[calc(100%-3rem)] max-w-sm ${!isModalOpen && 'pointer-events-none'}`}
            >
                <div 
                    className="w-full transition-[clip-path] duration-500 ease-in-out"
                    style={{ 
                        clipPath: isModalOpen 
                            ? 'circle(150% at 95% 120%)' 
                            : 'circle(0px at 95% 120%)'
                    }}
                >
                    <div 
                        className="relative w-full p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-200/50 rounded-full text-gray-600 hover:bg-gray-300/70 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            aria-label="Close new task panel"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
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
                                <div className="h-32 bg-white/50 rounded-xl flex items-center justify-between text-xl font-semibold text-gray-800 p-2 relative">
                                    <div className="absolute inset-x-2 h-10 top-1/2 -translate-y-1/2 bg-teal-500/10 rounded-lg z-0 border-y-2 border-teal-500/20"></div>
                                    
                                    {/* Hour Scroller */}
                                    <div ref={hourRef} onScroll={(e) => handleScroll(e, 'hour')} className="w-1/3 h-full overflow-y-scroll scroll-snap-type-y-mandatory scrollbar-hide text-center relative z-10">
                                        <div className="h-[40px] flex-shrink-0"></div> {/* Top padding */}
                                        {hours.map(h => <div key={h} className="h-10 flex items-center justify-center scroll-snap-align-center text-gray-400 data-[active=true]:text-gray-900 data-[active=true]:font-bold" data-active={h === hour}>{h}</div>)}
                                        <div className="h-[40px] flex-shrink-0"></div> {/* Bottom padding */}
                                    </div>
                                    
                                    <span className="font-extrabold text-2xl -translate-y-px">:</span>

                                    {/* Minute Scroller */}
                                    <div ref={minuteRef} onScroll={(e) => handleScroll(e, 'minute')} className="w-1/3 h-full overflow-y-scroll scroll-snap-type-y-mandatory scrollbar-hide text-center relative z-10">
                                        <div className="h-[40px] flex-shrink-0"></div>
                                        {minutes.map(m => <div key={m} className="h-10 flex items-center justify-center scroll-snap-align-center text-gray-400 data-[active=true]:text-gray-900 data-[active=true]:font-bold" data-active={m === minute}>{m}</div>)}
                                        <div className="h-[40px] flex-shrink-0"></div>
                                    </div>
                                    
                                    {/* AM/PM Scroller */}
                                    <div ref={periodRef} onScroll={(e) => handleScroll(e, 'period')} className="w-1/3 h-full overflow-y-scroll scroll-snap-type-y-mandatory scrollbar-hide text-center relative z-10">
                                        <div className="h-[40px] flex-shrink-0"></div>
                                        {periods.map(p => <div key={p} className="h-10 flex items-center justify-center scroll-snap-align-center text-gray-400 data-[active=true]:text-gray-900 data-[active=true]:font-bold" data-active={p === period}>{p}</div>)}
                                        <div className="h-[40px] flex-shrink-0"></div>
                                    </div>
                                </div>
                            </div>
                            
                             <button type="submit" className="w-full h-14 mt-6 bg-teal-500 text-white rounded-xl text-lg font-semibold hover:bg-teal-600 transition-colors">
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksScreen;
