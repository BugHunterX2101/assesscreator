'use client';
import React from 'react';
import { Clock, Book, FileText, Search, Filter } from 'lucide-react';
import axios from 'axios';

interface LibraryItem {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [items, setItems] = React.useState<LibraryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await axios.get(`${baseUrl}/api/toolkit/library`);
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch library items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </span>
            <span>My Library</span>
          </h1>
          <p className="text-gray-500 text-lg">Your collection of past assessments and templates.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Filter Library" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
        </div>
        <div className="relative flex-1 max-w-sm sm:ml-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Search Materials" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading your library...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your library is currently empty. Start generating tools from the Toolkit!</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  {item.type === 'Quiz' ? <Book className="w-6 h-6 text-gray-500" /> : <FileText className="w-6 h-6 text-gray-500" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
