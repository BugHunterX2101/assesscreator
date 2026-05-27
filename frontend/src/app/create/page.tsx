"use client";

import { AssignmentForm } from '../../components/form/AssignmentForm';

export default function CreateAssignmentPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AssignmentForm />
      </div>
    </main>
  );
}
