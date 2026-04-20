import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '@/shared/components/Layout';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { EmployeesPage } from '@/modules/employees/EmployeesPage';
import { TeamsPage } from '@/modules/teams/TeamsPage';
import { RolesPage } from '@/modules/roles/RolesPage';
import { DivisionsPage } from '@/modules/divisions/DivisionsPage';
import { ReviewCyclesPage } from '@/modules/review-cycles/ReviewCyclesPage';
import { GoalCategoriesPage } from '@/modules/templates/TemplatesPage';
import { CategoryDetailPage } from '@/modules/templates/CategoryDetailPage';
import { ScoreHintsPage } from '@/modules/score-hints/ScoreHintsPage';
import { QuestionsPage } from '@/modules/questions/QuestionsPage';
import { AssignmentsPage } from '@/modules/assignments/AssignmentsPage';
import { ReviewsPage } from '@/modules/reviews/ReviewsPage';
import { ReviewFormPage } from '@/modules/reviews/ReviewFormPage';
import { EngineerSummaryPage } from '@/modules/insights/EngineerSummaryPage';
import { DeliveryInsightPage } from '@/modules/insights/DeliveryInsightPage';
import { PeopleGrowthPage } from '@/modules/insights/PeopleGrowthPage';

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
          <Route path="/divisions" element={<DivisionsPage />} />
          <Route path="/review-cycles" element={<ReviewCyclesPage />} />
          <Route path="/goal-categories" element={<GoalCategoriesPage />} />
          <Route path="/goal-categories/:id" element={<CategoryDetailPage />} />
          <Route path="/score-hints" element={<ScoreHintsPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewFormPage />} />
          <Route path="/engineer-summary" element={<EngineerSummaryPage />} />
          <Route path="/delivery-insight" element={<DeliveryInsightPage />} />
          <Route path="/people-growth" element={<PeopleGrowthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
