import { useState } from "react";
import { login as loginAPI } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, message } from "antd";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Hàm tạo delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginAPI(values);
      const { user, token } = res.data;
      login(user, token);
      messageApi.open({
        type: "success",
        content: "Đăng nhập thành công!",
        duration: 2,
      });
      await delay(2000);
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.response?.data?.message || "Đăng nhập thất bại!",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {contextHolder}
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>
        <Form onFinish={onFinish} layout="vertical" className="space-y-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input
              size="large"
              placeholder="Nhập email của bạn"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              className="rounded-md"
            />
          </Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            size="large"
            block
            className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Đăng nhập
          </Button>
        </Form>
        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
