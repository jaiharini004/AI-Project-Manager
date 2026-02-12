import React, { useState } from 'react';
import { Reply } from 'lucide-react';

interface Comment {
    id: number;
    content: string;
    user_id: number;
    parent_id: number | null;
    replies?: Comment[];
    created_at: string;
}

interface CommentThreadProps {
    comments: Comment[];
    onReply: (parentId: number, content: string) => void;
}

const CommentItem = ({ comment, onReply, depth = 0 }: { comment: Comment, onReply: any, depth?: number }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSubmit = () => {
        onReply(comment.id, replyContent);
        setIsReplying(false);
        setReplyContent('');
    };

    return (
        <div className={`mb-3 ${depth > 0 ? 'ml-6 pl-3 border-l-2 border-slate-200' : ''}`}>
            <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    U{comment.user_id}
                </div>
                <div className="flex-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-slate-700">User {comment.user_id}</span>
                            <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-sm text-slate-800">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 font-medium"
                        >
                            <Reply size={12} /> Reply
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="flex-1 text-xs border border-slate-300 rounded px-2 py-1"
                                placeholder="Write a reply..."
                            />
                            <button
                                onClick={handleSubmit}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Recursive Rendering of Replies (Filtered from main list usually, but simplified here) */}
            {comment.replies && comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
            ))}
        </div>
    )
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comments, onReply }) => {
    // Basic structural helper: turn flat list to tree if needed. 
    // For now assuming comments passed are top-level or flattened rendering logic.
    // Let's implement a simple Flat-to-Tree for the demo
    const buildTree = (list: Comment[]) => {
        const map: any = {};
        const roots: Comment[] = [];
        list.forEach((c, i) => {
            map[c.id] = i;
            c.replies = []; // init
        });
        list.forEach(c => {
            if (c.parent_id !== null && map[c.parent_id] !== undefined) {
                list[map[c.parent_id]].replies?.push(c);
            } else {
                roots.push(c);
            }
        });
        return roots;
    };

    const tree = buildTree([...comments]); // Copy to avoid mutation issues

    return (
        <div className="space-y-4">
            {tree.map(c => (
                <CommentItem key={c.id} comment={c} onReply={onReply} />
            ))}
        </div>
    );
};
