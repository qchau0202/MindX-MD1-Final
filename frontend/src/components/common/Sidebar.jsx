import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { DashboardOutlined, UserOutlined } from "@ant-design/icons";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">User management</Link>,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-full sticky top-0 z-10">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="h-full"
      />
    </div>
  );
};

export default Sidebar;
