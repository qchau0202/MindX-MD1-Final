import Header from "../components/Common/Header";
import Sidebar from "../components/common/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-grow overflow-hidden p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
