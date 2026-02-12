import React, { useState } from 'react';
import {
    LayoutDashboard,
    Settings,
    Users,
    FolderKanban,
    ChevronDown,
    Bell,
    Search,
    Menu
} from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={clsx(
        "flex items-center gap-3 px-4 py-2 my-1 text-sm font-medium rounded-md cursor-pointer transition-colors",
        active
            ? "bg-slate-800 text-white"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    )}>
        <Icon size={18} />
        <span>{label}</span>
    </div>
);

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            {/* Sidebar - Azure Style (Dark Slate) */}
            <aside className={clsx(
                "bg-slate-900 border-r border-slate-700 flex-shrink-0 transition-all duration-300 flex flex-col",
                sidebarOpen ? "w-64" : "w-16"
            )}>
                <div className="h-14 flex items-center px-4 border-b border-slate-700">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">A</div>
                        {sidebarOpen && <span>AI Project Manager</span>}
                    </div>
                </div>

                <div className="flex-1 py-4 px-2 overflow-y-auto">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={FolderKanban} label="Projects" />
                    <SidebarItem icon={Users} label="Team" />
                    <div className="my-4 border-t border-slate-700"></div>
                    <SidebarItem icon={Settings} label="Settings" />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded">
                            <Menu size={20} />
                        </button>
                        {/* Organization Switcher */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                            <span className="text-sm font-semibold text-slate-700">Demo Corp</span>
                            <ChevronDown size={14} className="text-slate-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
