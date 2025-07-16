// src/pages/DashBoard.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout'; // Assuming default export
import DashboardHome from '../components/dashboard/DashboardHome';
import MyRequests from '../components/dashboard/MyRequests';
import MyApplications from '../components/dashboard/MyApplications';
import BrowseSkills from '../components/dashboard/BrowseSkills';
import Profile from '../components/dashboard/Profile'; // Assuming this is the profile component
import Settings from '../components/dashboard/Settings';
import CreateRequests from '../components/dashboard/CreateRequests';
import MessagesPageWrapper from '../components/dashboard/MessagePageWrapper'; // <--- NEW: Import the wrapper
import ApplicationDetails from '@/components/dashboard/ApplicationDetails';
import SkillRequestDetails from '@/components/dashboard/SkillRequestDetails';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="browse" element={<BrowseSkills />} />
        <Route path="profile" element={<Profile />} /> {/* Assuming this route is for the logged-in user's profile */}
        <Route path="profile/:identifier" element={<Profile />} /> {/* For viewing other users' profiles */}
        <Route path="settings" element={<Settings />} />
        <Route path="create-request" element={<CreateRequests />} />
        <Route path="applications/:applicationId" element={<ApplicationDetails />} />
        <Route path="requests/:requestId" element={<SkillRequestDetails />} />

        {/* NEW: Routes for Messages */}
        {/* This route will show the list and the default "select a conversation" message */}
        <Route path="messages" element={<MessagesPageWrapper />} />
        {/* This route will show the list and the specific chat conversation */}
        <Route path="messages/:conversationId/:otherParticipantId" element={<MessagesPageWrapper />} />

        {/* Catch-all for any unknown dashboard routes */}
        <Route path="*" element={<p className="text-center text-gray-500">404 - Page Not Found</p>} />
      </Routes>
    </DashboardLayout>
  );
}