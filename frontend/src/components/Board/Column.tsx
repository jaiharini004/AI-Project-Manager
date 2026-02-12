import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { clsx } from 'clsx';
import { MoreHorizontal, Plus } from 'lucide-react';

interface ColumnProps {
    id: string;
    title: string;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Owner';
    onTaskClick: (task: any) => void;
    onDeleteTask: (taskId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, title, tasks, role, onTaskClick, onDeleteTask }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full min-w-[300px] w-80">
            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-700">{title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">{tasks.length}</span>
                </div>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={16} /></button>
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><MoreHorizontal size={16} /></button>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                ref={setNodeRef}
                className={clsx(
                    "flex-1 bg-slate-100/50 rounded-lg p-2 border border-slate-200/60 overflow-y-auto space-y-2",
                    // "hover:bg-slate-100 transition-colors"
                )}
            >
                <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            role={role}
                            onClick={onTaskClick}
                            onDelete={() => onDeleteTask(task.id)}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
};
