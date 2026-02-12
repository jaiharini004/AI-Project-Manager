import React, { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { SidePreviewPanel } from './SidePreviewPanel';
import { TaskInputBar } from './TaskInputBar';


// Mock Data
const INITIAL_TASKS = [
    { id: '101', title: 'Research Azure UI Pattern', priority: 'High', status: 'todo' },
    { id: '102', title: 'Setup FastAPI + SQLAlchemy', priority: 'High', status: 'done' },
    { id: '103', title: 'Implement RBAC Middleware', priority: 'Medium', status: 'in-progress' },
    { id: '104', title: 'Draft Prompt Engineering Guide', priority: 'Low', status: 'todo' },
    { id: '105', title: 'Fix WebSocket Connection Bug', priority: 'High', status: 'in-progress' },
];

import { Toast } from '../UI/Toast';

interface KanbanBoardProps {
    orgId: string;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Owner';
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ orgId, role }) => {
    const [tasks, setTasks] = useState<any[]>(INITIAL_TASKS);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleNewTasks = (newTasks: any[]) => {
        // Avoid duplicates if we broadcast + local update
        setTasks(prev => {
            const ids = new Set(prev.map(t => t.id));
            const uniqueNew = newTasks.filter(t => !ids.has(t.id));
            return [...prev, ...uniqueNew];
        });
    };

    // WebSocket Listener & Initial Fetch
    React.useEffect(() => {
        let ws: WebSocket;
        let reconnectTimer: any;

        // Fetch Tasks for the new Org
        const fetchTasks = async () => {
            // Strictly Clear Current Tasks First to prevent Leakage
            setTasks([]);

            try {
                // In a real app, you would pass orgId as a query param or header if the token doesn't cover it
                // For this demo, we assume the backend filters efficiently or we use a query param
                // const response = await fetch(`http://localhost:8000/api/v1/tasks?org_id=${orgId} ...`);

                // MOCKING FETCH for Demo Switch
                // We simulate distinct data for Org 2 vs Org 1
                if (orgId === '2') {
                    setTasks([
                        { id: '201', title: 'Org 2: Define Roadmap', priority: 'High', status: 'todo' },
                        { id: '202', title: 'Org 2: Hire Developers', priority: 'High', status: 'in-progress' },
                    ]);
                } else {
                    // Reset to initial or fetch from backend
                    // Real Fetch:
                    // const res = await fetch('http://localhost:8000/api/v1/tasks', { headers: { Authorization: `Bearer ${token}` } });
                    // const data = await res.json();
                    // setTasks(data);
                    setTasks(INITIAL_TASKS);
                }
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            }
        };

        fetchTasks();

        const connect = () => {
            console.log(`Connecting to Org ${orgId}...`);
            ws = new WebSocket(`ws://localhost:8000/api/v1/ws/${orgId}`);

            ws.onopen = () => {
                console.log("Connected to Real-time Sync");
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'TASKS_GENERATED') {
                        handleNewTasks(message.payload);
                    } else if (message.type === 'TASK_DELETED') {
                        // Handle remote deletion
                        setTasks(prev => prev.filter(t => t.id !== message.payload.id));
                    }
                } catch (e) {
                    console.error("WS Parse Error", e);
                }
            };

            ws.onclose = () => {
                console.log("Disconnected. Reconnecting...");
                reconnectTimer = setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            if (ws) ws.close();
            if (reconnectTimer) clearTimeout(reconnectTimer);
        };
    }, [orgId]); // Re-run when orgId changes

    // Disable dragging for Viewers
    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    });
    const keyboardSensor = useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    });

    const sensors = useSensors(pointerSensor, keyboardSensor);

    const columns = ['todo', 'in-progress', 'done'];

    // --- Handlers ---

    const handleDelete = async (taskId: string) => {
        // Optimistic UI Update
        setTasks(prev => prev.filter(t => t.id !== taskId));

        try {
            // Actual API Call (Mocked for now or Real)
            // await api.delete(`/tasks/${taskId}`);
            await fetch(`http://localhost:8000/api/v1/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer mock_token_owner' // In real app use context token
                }
            });
        } catch (err) {
            console.error("Delete failed", err);
            // Revert if failed (omitted for brevity)
            setError("Failed to delete task.");
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (role === 'Viewer') {
            setError("Viewers cannot move tasks.");
            return;
        }
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.sortable;
        const isOverTask = over.data.current?.sortable;

        if (!isActiveTask) return;

        // Dragging over another task
        if (isActiveTask && isOverTask) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);

                // If in different containers, update status
                if (prev[activeIndex].status !== prev[overIndex].status) {
                    prev[activeIndex].status = prev[overIndex].status;
                    return arrayMove(prev, activeIndex, overIndex - 1); // Insert logic simplified
                }

                return arrayMove(prev, activeIndex, overIndex);
            });
        }

        // Dragging over a column
        const isOverColumn = columns.includes(overId as string);
        if (isActiveTask && isOverColumn) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                if (prev[activeIndex].status !== overId) {
                    // Update status to new column
                    const newTasks = [...prev];
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: overId as string };
                    return arrayMove(newTasks, activeIndex, activeIndex); // Should ideally move to end or index
                }
                return prev;
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        // Final state cleanup if needed
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    // --- Derived State ---
    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="h-full flex flex-col bg-white">
            {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

            {/* Control Bar / Inputs */}
            <div className="px-6 pt-6 pb-2">
                <TaskInputBar onTasksGenerated={handleNewTasks} role={role} />
            </div>

            {/* Board Container - Fixed Height per requirement (prevent stretch to bottom) */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 max-h-[600px] border-t border-slate-200">
                <DndContext
                    sensors={role === 'Viewer' ? [] : sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full gap-6 p-6 min-w-max">
                        <Column
                            id="to-do"
                            title="To Do"
                            tasks={tasks.filter(t => t.status === 'todo')}
                            role={role}
                            onTaskClick={setSelectedTask}
                            onDeleteTask={handleDelete}
                        />
                        <Column
                            id="in-progress"
                            title="In Progress"
                            tasks={tasks.filter(t => t.status === 'in-progress')}
                            role={role}
                            onTaskClick={setSelectedTask}
                            onDeleteTask={handleDelete}
                        />
                        <Column
                            id="done"
                            title="Done"
                            tasks={tasks.filter(t => t.status === 'done')}
                            role={role}
                            onTaskClick={setSelectedTask}
                            onDeleteTask={handleDelete}
                        />
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeTask ? (
                            <div className="opacity-90 rotate-1 shadow-2xl">
                                <TaskCard
                                    task={activeTask}
                                    role={role}
                                    onClick={() => { }}
                                    onDelete={() => { }} // No delete during drag
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <SidePreviewPanel
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        </div>
    );
};
