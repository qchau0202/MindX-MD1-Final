import { useState } from "react";
import { login as loginAPI } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, message } from "antd";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginAPI(values);
      const { user, token } = res.data;
      login(user, token);
      messageApi.open({
        type: "success",
        content: "Login successfully!",
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
        content: err.response?.data?.message || "Login failed!",
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
          Login
        </h2>
        <Form onFinish={onFinish} layout="vertical" className="space-y-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Please enter your password"
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
            Login
          </Button>
        </Form>
        <p className="mt-4 text-center text-gray-600">
          Dont have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
