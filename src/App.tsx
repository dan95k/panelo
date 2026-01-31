import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { HomePage } from './components/HomePage';
import type { Dashboard as DashboardType } from './types';
import { storageService } from './services/storage';

function App() {
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamingDashboardId, setRenamingDashboardId] = useState<string | null>(null);
  const [renameDashboardValue, setRenameDashboardValue] = useState('');
  const [draggedDashboardId, setDraggedDashboardId] = useState<string | null>(null);
  const [dragOverDashboardId, setDragOverDashboardId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDashboardId, setDeletingDashboardId] = useState<string | null>(null);

  // Load dashboards on mount
  useEffect(() => {
    storageService.getDashboards().then(loadedDashboards => {
      if (loadedDashboards.length === 0) {
        const defaultDashboard: DashboardType = {
          id: 'default',
          name: 'My Dashboard',
          boxes: []
        };
        setDashboards([defaultDashboard]);
      } else {
        setDashboards(loadedDashboards);
      }
      // Don't set active dashboard - stay on home page
    });
  }, []);

  // Save dashboards whenever they change
  useEffect(() => {
    if (dashboards.length > 0) {
      storageService.saveDashboards(dashboards);
    }
  }, [dashboards]);

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      const newDashboard: DashboardType = {
        id: crypto.randomUUID(),
        name: newDashboardName.trim(),
        boxes: []
      };
      setDashboards(prev => [...prev, newDashboard]);
      setActiveDashboardId(newDashboard.id);
      setShowCreateModal(false);
      setNewDashboardName('');
    }
  };

  const handleDeleteDashboard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingDashboardId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteDashboard = () => {
    if (!deletingDashboardId) return;

    // If it's the last dashboard, replace it with a new empty one
    if (dashboards.length <= 1) {
      const newDashboard: DashboardType = {
        id: crypto.randomUUID(),
        name: 'New Dashboard',
        boxes: []
      };
      setDashboards([newDashboard]);
      setActiveDashboardId(null); // Go back to home
    } else {
      setDashboards(prev => prev.filter(d => d.id !== deletingDashboardId));
      if (activeDashboardId === deletingDashboardId) {
        setActiveDashboardId(null); // Go back to home
      }
    }

    setShowDeleteModal(false);
    setDeletingDashboardId(null);
  };

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingDashboardId(id);
    setRenameDashboardValue(currentName);
    setShowRenameModal(true);
  };

  const handleRenameDashboard = () => {
    if (renameDashboardValue.trim() && renamingDashboardId) {
      setDashboards(prev => prev.map(d =>
        d.id === renamingDashboardId
          ? { ...d, name: renameDashboardValue.trim() }
          : d
      ));
      setShowRenameModal(false);
      setRenamingDashboardId(null);
      setRenameDashboardValue('');
    }
  };

  const handleSelectDashboard = (id: string) => {
    setActiveDashboardId(id);
  };

  const handleGoHome = () => {
    setActiveDashboardId(null);
  };

  const handleDragStart = (dashboardId: string) => {
    setDraggedDashboardId(dashboardId);
  };

  const handleDragOver = (e: React.DragEvent, targetDashboardId: string) => {
    e.preventDefault(); // Allow drop
    if (draggedDashboardId && draggedDashboardId !== targetDashboardId) {
      setDragOverDashboardId(targetDashboardId);
    }
  };

  const handleDrop = (targetDashboardId: string) => {
    if (!draggedDashboardId || draggedDashboardId === targetDashboardId) {
      setDraggedDashboardId(null);
      setDragOverDashboardId(null);
      return;
    }

    const draggedIndex = dashboards.findIndex(d => d.id === draggedDashboardId);
    const targetIndex = dashboards.findIndex(d => d.id === targetDashboardId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedDashboardId(null);
      setDragOverDashboardId(null);
      return;
    }

    // Reorder the dashboards
    const newDashboards = [...dashboards];
    const [removed] = newDashboards.splice(draggedIndex, 1);
    newDashboards.splice(targetIndex, 0, removed);

    setDashboards(newDashboards);
    setDraggedDashboardId(null);
    setDragOverDashboardId(null);
  };

  const handleDragEnd = () => {
    setDraggedDashboardId(null);
    setDragOverDashboardId(null);
  };

  return (
    <div className="h-screen w-screen bg-gray-950 text-white overflow-hidden relative flex">
      {/* Create Dashboard Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1b26] border border-white/10 rounded-xl shadow-2xl p-6 transform transition-all scale-100">
            <h2 className="text-xl font-bold text-white mb-2">Create New Dashboard</h2>
            <p className="text-gray-400 text-sm mb-6">Give your new workspace a name to get started.</p>

            <input
              type="text"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              placeholder="e.g., Work, Personal, Research..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateDashboard()}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDashboard}
                disabled={!newDashboardName.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dashboard Modal */}
      {showRenameModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1b26] border border-white/10 rounded-xl shadow-2xl p-6 transform transition-all scale-100">
            <h2 className="text-xl font-bold text-white mb-2">Rename Dashboard</h2>
            <p className="text-gray-400 text-sm mb-6">Give your dashboard a new name.</p>

            <input
              type="text"
              value={renameDashboardValue}
              onChange={(e) => setRenameDashboardValue(e.target.value)}
              placeholder="Dashboard name..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRenameDashboard()}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenamingDashboardId(null);
                  setRenameDashboardValue('');
                }}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameDashboard}
                disabled={!renameDashboardValue.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1b26] border border-red-500/20 rounded-xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Delete Dashboard?</h2>
                <p className="text-gray-400 text-sm">
                  {dashboards.length <= 1
                    ? "This will delete your dashboard and create a new empty one."
                    : `Are you sure you want to delete "${dashboards.find(d => d.id === deletingDashboardId)?.name}"? This action cannot be undone.`
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingDashboardId(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDashboard}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm shadow-lg shadow-red-500/20 transition-all"
              >
                Delete Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Always Visible */}
      <div className="w-20 hover:w-64 group/sidebar h-full glass-panel border-r border-white/5 flex flex-col z-50 bg-black/20 backdrop-blur-xl transition-[width] duration-300 ease-in-out overflow-hidden">
        <div className="p-4 flex flex-col h-full">
          {/* Logo/Header - Clickable to go home */}
          <div
            className="flex items-center gap-4 mb-8 px-1 cursor-pointer"
            onClick={handleGoHome}
            title="Go to Home"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-indigo-200 bg-clip-text text-transparent tracking-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">
              Panelo
            </h1>
          </div>

          {/* Dashboards List */}
          <div className="space-y-2">
            {dashboards.map((dashboard, index) => {
              const isDragging = draggedDashboardId === dashboard.id;
              const isDropTarget = dragOverDashboardId === dashboard.id;
              const draggedIndex = dashboards.findIndex(d => d.id === draggedDashboardId);
              const shouldShowSpaceBefore = !isDragging && isDropTarget && draggedIndex > index;
              const shouldShowSpaceAfter = !isDragging && isDropTarget && draggedIndex < index;

              return (
                <div key={dashboard.id} className="relative">
                  {/* Drop indicator line - BEFORE */}
                  {shouldShowSpaceBefore && (
                    <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 z-10 animate-pulse"></div>
                  )}

                  <div
                    draggable
                    onDragStart={() => handleDragStart(dashboard.id)}
                    onDragOver={(e) => handleDragOver(e, dashboard.id)}
                    onDrop={() => handleDrop(dashboard.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleSelectDashboard(dashboard.id)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${activeDashboardId === dashboard.id
                      ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      } ${isDragging
                        ? 'opacity-40'
                        : ''
                      } ${shouldShowSpaceBefore || shouldShowSpaceAfter
                        ? shouldShowSpaceBefore ? 'mt-8' : 'mb-8'
                        : ''
                      }`}
                    title={dashboard.name}
                  >
                    <div className="shrink-0 flex items-center justify-center w-6 h-6">
                      <svg className={`w-5 h-5 transition-colors ${activeDashboardId === dashboard.id ? 'text-blue-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>

                    {/* Drag Handle - appears on hover */}
                    <div className="shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity text-gray-600 hover:text-gray-400 cursor-move" title="Drag to reorder">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>

                    <span className="font-medium truncate text-sm whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">{dashboard.name}</span>

                    <div className="ml-auto flex items-center gap-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(dashboard.id, dashboard.name, e)}
                        className="p-1 hover:text-blue-400 transition-colors"
                        title="Rename Dashboard"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteDashboard(dashboard.id, e)}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete Dashboard"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Drop indicator line - AFTER */}
                  {shouldShowSpaceAfter && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 z-10 animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Create New Dashboard Button */}
          <div className="mt-4 px-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center gap-3 py-2 rounded-lg text-gray-400 hover:text-blue-300 hover:bg-blue-500/5 transition-all text-sm font-medium overflow-hidden"
              title="Create New Dashboard"
            >
              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">New Dashboard</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-auto p-4 border-t border-white/5 overflow-hidden">
          <div className="text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-center">
            {activeDashboardId
              ? `${dashboards.find(d => d.id === activeDashboardId)?.boxes.length || 0} Window${dashboards.find(d => d.id === activeDashboardId)?.boxes.length !== 1 ? 's' : ''}`
              : 'Home'
            }
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden">
        {activeDashboardId ? (
          <Dashboard
            dashboards={dashboards}
            setDashboards={setDashboards}
            activeDashboardId={activeDashboardId}
          />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  );
}

export default App;
