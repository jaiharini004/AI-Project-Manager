import React, { useState } from 'react';
import { Sparkles, Plus, Loader2, Play } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskInputBarProps {
    onTasksGenerated: (newTasks: any[]) => void;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Owner';
}

export const TaskInputBar: React.FC<TaskInputBarProps> = ({ onTasksGenerated, role }) => {
    const [manualInput, setManualInput] = useState('');
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualInput.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            title: manualInput,
            status: 'todo',
            priority: 'Medium'
        };
        onTasksGenerated([newTask]);
        setManualInput('');
    };

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        setIsAiLoading(true);
        try {
            // Mock AI Call
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockGenerated = [
                { id: Date.now() + '1', title: `Research: ${aiInput}`, priority: 'High', status: 'todo' },
                { id: Date.now() + '2', title: `Draft Specs for ${aiInput}`, priority: 'Medium', status: 'todo' },
                { id: Date.now() + '3', title: `Design Mockups for ${aiInput}`, priority: 'Medium', status: 'todo' },
                { id: Date.now() + '4', title: `Implement Core Logic for ${aiInput}`, priority: 'High', status: 'todo' },
                { id: Date.now() + '5', title: `Test & Deploy ${aiInput}`, priority: 'Low', status: 'todo' },
            ];
            onTasksGenerated(mockGenerated);
            setAiInput('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (role === 'Viewer') {
        return null; // Viewers see nothing here
    }

    return (
        <div className="flex gap-4 mb-4 h-32">
            {/* Box 1: Manual Entry (Compact Rectangle) */}
            <div className="flex-1 bg-white border border-[#d2d0ce] p-3 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
                <div>
                    <h3 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                        <Plus size={14} /> Manual Task
                    </h3>
                    <textarea
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="Type task details..."
                        className="w-full h-16 text-xs bg-transparent border-none resize-none focus:outline-none placeholder:text-slate-400 leading-tight"
                    />
                </div>
                <button
                    onClick={handleManualSubmit}
                    className="self-start px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-300"
                >
                    Add Task
                </button>
            </div>

            {/* Box 2: AI Generator (Compact Rectangle) */}
            <div className="flex-1 bg-gradient-to-br from-white to-purple-50/50 border border-[#d2d0ce] p-3 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
                <div>
                    <h3 className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-2">
                        <Sparkles size={14} /> AI Generator
                    </h3>
                    <textarea
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        disabled={isAiLoading}
                        placeholder="Describe goal (e.g. 'Launch Campaign')..."
                        className="w-full h-16 text-xs bg-transparent border-none resize-none focus:outline-none placeholder:text-purple-300/70 leading-tight"
                    />
                </div>
                <div className="flex justify-between items-end">
                    <button
                        onClick={handleAiSubmit}
                        disabled={isAiLoading}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-wider border border-purple-800 flex items-center gap-2 transition-transform active:scale-95"
                    >
                        {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};
