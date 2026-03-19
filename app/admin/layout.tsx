import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/common/organisms/AdminNavbar';
import AdminContentWrapper from '@/components/transitions/AdminContentWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="content-admin">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar />
        <AdminContentWrapper>{children}</AdminContentWrapper>
      </div>
    </div>
  );
}
