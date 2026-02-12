import { AppLayout } from './components/Layout/AppLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { KanbanBoard } from './components/Board/KanbanBoard'
import React from 'react'; // Added React import for useState

function Dashboard() {
    const { role, logout } = useAuth();
    const [status, setStatus] = React.useState("Active");
    const [orgId, setOrgId] = React.useState("1");

    const switchOrg = () => {
        const newId = orgId === "1" ? "2" : "1";
        setOrgId(newId);
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Welcome Back, <span className="text-blue-600">{role}</span>
                    </h1>
                    <div className="flex gap-4 items-center">
                        {/* Org Switcher Simulation */}
                        <button
                            onClick={switchOrg}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50"
                        >
                            <span className="font-semibold text-slate-700">Org {orgId}</span>
                            <span className="text-xs text-slate-400">(Switch)</span>
                        </button>

                        <span className="text-xs text-slate-400 uppercase font-bold">Demo Mode</span>
                        <button onClick={logout} className="text-sm text-red-600 hover:underline">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Toolbar for Admin/Editor Actions */}
                {(role === 'Admin' || role === 'Editor') && (
                    <div className="flex justify-end gap-2 mb-4">
                        {role === 'Admin' && (
                            <>
                                <button className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded shadow-sm hover:bg-slate-700">Manage Users</button>
                                <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded shadow-sm hover:bg-red-50">Delete Project</button>
                            </>
                        )}
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700">Create Project</button>
                    </div>
                )}

                {/* Replaced Metrics Grid with Kanban Board */}
                <div className="flex-1 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden mb-6">
                    <KanbanBoard orgId={orgId} role={role} />
                </div>

            </div>
        </AppLayout>
    )
}

function App() {
    return (
        <AuthProvider>
            <MainContent />
        </AuthProvider>
    )
}

function MainContent() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Login />;
}

export default App
