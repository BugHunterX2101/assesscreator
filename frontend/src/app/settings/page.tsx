'use client';
import React from 'react';
import { Settings, User, Bell, Shield, Paintbrush } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile', icon: User, desc: 'Manage your personal information and account details.' },
    { title: 'Notifications', icon: Bell, desc: 'Configure how you receive alerts and emails.' },
    { title: 'Security', icon: Shield, desc: 'Update passwords and secure your account.' },
    { title: 'Appearance', icon: Paintbrush, desc: 'Customize the look and feel of your dashboard.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </span>
          <span>Settings</span>
        </h1>
        <p className="text-gray-500 text-lg">Manage your account preferences and application settings.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {sections.map((section, idx) => (
          <div key={idx} className={`p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors cursor-pointer ${idx !== sections.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              <section.icon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
              <p className="text-gray-500 text-sm">{section.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
