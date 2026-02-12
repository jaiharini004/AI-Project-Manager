import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { MoreHorizontal, Paperclip, MessageSquare, Trash2, Edit2 } from 'lucide-react';

interface Task {
    id: string;
    display_id?: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface TaskCardProps {
    task: Task;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Owner';
    onClick: (task: Task) => void;
    onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, role, onClick, onDelete }) => {
    // ... (rest of component hooks)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { ...task } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (role === 'Owner') {
            onDelete();
        } else {
            // Toast feedback simulated via alert for simplicity
            alert("Access Denied: Admins/Editors cannot delete tasks. Contact Owner.");
        }
    };

    return (
        <div
            // ... existing div props
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(task)}
            className={clsx(
                "group bg-white p-3 border border-slate-300 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-md transition-all relative overflow-hidden flex flex-col gap-2",
                // Rectangular (default height content driven), square corners
                "rounded-none w-full",
                isDragging ? "opacity-50 ring-2 ring-blue-500 z-50 rotate-2" : "opacity-100"
            )}
        >
            {/* ... Priority and Title Content ... */}
            <div className={clsx(
                "absolute left-0 top-0 bottom-0 w-1.5",
                task.priority === 'High' ? "bg-red-600" : task.priority === 'Medium' ? "bg-orange-500" : "bg-blue-500"
            )} />

            <div className="pl-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-400">#{task.display_id || task.id}</span>

                    {/* RBAC Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(role === 'Admin' || role === 'Editor' || role === 'Owner') && (
                            <button
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                                onClick={(e) => { e.stopPropagation(); alert('Edit Task logic here'); }}
                                title="Edit Task"
                            >
                                <Edit2 size={12} />
                            </button>
                        )}
                        {/* Visible to Admin too, but shows Access Denied on click */}
                        {(role === 'Owner' || role === 'Admin') && (
                            <button
                                className={clsx(
                                    "p-1 rounded",
                                    role === 'Owner' ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-300 hover:text-slate-500 cursor-not-allowed"
                                )}
                                onClick={handleDeleteClick}
                                title={role === 'Owner' ? "Delete Task" : "Delete Disabled (Owner Only)"}
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-sm font-semibold text-slate-800 line-clamp-3 leading-relaxed">
                    {task.title}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex gap-3 text-slate-400">
                        <Paperclip size={14} />
                        <MessageSquare size={14} />
                    </div>
                    <div className="w-7 h-7 bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-300">
                        JD
                    </div>
                </div>
            </div>
        </div>
    );
};
