'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, Filter, Pin, Archive, Star, 
  Calendar, Tag, FileText, Clock, TrendingUp 
} from 'lucide-react';

export default function NotebookPage() {
  const [pages, setPages] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pinned: 0,
    archived: 0,
    favorites: 0,
    active: 0,
  });
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [filterPinned, setFilterPinned] = useState(false);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchSections();
    fetchPages();
  }, [searchQuery, selectedSection, filterPinned, filterFavorite]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/notebook/pages/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/notebook/pages/sections');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedSection) params.append('section', selectedSection);
      if (filterPinned) params.append('isPinned', 'true');
      if (filterFavorite) params.append('isFavorite', 'true');

      const response = await fetch(`/api/notebook/pages?${params}`);
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-red-200',
      purple: 'bg-purple-50 border-purple-200',
      gray: 'bg-gray-50 border-gray-200',
    };
    return colors[color] || 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الدفتر الشامل</h1>
              <p className="text-gray-600">ملاحظاتك وأفكارك في مكان واحد</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            صفحة جديدة
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الصفحات</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">صفحات نشطة</p>
                <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مثبتة</p>
                <p className="text-2xl font-bold text-amber-600">{statistics.pinned}</p>
              </div>
              <Pin className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مفضلة</p>
                <p className="text-2xl font-bold text-rose-600">{statistics.favorites}</p>
              </div>
              <Star className="w-8 h-8 text-rose-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مؤرشفة</p>
                <p className="text-2xl font-bold text-gray-600">{statistics.archived}</p>
              </div>
              <Archive className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="بحث في الصفحات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">كل الأقسام</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>

          {/* Pinned Filter */}
          <button
            onClick={() => setFilterPinned(!filterPinned)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filterPinned
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Pin className="w-4 h-4" />
            المثبتة فقط
          </button>

          {/* Favorite Filter */}
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filterFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Star className="w-4 h-4" />
            المفضلة فقط
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد صفحات</h3>
          <p className="text-gray-600 mb-6">ابدأ بإنشاء صفحة جديدة</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            إنشاء صفحة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page: any) => (
            <div
              key={page.id}
              className={`p-6 rounded-lg border-2 hover:shadow-lg transition-shadow cursor-pointer ${getColorClass(
                page.color
              )}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {page.icon && <span className="text-2xl">{page.icon}</span>}
                    <h3 className="text-lg font-bold text-gray-900">{page.title}</h3>
                  </div>
                  {page.section && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs text-gray-600">
                      <Tag className="w-3 h-3" />
                      {page.section}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {page.isPinned && <Pin className="w-4 h-4 text-amber-600" />}
                  {page.isFavorite && <Star className="w-4 h-4 text-rose-600 fill-rose-600" />}
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {page.content?.substring(0, 150) || 'لا يوجد محتوى...'}
              </p>

              {/* Tags */}
              {page.tags && page.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {page.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {page.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200">
                      +{page.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(page.updatedAt)}
                </div>
                {page.stickyNotes && page.stickyNotes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-yellow-100 rounded text-yellow-700">
                      {page.stickyNotes.length} ملصق
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
