import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Protected Route
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import JobListingPage from '../pages/public/JobListingPage';
import JobDetailPage from '../pages/public/JobDetailPage';
import CompanyListingPage from '../pages/public/CompanyListingPage';
import CompanyDetailPage from '../pages/public/CompanyDetailPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingPage from '../pages/auth/OnboardingPage';

// Candidate Pages
import CandidateProfilePage from '../pages/candidate/CandidateProfilePage';
import AppliedJobsPage from '../pages/candidate/AppliedJobsPage';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import PostJobPage from '../pages/recruiter/PostJobPage';
import ManageJobsPage from '../pages/recruiter/ManageJobsPage';
import ManageCandidatesPage from '../pages/recruiter/ManageCandidatesPage';
import CompanyProfileEditPage from '../pages/recruiter/CompanyProfileEditPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagementPage from '../pages/admin/UserManagementPage';

// Not Found
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';

const AppRoutes = () => {
     return (
          <BrowserRouter>
               <Routes>
                    {/* ===== A. Public Routes - MainLayout ===== */}
                    <Route element={<MainLayout />}>
                         <Route path="/" element={<HomePage />} />
                         <Route path="/jobs" element={<JobListingPage />} />
                         <Route path="/jobs/:id" element={<JobDetailPage />} />
                         <Route path="/companies" element={<CompanyListingPage />} />
                         <Route path="/companies/:id" element={<CompanyDetailPage />} />
                    </Route>

                    {/* ===== B. Auth Routes - AuthLayout ===== */}
                    <Route element={<AuthLayout />}>
                         <Route path="/login" element={<LoginPage />} />
                         <Route path="/register" element={<RegisterPage />} />
                         <Route path="/onboarding" element={<OnboardingPage />} />
                    </Route>

                    {/* ===== C. Candidate Routes - MainLayout + ProtectedRoute (role: USER) ===== */}
                    <Route element={<MainLayout />}>
                         <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                              <Route path="/candidate/profile" element={<CandidateProfilePage />} />
                              <Route path="/candidate/applied-jobs" element={<AppliedJobsPage />} />
                         </Route>
                    </Route>

                    {/* ===== D. Recruiter Routes - DashboardLayout + ProtectedRoute (role: COMPANY) ===== */}
                    <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
                         <Route element={<DashboardLayout />}>
                              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                              <Route path="/recruiter/post-job" element={<PostJobPage />} />
                              <Route path="/recruiter/manage-jobs" element={<ManageJobsPage />} />
                              <Route path="/recruiter/manage-candidates" element={<ManageCandidatesPage />} />
                              <Route path="/recruiter/company-profile" element={<CompanyProfileEditPage />} />
                         </Route>
                    </Route>

                    {/* ===== E. Admin Routes - DashboardLayout + ProtectedRoute (role: ADMIN) ===== */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                         <Route element={<DashboardLayout />}>
                              <Route path="/admin/dashboard" element={<AdminDashboard />} />
                              <Route path="/admin/users" element={<UserManagementPage />} />
                         </Route>
                    </Route>

                    {/* ===== 403 Forbidden ===== */}
                    <Route path="/403" element={<ForbiddenPage />} />

                    {/* ===== 404 Not Found ===== */}
                    <Route path="*" element={<NotFoundPage />} />
               </Routes>
          </BrowserRouter>
     );
};

export default AppRoutes;
