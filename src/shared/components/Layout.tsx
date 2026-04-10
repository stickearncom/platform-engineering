import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  UsersRound,
  ShieldCheck,
  CalendarRange,
  LayoutTemplate,
  HelpCircle,
  ClipboardList,
  ClipboardCheck,
  LayoutDashboard,
  BarChart2,
  Truck,
  UserCheck,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'General',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
      { label: 'Employees', to: '/employees', icon: Users },
      { label: 'Teams', to: '/teams', icon: UsersRound },
      { label: 'Roles', to: '/roles', icon: ShieldCheck },
    ],
  },
  {
    label: 'Review Setup',
    items: [
      { label: 'Review Cycles', to: '/review-cycles', icon: CalendarRange },
      { label: 'Templates', to: '/templates', icon: LayoutTemplate },
      { label: 'Questions', to: '/questions', icon: HelpCircle },
      { label: 'Assignments', to: '/assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'Reviews',
    items: [
      { label: 'My Reviews', to: '/reviews', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Engineering Summary', to: '/engineer-summary', icon: BarChart2 },
      { label: 'Delivery Insights',   to: '/delivery-insight',  icon: Truck },
      { label: 'People Growth',       to: '/people-growth',     icon: UserCheck },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/teams': 'Teams',
  '/roles': 'Roles',
  '/review-cycles': 'Review Cycles',
  '/templates': 'Templates',
  '/questions': 'Questions',
  '/assignments': 'Assignments',
  '/reviews': 'My Reviews',
  '/engineer-summary': 'Engineering Summary',
  '/delivery-insight': 'Delivery Insights',
  '/people-growth': 'People Growth',
};

export function Layout() {
  const location = useLocation();
  const title = location.pathname.startsWith('/reviews/')
    ? 'Review Form'
    : (PAGE_TITLES[location.pathname] ?? 'Engineering Review');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-white border-r border-border">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-[28px] w-[28px] rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <ClipboardCheck className="h-[14px] w-[14px] text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold text-foreground tracking-tight">
              Eng Review
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
              <div className="space-y-px">
                {group.items.map((item) => (
                  <SidebarItem key={item.to} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
              AC
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-foreground leading-none mb-0.5">Alice Chen</p>
              <p className="text-[11px] text-muted-foreground truncate">Engineering Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right hand side */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-border shrink-0">
          <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-semibold text-white">
              AC
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  to,
  icon: Icon,
  end,
}: {
  label: string;
  to: string;
  icon: React.ElementType;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-2.5 h-[34px] rounded-lg text-[13px] font-medium transition-colors',
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )
      }
    >
      <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
      {label}
    </NavLink>
  );
}
