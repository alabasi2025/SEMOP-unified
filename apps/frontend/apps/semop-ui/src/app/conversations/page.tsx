'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Archive, 
  CheckCircle,
  Clock,
  Lightbulb,
  FileText
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  summary?: string;
  category: string;
  status: string;
  sourceRepo: string;
  extractedIdeasCount: number;
  linesCount: number;
  wordsCount: number;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  ARCHITECTURE: 'bg-blue-100 text-blue-800',
  GUIDE: 'bg-green-100 text-green-800',
  PLANNING: 'bg-purple-100 text-purple-800',
  REPORT: 'bg-orange-100 text-orange-800',
  DOCUMENTATION: 'bg-gray-100 text-gray-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<string, any> = {
  ACTIVE: Clock,
  EXTRACTING: MessageSquare,
  COMPLETED: CheckCircle,
  ARCHIVED: Archive,
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [selectedCategory, selectedStatus]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/conversations?${params}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchConversations();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            المحادثات
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة المحادثات واستخلاص الأفكار
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المحادثات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {conversations.filter((c) => c.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conversations.filter((c) => c.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الأفكار المستخلصة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {conversations.reduce((sum, c) => sum + c.extractedIdeasCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في المحادثات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 ml-2" />
              بحث
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              الكل
            </Button>
            {Object.keys(categoryColors).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">جاري التحميل...</p>
            </CardContent>
          </Card>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد محادثات</p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => {
            const StatusIcon = statusIcons[conversation.status] || Clock;
            return (
              <Card key={conversation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {conversation.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {conversation.summary}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={categoryColors[conversation.category]}>
                        {conversation.category}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {conversation.linesCount.toLocaleString()} سطر
                      </span>
                      <span className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        {conversation.extractedIdeasCount} فكرة
                      </span>
                      <span>
                        📦 {conversation.sourceRepo}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
