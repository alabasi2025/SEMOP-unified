'use client';

import { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, Clock, 
  AlertCircle, CheckCircle, PlayCircle, PauseCircle,
  Calendar, User, Tag, TrendingUp, BarChart3, Target
} from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    byStatus: {},
    byPriority: {},
    overdue: 0,
    completed: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'TODO', title: 'قائمة المهام', icon: Clock, color: 'from-gray-500 to-gray-600', count: 0 },
    { id: 'IN_PROGRESS', title: 'قيد التنفيذ', icon: PlayCircle, color: 'from-blue-500 to-blue-600', count: 0 },
    { id: 'BLOCKED', title: 'محظورة', icon: AlertCircle, color: 'from-red-500 to-red-600', count: 0 },
    { id: 'DONE', title: 'مكتملة', icon: CheckCircle, color: 'from-green-500 to-green-600', count: 0 },
  ];

  useEffect(() => {
    fetchStatistics();
    fetchTasks();
  }, [searchQuery, selectedPriority]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/smart-notebook/tasks/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedPriority) params.append('priority', selectedPriority);

      const response = await fetch(`/api/smart-notebook/tasks?${params}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task: any) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      CRITICAL: 'bg-red-500',
      HIGH: 'bg-orange-500',
      MEDIUM: 'bg-yellow-500',
      LOW: 'bg-green-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                إدارة المهام
              </h1>
              <p className="text-gray-600 mt-1">لوحة كانبان للمهام</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <Plus className="w-5 h-5" />
            مهمة جديدة
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المهام</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">قيد التنفيذ</p>
                <p className="text-3xl font-bold">{statistics.byStatus?.IN_PROGRESS || 0}</p>
              </div>
              <PlayCircle className="w-6 h-6 text-blue-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 mb-1">مكتملة</p>
                <p className="text-3xl font-bold">{statistics.completed || 0}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-100 mb-1">متأخرة</p>
                <p className="text-3xl font-bold">{statistics.overdue || 0}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-red-100" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في المهام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">كل الأولويات</option>
              <option value="CRITICAL">حرجة</option>
              <option value="HIGH">عالية</option>
              <option value="MEDIUM">متوسطة</option>
              <option value="LOW">منخفضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            const ColumnIcon = column.icon;

            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`bg-gradient-to-r ${column.color} p-4 rounded-t-2xl text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ColumnIcon className="w-5 h-5" />
                      <h3 className="font-bold text-lg">{column.title}</h3>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 bg-gray-50 p-4 rounded-b-2xl border-2 border-gray-100 min-h-[600px]">
                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <PauseCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">لا توجد مهام</p>
                      </div>
                    ) : (
                      columnTasks.map((task: any) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          {/* Task Header */}
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                              {task.title}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0 mt-1`}></div>
                          </div>

                          {/* Task Description */}
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Task Meta */}
                          <div className="space-y-2">
                            {/* Due Date */}
                            {task.dueDate && (
                              <div className={`flex items-center gap-2 text-xs ${
                                isOverdue(task.dueDate) ? 'text-red-600 font-bold' : 'text-gray-500'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {formatDate(task.dueDate)}
                                {isOverdue(task.dueDate) && ' (متأخرة)'}
                              </div>
                            )}

                            {/* Assigned To */}
                            {task.assignedTo && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <User className="w-3 h-3" />
                                {task.assignedTo}
                              </div>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0, 2).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {task.tags.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{task.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Progress */}
                            {task.progress !== undefined && task.progress > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600">التقدم</span>
                                  <span className="text-xs font-bold text-blue-600">{task.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${task.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* From Idea Badge */}
                          {task.fromIdea && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                                💡 من فكرة: {task.fromIdea.title}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
