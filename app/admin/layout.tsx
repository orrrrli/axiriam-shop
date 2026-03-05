import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-admin">
      <Navbar />
      <AdminSidebar />
      <div className="content-admin-wrapper">
        {children}
      </div>
    </div>
  );
}
