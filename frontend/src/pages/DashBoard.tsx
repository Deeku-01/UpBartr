
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import MyRequests from '../components/dashboard/MyRequests';
import MyApplications from '../components/dashboard/MyApplications';
import BrowseSkills from '../components/dashboard/BrowseSkills';
import Messages from '../components/dashboard/Messages';
import Profile from '../components/dashboard/Profile';
import CreateRequest from '../components/dashboard/CreateRequests';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        {/* These paths are now relative to /dashboard */}
        <Route index element={<DashboardHome />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="browse" element={<BrowseSkills />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-request" element={<CreateRequest />} />
      </Routes>
    </DashboardLayout>
  );
}