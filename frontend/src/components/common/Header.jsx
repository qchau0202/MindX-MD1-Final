import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Tag, Dropdown, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { user, logout } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Đăng xuất thành công!",
      duration: 2,
    });
  };

  const handleLogout = () => {
    try {
      logout();
      success();
      navigate("/home")
    } catch (err) {
      console.error("Logout error:", err);
      messageApi.open({
        type: "error",
        content: "Đăng xuất thất bại!",
        duration: 2,
      });
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: "red",
      provider: "green",
      customer: "blue",
    };
    return roleColors[role] || "default";
  };

  const dropdownItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
      {contextHolder}
      <Link to="/" className="text-xl font-bold text-blue-600">
        EduPress
      </Link>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link to="/login">
              <Button type="primary" aria-label="Đăng nhập">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button aria-label="Đăng ký">Đăng ký</Button>
            </Link>
          </>
        )}

        {user && (
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottomRight"
            aria-label="Menu người dùng"
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <UserOutlined />
              <span className="font-medium">{user?.name || "Người dùng"}</span>
              <Tag color={getRoleColor(user?.role)} className="capitalize">
                {user?.role || "unknown"}
              </Tag>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Header;
