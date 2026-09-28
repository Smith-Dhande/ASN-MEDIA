import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminModal } from '../components/ui/AdminModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Kanban,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  AlertCircle,
  Plus,
  FolderKanban,
  FileText,
  Paperclip,
  Activity,
  Edit2,
  Trash2,
  CheckSquare,
  MessageSquare,
  Calendar,
  User,
  Building,
  UploadCloud,
  Check,
} from 'lucide-react';

export const ProjectsTasksModule = () => {
  const {
    projects,
    tasks,
    staff,
    clients,
    services,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  } = useAdminData();

  const location = useLocation();

  const isTasksMode = location.pathname.endsWith('/tasks');
  const isWorkloadMode = location.pathname.endsWith('/workload');

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  // Selected item states for drawers
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [projectDrawerTab, setProjectDrawerTab] = useState('Overview'); // Overview | Tasks | Milestones | Files | Activity

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  // Modals & Confirm Dialogs
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, type: '', id: '', title: '' });

  // Toast feedback
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  // Forms
  const [projectForm, setProjectForm] = useState({
    title: '',
    clientName: clients[0]?.name || 'Aura Luxury Beauty',
    serviceName: services[0]?.name || 'Social Media Management',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-11-30',
    priority: 'Medium',
    leadStaff: staff[0]?.name || 'Sarah Jenkins',
    status: 'In Progress',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    projectId: projects[0]?.id || '',
    clientName: clients[0]?.name || 'Aura Luxury Beauty',
    assignee: staff[0]?.name || 'Sarah Jenkins',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    expectedCompletion: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname, search, statusFilter, priorityFilter, staffFilter, clientFilter]);

  const showToast = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 3000);
  };

  // Helper for overdue check
  const isOverdue = (dueDate, status) => {
    if (status === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  // -------------------------------------------------------------
  // PROJECT ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateProject = () => {
    setProjectForm({
      title: '',
      clientName: clients[0]?.name || 'Aura Luxury Beauty',
      serviceName: services[0]?.name || 'Social Media Management',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-11-30',
      priority: 'Medium',
      leadStaff: staff[0]?.name || 'Sarah Jenkins',
      status: 'In Progress',
    });
    setIsCreateProjectOpen(true);
  };

  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    const clientObj = clients.find((c) => c.name === projectForm.clientName);
    addProject({
      ...projectForm,
      clientId: clientObj?.id || 'cli_101',
    });
    setIsCreateProjectOpen(false);
    showToast('New client project created successfully!');
  };

  const handleOpenEditProject = (proj) => {
    setSelectedProject(proj);
    setProjectForm({
      title: proj.title,
      clientName: proj.clientName,
      serviceName: proj.serviceName,
      description: proj.description || '',
      startDate: proj.startDate,
      dueDate: proj.dueDate,
      priority: proj.priority,
      leadStaff: proj.leadStaff,
      status: proj.status,
    });
    setIsEditProjectOpen(true);
  };

  const handleEditProjectSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    updateProject(selectedProject.id, projectForm);
    setSelectedProject((prev) => ({ ...prev, ...projectForm }));
    setIsEditProjectOpen(false);
    showToast('Project updated successfully!');
  };

  const handleToggleMilestone = (milestoneId) => {
    if (!selectedProject) return;
    const updatedMilestones = (selectedProject.milestones || []).map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const newPct = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : selectedProject.progressPct;

    updateProject(selectedProject.id, {
      milestones: updatedMilestones,
      progressPct: newPct,
    });

    setSelectedProject((prev) => ({
      ...prev,
      milestones: updatedMilestones,
      progressPct: newPct,
    }));

    showToast('Milestone status updated!');
  };

  const handleDeleteProjectConfirm = () => {
    if (confirmDeleteModal.id) {
      deleteProject(confirmDeleteModal.id);
      setIsProjectDrawerOpen(false);
      setSelectedProject(null);
      setConfirmDeleteModal({ isOpen: false, type: '', id: '', title: '' });
      showToast('Project archived and removed.');
    }
  };

  // -------------------------------------------------------------
  // TASK ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateTask = (defaultProjectId = '') => {
    const parentProj = projects.find((p) => p.id === defaultProjectId) || projects[0];
    setTaskForm({
      title: '',
      projectId: parentProj?.id || '',
      clientName: parentProj?.clientName || clients[0]?.name || 'Aura Luxury Beauty',
      assignee: staff[0]?.name || 'Sarah Jenkins',
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      expectedCompletion: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsCreateTaskOpen(true);
  };

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    const parentProj = projects.find((p) => p.id === taskForm.projectId);
    addTask({
      ...taskForm,
      clientName: parentProj?.clientName || taskForm.clientName,
    });
    setIsCreateTaskOpen(false);
    showToast('Task added to pipeline!');
  };

  const handleOpenEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      projectId: task.projectId,
      clientName: task.clientName,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      expectedCompletion: task.expectedCompletion || task.dueDate,
      description: task.description || '',
    });
    setIsEditTaskOpen(true);
  };

  const handleEditTaskSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    updateTask(selectedTask.id, taskForm);
    setSelectedTask((prev) => ({ ...prev, ...taskForm }));
    setIsEditTaskOpen(false);
    showToast('Task details updated!');
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Task moved to ${newStatus}`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;
    const commentObj = {
      id: `cmt_${Date.now()}`,
      author: 'Sarah Jenkins (You)',
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedComments = [...(selectedTask.comments || []), commentObj];
    updateTask(selectedTask.id, { comments: updatedComments });
    setSelectedTask((prev) => ({ ...prev, comments: updatedComments }));
    setNewCommentText('');
    showToast('Comment posted.');
  };

  const handleDeleteTaskConfirm = () => {
    if (confirmDeleteModal.id) {
      deleteTask(confirmDeleteModal.id);
      setIsTaskDrawerOpen(false);
      setSelectedTask(null);
      setConfirmDeleteModal({ isOpen: false, type: '', id: '', title: '' });
      showToast('Task removed.');
    }
  };

  // -------------------------------------------------------------
  // FILTERED DATA PIPELINES
  // -------------------------------------------------------------
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.leadStaff.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesClient = clientFilter === 'All' || p.clientName === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStaff = staffFilter === 'All' || t.assignee === staffFilter;
    const matchesClient = clientFilter === 'All' || t.clientName === clientFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesStaff && matchesClient;
  });

  const activeDataList = isTasksMode ? filteredTasks : isWorkloadMode ? staff : filteredProjects;
  const totalPages = Math.ceil(activeDataList.length / pageSize) || 1;
  const paginatedData = activeDataList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Columns for Projects Table
  const projectColumns = [
    {
      header: 'PROJECT TITLE',
      key: 'title',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] block font-body text-xs hover:text-[#8E722A] transition-colors cursor-pointer" onClick={() => { setSelectedProject(row); setIsProjectDrawerOpen(true); }}>
            {row.title}
          </span>
          <span className="text-[11px] text-[#685C43]">Client: {row.clientName} • {row.serviceName}</span>
        </div>
      ),
    },
    {
      header: 'LEAD STAFF',
      key: 'leadStaff',
      render: (row) => <span className="font-body text-xs text-[#221C11] font-semibold">{row.leadStaff}</span>,
    },
    {
      header: 'PROGRESS',
      key: 'progressPct',
      render: (row) => (
        <div className="w-32 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#685C43]">
            <span>Completion</span>
            <span className="font-bold text-[#111111]">{row.progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#FAF8F3] rounded-full overflow-hidden border border-[#0A0A0A]/06">
            <div
              className="h-full bg-[#8E722A] rounded-full transition-all duration-500"
              style={{ width: `${row.progressPct}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'DUE DATE',
      key: 'dueDate',
      render: (row) => (
        <span className={`font-mono text-[11px] ${isOverdue(row.dueDate, row.status) ? 'text-red-700 font-bold' : 'text-[#685C43]'}`}>
          {row.dueDate} {isOverdue(row.dueDate, row.status) && '(Overdue)'}
        </span>
      ),
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'ACTIONS',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEditProject(row)}
            className="p-1 text-[#685C43] hover:text-[#111111] transition-colors"
            title="Edit Project"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setSelectedProject(row); setIsProjectDrawerOpen(true); }}
            className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/10 text-[#111111] rounded-xs transition-colors"
          >
            Manage
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Toast Feedback */}
      {feedback.show && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Quick Stats Summary Grid (4 Cards - Stage 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="TOTAL PROJECTS"
          value={projects.length}
          trend={8}
          trendLabel="total deliverables"
          icon={FolderKanban}
          accentColor="gold"
        />
        <KpiCard
          label="ACTIVE IN PROGRESS"
          value={projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length}
          trend={12}
          trendLabel="in active production"
          icon={Kanban}
          accentColor="emerald"
        />
        <KpiCard
          label="COMPLETED DELIVERABLES"
          value={projects.filter((p) => p.status === 'Completed').length}
          trend={15}
          trendLabel="delivered projects"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <KpiCard
          label="PENDING PRODUCTION TASKS"
          value={tasks.filter((t) => t.status !== 'Completed').length}
          trend={-3}
          trendLabel="tasks pending review"
          icon={CheckSquare}
          accentColor="amber"
        />
      </div>

      {isTasksMode ? (
        /* View: Kanban Task Board View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#0A0A0A]/08 gap-3">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                TASK MANAGEMENT & KANBAN
              </span>
              <h2 className="font-display text-2xl font-normal text-[#111111]">
                Production Tasks Stream
              </h2>
            </div>

            <button
              onClick={() => handleOpenCreateTask()}
              className="px-4 py-2 bg-[#111111] hover:bg-[#8E722A] text-white font-mono text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Task Filters */}
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search task title, client, assignee..."
            filterOptions={['All', 'To Do', 'In Progress', 'Review', 'Completed']}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            actions={
              <div className="flex items-center gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
                >
                  <option value="All">All Assignees</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            }
          />

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['To Do', 'In Progress', 'Review', 'Completed'].map((statusKey) => {
              const statusTasks = filteredTasks.filter((t) => t.status === statusKey);
              return (
                <div key={statusKey} className="bg-[#FAF8F3] rounded-xl p-3 border border-[#0A0A0A]/06 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#0A0A0A]/06">
                    <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wide">{statusKey}</span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-[#0A0A0A]/08 text-[#685C43]">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[300px]">
                    {statusTasks.length === 0 ? (
                      <div className="py-8 text-center text-xs font-mono text-[#685C43]/60 italic border border-dashed border-[#0A0A0A]/08 rounded-lg">
                        No tasks in {statusKey}
                      </div>
                    ) : (
                      statusTasks.map((t) => {
                        const overdue = isOverdue(t.dueDate, t.status);
                        return (
                          <div
                            key={t.id}
                            onClick={() => { setSelectedTask(t); setIsTaskDrawerOpen(true); }}
                            className={`p-3 bg-white rounded-lg border transition-all duration-200 cursor-pointer space-y-2 hover:shadow-md ${
                              overdue ? 'border-red-500 bg-red-50/30' : 'border-[#0A0A0A]/08 hover:border-[#8E722A]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-[#111111] leading-snug hover:text-[#8E722A]">{t.title}</h4>
                              <StatusBadge status={t.priority} />
                            </div>

                            <span className="text-[10px] font-mono text-[#685C43] block">Client: {t.clientName}</span>

                            {overdue && (
                              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-xs w-max">
                                <AlertCircle className="w-3 h-3" />
                                <span>OVERDUE ({t.dueDate})</span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-[#0A0A0A]/04 flex items-center justify-between text-[10px] font-mono text-[#685C43]">
                              <span className="font-semibold text-[#111111]">{t.assignee}</span>
                              <div className="flex items-center gap-2">
                                {(t.comments?.length || 0) > 0 && (
                                  <span className="flex items-center gap-0.5 text-[#8E722A]">
                                    <MessageSquare className="w-3 h-3" />
                                    {t.comments.length}
                                  </span>
                                )}
                                <span>{t.dueDate}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AdminCard noPadding>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTasks.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setPageSize}
            />
          </AdminCard>
        </div>
      ) : isWorkloadMode ? (
        /* View: Team Workload View */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              RESOURCE ALLOCATION
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Team Workload & Active Tasks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedData.map((member) => {
              const assignedTasks = tasks.filter((t) => t.assignee === member.name && t.status !== 'Completed');
              return (
                <AdminCard key={member.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xs font-bold flex items-center justify-center border border-[#8E722A]">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#111111]">{member.name}</h3>
                          <span className="text-[11px] font-mono text-[#685C43]">{member.role}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#8E722A] bg-[#FAF8F3] px-3 py-1 rounded-full border border-[#0A0A0A]/08">
                        {assignedTasks.length} Active Tasks
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#0A0A0A]/06">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#685C43] font-bold">Assigned Tasks</div>
                      {assignedTasks.slice(0, 3).map((t) => (
                        <div key={t.id} className="p-2 bg-[#FAF8F3] rounded-xs border border-[#0A0A0A]/06 flex items-center justify-between text-xs font-mono">
                          <span className="truncate max-w-[200px] text-[#111111] font-medium">{t.title}</span>
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                      {assignedTasks.length === 0 && (
                        <div className="text-xs font-mono text-[#685C43]/70 italic">No pending tasks assigned.</div>
                      )}
                    </div>
                  </div>
                </AdminCard>
              );
            })}
          </div>

          <AdminCard noPadding>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={staff.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setPageSize}
            />
          </AdminCard>
        </div>
      ) : (
        /* View: Projects List */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#0A0A0A]/08 gap-3">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                PRODUCTION PIPELINE
              </span>
              <h2 className="font-display text-2xl font-normal text-[#111111]">
                Active Client Projects
              </h2>
            </div>

            <button
              onClick={handleOpenCreateProject}
              className="px-4 py-2 bg-[#111111] hover:bg-[#8E722A] text-white font-mono text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search project title, client, lead staff..."
            filterOptions={['All', 'In Progress', 'Planning', 'On Hold', 'Completed']}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            actions={
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-mono bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
              >
                <option value="All">All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            }
          />

          <AdminCard noPadding>
            <DataTable columns={projectColumns} data={paginatedData} onRowClick={(row) => { setSelectedProject(row); setIsProjectDrawerOpen(true); }} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProjects.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setPageSize}
            />
          </AdminCard>
        </div>
      )}

      {/* ========================================================= */}
      {/* PROJECT DETAIL SLIDE DRAWER WITH CONTEXTUAL TABS         */}
      {/* ========================================================= */}
      <SlideDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        title={selectedProject ? selectedProject.title : 'Project Workspace'}
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Header Summary */}
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#685C43]">Client: {selectedProject.clientName}</span>
                <StatusBadge status={selectedProject.status} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-[#111111]">
                  <span>Progress Progress</span>
                  <span>{selectedProject.progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#0A0A0A]/10">
                  <div className="h-full bg-[#8E722A] rounded-full transition-all duration-500" style={{ width: `${selectedProject.progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Contextual Tabs */}
            <div className="flex border-b border-[#0A0A0A]/10 overflow-x-auto no-scrollbar font-mono text-xs">
              {['Overview', 'Tasks', 'Milestones', 'Files', 'Activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProjectDrawerTab(tab)}
                  className={`px-3 py-2 border-b-2 font-bold whitespace-nowrap transition-colors ${
                    projectDrawerTab === tab
                      ? 'border-[#8E722A] text-[#8E722A]'
                      : 'border-transparent text-[#685C43] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {projectDrawerTab === 'Overview' && (
              <div className="space-y-4 text-xs font-body">
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider">Project Description</h4>
                  <p className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs text-[#111111] leading-relaxed">
                    {selectedProject.description || 'No custom description provided for this production campaign.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                    <span className="text-[10px] font-mono text-[#685C43] block">Lead Staff</span>
                    <strong className="font-bold text-[#111111] text-xs">{selectedProject.leadStaff}</strong>
                  </div>
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                    <span className="text-[10px] font-mono text-[#685C43] block">Priority</span>
                    <StatusBadge status={selectedProject.priority} />
                  </div>
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                    <span className="text-[10px] font-mono text-[#685C43] block">Start Date</span>
                    <strong className="font-mono text-[#111111]">{selectedProject.startDate}</strong>
                  </div>
                  <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                    <span className="text-[10px] font-mono text-[#685C43] block">Deadline</span>
                    <strong className={`font-mono ${isOverdue(selectedProject.dueDate, selectedProject.status) ? 'text-red-700 font-bold' : 'text-[#111111]'}`}>
                      {selectedProject.dueDate}
                    </strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditProject(selectedProject)}
                    className="flex-1 py-2 bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/10 text-xs font-mono font-bold rounded-xs transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => setConfirmDeleteModal({ isOpen: true, type: 'Project', id: selectedProject.id, title: selectedProject.title })}
                    className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono font-bold rounded-xs transition-colors"
                  >
                    Archive
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: TASKS */}
            {projectDrawerTab === 'Tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#111111]">
                    Linked Tasks ({tasks.filter((t) => t.projectId === selectedProject.id).length})
                  </span>
                  <button
                    onClick={() => handleOpenCreateTask(selectedProject.id)}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#111111] text-white hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {tasks.filter((t) => t.projectId === selectedProject.id).length === 0 ? (
                    <div className="p-4 text-center text-xs font-mono text-[#685C43] border border-dashed border-[#0A0A0A]/10 rounded-xs">
                      No production tasks linked to this project yet.
                    </div>
                  ) : (
                    tasks
                      .filter((t) => t.projectId === selectedProject.id)
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => { setSelectedTask(t); setIsTaskDrawerOpen(true); }}
                          className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs hover:border-[#8E722A] cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-[#111111]">{t.title}</div>
                            <div className="text-[10px] font-mono text-[#685C43]">Assignee: {t.assignee} • Due: {t.dueDate}</div>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MILESTONES */}
            {projectDrawerTab === 'Milestones' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#685C43]">
                  Check off completed project phases. Milestone progress dynamically updates the project completion score.
                </div>

                <div className="space-y-2">
                  {(selectedProject.milestones || []).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3 border rounded-xs flex items-center justify-between cursor-pointer transition-colors ${
                        m.completed ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-[#0A0A0A]/08 hover:border-[#8E722A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-xs border flex items-center justify-center ${m.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#0A0A0A]/20 bg-white'}`}>
                          {m.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${m.completed ? 'line-through text-[#685C43]' : 'text-[#111111]'}`}>
                            {m.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#685C43]">Target: {m.dueDate}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold ${m.completed ? 'text-emerald-700' : 'text-[#8E722A]'}`}>
                        {m.completed ? 'COMPLETED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FILES */}
            {projectDrawerTab === 'Files' && (
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-[#0A0A0A]/14 rounded-xs bg-[#FAF8F3] text-center space-y-2 cursor-pointer hover:border-[#8E722A] transition-colors">
                  <UploadCloud className="w-6 h-6 text-[#8E722A] mx-auto" />
                  <div className="text-xs font-mono font-bold text-[#111111]">Upload Project Deliverable or Asset</div>
                  <div className="text-[10px] font-mono text-[#685C43]">Drag & drop video renders, briefs, or design files (Mock Dropzone)</div>
                </div>

                <div className="space-y-2">
                  {['Campaign_Creative_Brief_v2.pdf', 'Social_Media_Asset_Bundle.zip', 'Brand_Guidelines_2026.pdf'].map((fname, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#8E722A]" />
                        <span className="font-semibold text-[#111111]">{fname}</span>
                      </div>
                      <span className="text-[10px] text-[#685C43] hover:text-[#8E722A] cursor-pointer font-bold">Download</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ACTIVITY */}
            {projectDrawerTab === 'Activity' && (
              <div className="space-y-3">
                {(selectedProject.activity || [
                  { id: '1', title: 'Project Kickoff Approved', timestamp: selectedProject.startDate },
                  { id: '2', title: 'Creative Assets Uploaded by Team', timestamp: new Date().toLocaleDateString() },
                ]).map((act) => (
                  <div key={act.id} className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs space-y-1">
                    <div className="text-xs font-bold text-[#111111]">{act.title}</div>
                    <div className="text-[10px] font-mono text-[#685C43]">{act.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* ========================================================= */}
      {/* TASK DETAIL SLIDE DRAWER                                  */}
      {/* ========================================================= */}
      <SlideDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        title={selectedTask ? selectedTask.title : 'Task Inspection'}
      >
        {selectedTask && (
          <div className="space-y-6">
            {/* Status quick switcher */}
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#685C43] font-bold">Task Pipeline Status</div>
              <div className="grid grid-cols-4 gap-1 font-mono text-[11px]">
                {['To Do', 'In Progress', 'Review', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleTaskStatusChange(selectedTask.id, st)}
                    className={`py-1.5 text-center font-bold rounded-xs transition-colors ${
                      selectedTask.status === st
                        ? 'bg-[#111111] text-[#F7F5EF]'
                        : 'bg-white text-[#685C43] border border-[#0A0A0A]/10 hover:border-[#8E722A]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs font-body">
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                <span className="text-[10px] font-mono text-[#685C43] block">Assignee</span>
                <strong className="font-bold text-[#111111]">{selectedTask.assignee}</strong>
              </div>
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                <span className="text-[10px] font-mono text-[#685C43] block">Priority</span>
                <StatusBadge status={selectedTask.priority} />
              </div>
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                <span className="text-[10px] font-mono text-[#685C43] block">Client</span>
                <strong className="font-bold text-[#111111] truncate block">{selectedTask.clientName}</strong>
              </div>
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs">
                <span className="text-[10px] font-mono text-[#685C43] block">Due Date</span>
                <strong className={`font-mono ${isOverdue(selectedTask.dueDate, selectedTask.status) ? 'text-red-700 font-bold' : 'text-[#111111]'}`}>
                  {selectedTask.dueDate}
                </strong>
              </div>
            </div>

            {/* Interactive Comments Section */}
            <div className="space-y-3 pt-3 border-t border-[#0A0A0A]/10">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#111111]">Internal Team Comments</span>
                <span className="text-[#685C43]">({(selectedTask.comments || []).length})</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {(selectedTask.comments || []).length === 0 ? (
                  <div className="text-xs font-mono text-[#685C43] italic p-3 bg-[#FAF8F3] border border-[#0A0A0A]/06 rounded-xs">
                    No comments logged for this task yet.
                  </div>
                ) : (
                  (selectedTask.comments || []).map((c) => (
                    <div key={c.id} className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-[#8E722A]">{c.author}</span>
                        <span className="text-[#685C43]">{c.timestamp}</span>
                      </div>
                      <p className="text-xs font-body text-[#111111] leading-normal">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add internal comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-body border border-[#0A0A0A]/14 rounded-xs focus:outline-none focus:border-[#8E722A]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#111111] hover:bg-[#8E722A] text-white font-mono text-xs font-bold rounded-xs transition-colors"
                >
                  Post
                </button>
              </form>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-between gap-2">
              <button
                onClick={() => handleOpenEditTask(selectedTask)}
                className="flex-1 py-2 bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/10 text-xs font-mono font-bold rounded-xs transition-colors"
              >
                Edit Task
              </button>
              <button
                onClick={() => setConfirmDeleteModal({ isOpen: true, type: 'Task', id: selectedTask.id, title: selectedTask.title })}
                className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono font-bold rounded-xs transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* ========================================================= */}
      {/* MODALS: CREATE / EDIT PROJECT                             */}
      {/* ========================================================= */}
      <AdminModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        title="Initialize New Client Project"
      >
        <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
          <FormInput
            label="Project Name"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            placeholder="e.g. Q4 Brand Commercial & Reels Campaign"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Client"
              value={projectForm.clientName}
              onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
              options={clients.map((c) => c.name)}
            />
            <FormSelect
              label="Associated Service"
              value={projectForm.serviceName}
              onChange={(e) => setProjectForm({ ...projectForm, serviceName: e.target.value })}
              options={services.map((s) => s.name)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="Start Date"
              type="date"
              value={projectForm.startDate}
              onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
              required
            />
            <FormInput
              label="Deadline"
              type="date"
              value={projectForm.dueDate}
              onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
              required
            />
            <FormSelect
              label="Priority"
              value={projectForm.priority}
              onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Urgent']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Lead Responsible Staff"
              value={projectForm.leadStaff}
              onChange={(e) => setProjectForm({ ...projectForm, leadStaff: e.target.value })}
              options={staff.map((s) => s.name)}
            />
            <FormSelect
              label="Initial Status"
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              options={['Planning', 'In Progress', 'On Hold', 'Completed']}
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider block mb-1">
              Project Description & Scope
            </label>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Detail key objectives, deliverables, and guidelines..."
              className="w-full px-3 py-2 text-xs font-body border border-[#0A0A0A]/14 rounded-xs focus:outline-none focus:border-[#8E722A]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xs transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        title="Edit Project Details"
      >
        <form onSubmit={handleEditProjectSubmit} className="space-y-4">
          <FormInput
            label="Project Title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Priority"
              value={projectForm.priority}
              onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Urgent']}
            />
            <FormSelect
              label="Status"
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              options={['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Start Date"
              type="date"
              value={projectForm.startDate}
              onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
            />
            <FormInput
              label="Deadline"
              type="date"
              value={projectForm.dueDate}
              onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
            />
          </div>

          <FormSelect
            label="Lead Staff"
            value={projectForm.leadStaff}
            onChange={(e) => setProjectForm({ ...projectForm, leadStaff: e.target.value })}
            options={staff.map((s) => s.name)}
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsEditProjectOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ========================================================= */}
      {/* MODALS: CREATE / EDIT TASK                                */}
      {/* ========================================================= */}
      <AdminModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        title="Add New Production Task"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
          <FormInput
            label="Task Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            placeholder="e.g. Color Grading Final Commercial Cut"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Parent Project"
              value={taskForm.projectId}
              onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
              options={projects.map((p) => p.title)}
            />
            <FormSelect
              label="Assigned Staff"
              value={taskForm.assignee}
              onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
              options={staff.map((s) => s.name)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormSelect
              label="Status"
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
              options={['To Do', 'In Progress', 'Review', 'Completed']}
            />
            <FormSelect
              label="Priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Urgent']}
            />
            <FormInput
              label="Due Date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xs transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isEditTaskOpen}
        onClose={() => setIsEditTaskOpen(false)}
        title="Edit Production Task"
      >
        <form onSubmit={handleEditTaskSubmit} className="space-y-4">
          <FormInput
            label="Task Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Assigned Staff"
              value={taskForm.assignee}
              onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
              options={staff.map((s) => s.name)}
            />
            <FormSelect
              label="Priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High', 'Urgent']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Status"
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
              options={['To Do', 'In Progress', 'Review', 'Completed']}
            />
            <FormInput
              label="Due Date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsEditTaskOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ isOpen: false, type: '', id: '', title: '' })}
        onConfirm={confirmDeleteModal.type === 'Project' ? handleDeleteProjectConfirm : handleDeleteTaskConfirm}
        title={`Archive ${confirmDeleteModal.type}`}
        message={`Are you sure you want to remove "${confirmDeleteModal.title}"? This action can be reversed in history logs.`}
        confirmText={`Confirm Archive`}
      />
    </div>
  );
};

