'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, Plus, Search, Filter, Star, TrendingUp, 
  CheckCircle, XCircle, Clock, ArrowRight, Sparkles,
  Target, Zap, Award, BarChart3
} from 'lucide-react';

export default function IdeasBankPage() {
  const [ideas, setIdeas] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    byStatus: {
      new: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0,
      converted: 0,
    },
    byPriority: {},
    byCategory: {},
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchIdeas();
  }, [searchQuery, selectedStatus, selectedPriority, selectedCategory]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/smart-notebook/ideas/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedPriority) params.append('priority', selectedPriority);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`/api/smart-notebook/ideas?${params}`);
      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      NEW: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Sparkles, label: 'جديدة' },
      UNDER_REVIEW: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'قيد المراجعة' },
      ACCEPTED: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'مقبولة' },
      REJECTED: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'مرفوضة' },
      CONVERTED: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: ArrowRight, label: 'محولة' },
    };
    return badges[status] || badges.NEW;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: any = {
      CRITICAL: { color: 'bg-red-500 text-white', label: 'حرجة' },
      HIGH: { color: 'bg-orange-500 text-white', label: 'عالية' },
      MEDIUM: { color: 'bg-yellow-500 text-white', label: 'متوسطة' },
      LOW: { color: 'bg-green-500 text-white', label: 'منخفضة' },
    };
    return badges[priority] || badges.MEDIUM;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                بنك الأفكار
              </h1>
              <p className="text-gray-600 mt-1">مستودع الإبداع والابتكار</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <Plus className="w-5 h-5" />
            فكرة جديدة
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الأفكار</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">جديدة</p>
                <p className="text-3xl font-bold">{statistics.byStatus.new}</p>
              </div>
              <Sparkles className="w-6 h-6 text-blue-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-100 mb-1">قيد المراجعة</p>
                <p className="text-3xl font-bold">{statistics.byStatus.underReview}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 mb-1">مقبولة</p>
                <p className="text-3xl font-bold">{statistics.byStatus.accepted}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-100" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100 mb-1">محولة لمهام</p>
                <p className="text-3xl font-bold">{statistics.byStatus.converted}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-purple-100" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في الأفكار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">كل الحالات</option>
              <option value="NEW">جديدة</option>
              <option value="UNDER_REVIEW">قيد المراجعة</option>
              <option value="ACCEPTED">مقبولة</option>
              <option value="REJECTED">مرفوضة</option>
              <option value="CONVERTED">محولة</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">كل الأولويات</option>
              <option value="CRITICAL">حرجة</option>
              <option value="HIGH">عالية</option>
              <option value="MEDIUM">متوسطة</option>
              <option value="LOW">منخفضة</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">كل الفئات</option>
              <option value="FEATURE">ميزة</option>
              <option value="IMPROVEMENT">تحسين</option>
              <option value="BUG_FIX">إصلاح</option>
              <option value="RESEARCH">بحث</option>
              <option value="OTHER">أخرى</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <Lightbulb className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد أفكار</h3>
          <p className="text-gray-600 mb-6">ابدأ بإضافة فكرة جديدة</p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
            أضف فكرتك الأولى
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea: any) => {
            const statusBadge = getStatusBadge(idea.status);
            const priorityBadge = getPriorityBadge(idea.priority);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={idea.id}
                className="group bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border-2 ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {idea.description || 'لا يوجد وصف...'}
                </p>

                {/* Metrics */}
                {(idea.estimatedValue || idea.estimatedEffort || idea.rating) && (
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                    {idea.estimatedValue && (
                      <div className="text-center">
                        <Target className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">القيمة</p>
                        <p className="text-sm font-bold text-gray-900">{idea.estimatedValue}/10</p>
                      </div>
                    )}
                    {idea.estimatedEffort && (
                      <div className="text-center">
                        <Zap className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">الجهد</p>
                        <p className="text-sm font-bold text-gray-900">{idea.estimatedEffort}/10</p>
                      </div>
                    )}
                    {idea.rating && (
                      <div className="text-center">
                        <Award className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">التقييم</p>
                        <p className="text-sm font-bold text-gray-900">{idea.rating}/5</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{idea.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {formatDate(idea.createdAt)}
                  </div>
                  {idea.convertedToTask && (
                    <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                      <ArrowRight className="w-3 h-3" />
                      محولة لمهمة
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
