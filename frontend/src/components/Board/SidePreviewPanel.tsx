import React, { useState } from 'react';
import { X, Calendar, User, Tag, Paperclip, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { CommentThread } from './CommentThread';

interface SidePreviewPanelProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // In real app, Task interface
}

export const SidePreviewPanel: React.FC<SidePreviewPanelProps> = ({ isOpen, onClose, task }) => {
    const [activeTab, setActiveTab] = useState('details');

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Slide-over Panel */}
            <div className={clsx(
                "fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-slate-500">#{task?.id || '000'}</span>
                        <span className={clsx(
                            "px-2 py-0.5 text-xs font-semibold rounded-full border",
                            task?.status === 'Done' ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"
                        )}>
                            {task?.status || 'Active'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* content */}
                {task && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">
                            <input
                                type="text"
                                defaultValue={task.title}
                                className="text-2xl font-semibold text-slate-800 w-full bg-transparent border-none focus:ring-0 p-0 mb-6 placeholder-slate-400"
                            />

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Assignee</label>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 p-1.5 -ml-1.5 rounded cursor-pointer">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">JD</div>
                                        <span>Jane Doe</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Priority</label>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 p-1.5 -ml-1.5 rounded cursor-pointer">
                                        <span className={clsx(
                                            "w-2 h-2 rounded-full",
                                            task.priority === 'High' ? "bg-red-500" : task.priority === 'Medium' ? "bg-orange-500" : "bg-blue-400"
                                        )} />
                                        <span>{task.priority || 'Medium'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Description</label>
                                <textarea
                                    className="w-full min-h-[120px] p-3 border border-slate-200 rounded text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    placeholder="Add a detailed description..."
                                    defaultValue="Refactor the main dashboard component to improve rendering performance by memoizing child components."
                                />
                            </div>

                            {/* Tabs area for Comments / History */}
                            <div className="border-t border-slate-200 pt-6">
                                <div className="flex gap-6 mb-6">
                                    <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Discussion</button>
                                    <button className="text-sm font-medium text-slate-500 hover:text-slate-800">History</button>
                                    <button className="text-sm font-medium text-slate-500 hover:text-slate-800">Links</button>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 -mx-4 h-64 overflow-y-auto mb-4">
                                    {/* DEMO COMMENTS */}
                                    <CommentThread
                                        comments={[
                                            { id: 1, content: "We need to double check the requirements.", user_id: 101, parent_id: null, created_at: "", replies: [] },
                                            { id: 2, content: "Agreed, I will check with PM.", user_id: 102, parent_id: 1, created_at: "", replies: [] },
                                        ]}
                                        onReply={(pid, content) => console.log('Reply:', pid, content)}
                                    />
                                </div>

                                <div className="flex gap-3 items-end">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                                    <div className="flex-1 relative">
                                        <textarea
                                            className="w-full p-2 pr-10 border border-slate-200 rounded text-sm mb-1 focus:outline-none focus:border-blue-500"
                                            placeholder="Add a comment..."
                                            rows={2}
                                        />
                                        <div className="absolute right-2 bottom-4 flex gap-1">
                                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600">
                                                <Paperclip size={16} />
                                            </button>
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded float-right">Comment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
