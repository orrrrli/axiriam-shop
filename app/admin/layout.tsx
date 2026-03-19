import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/common/organisms/AdminNavbar';
import AdminContentWrapper from '@/components/transitions/AdminContentWrapper';

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
