import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Tag, Dropdown, message } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Header = () => {
  const { user, logout } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Logout successfuly!",
      duration: 2,
    });
  };

  const handleLogout = () => {
    try {
      logout();
      success();
      navigate("/home");
    } catch (err) {
      console.error("Logout error:", err);
      messageApi.open({
        type: "error",
        content: "Logout error!",
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
      key: "profile",
      icon: <ProfileOutlined />,
      label: "My profile",
      onClick: () => navigate("/profile"),
    },
    ...(user?.role === "provider"
      ? [
          {
            key: "create-course",
            icon: <PlusOutlined />,
            label: "Create course",
            onClick: () => navigate("/profile/provider/create"),
          },
        ]
      : []),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log out",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
      {contextHolder}
      <Link
        to="/"
        className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        EduPress
      </Link>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link to="/login">
              <Button
                type="primary"
                aria-label="Login"
                className="bg-blue-600 hover:bg-blue-700 transition-all rounded-lg"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                aria-label="Register"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all rounded-lg"
              >
                Register
              </Button>
            </Link>
          </>
        )}

        {user && (
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottomRight"
            trigger={["hover"]}
            aria-label="User menu"
          >
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all">
              <UserOutlined className="text-blue-600 text-lg" />
              <span className="font-medium text-gray-800">
                {user?.name || "User"}
              </span>
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