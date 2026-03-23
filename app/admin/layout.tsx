import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { AdminNavbar } from '@/components/admin/common/organisms/admin-navbar';
import AdminContentWrapper from '@/components/transitions/admin-content-wrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

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
