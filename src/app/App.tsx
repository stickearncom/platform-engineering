import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '@/shared/components/Layout';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { EmployeesPage } from '@/modules/employees/EmployeesPage';
import { TeamsPage } from '@/modules/teams/TeamsPage';
import { RolesPage } from '@/modules/roles/RolesPage';
import { ReviewCyclesPage } from '@/modules/review-cycles/ReviewCyclesPage';
import { TemplatesPage } from '@/modules/templates/TemplatesPage';
import { QuestionsPage } from '@/modules/questions/QuestionsPage';
import { AssignmentsPage } from '@/modules/assignments/AssignmentsPage';
import { ReviewsPage } from '@/modules/reviews/ReviewsPage';
import { ReviewFormPage } from '@/modules/reviews/ReviewFormPage';

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/review-cycles" element={<ReviewCyclesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
