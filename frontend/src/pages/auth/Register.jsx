import { useState } from "react";
import { register as registerAPI } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const submitValues = {
        ...values,
        role: "customer",
      };
      await registerAPI(submitValues);
      messageApi.open({
        type: "success",
        content: "Register successfully!",
        duration: 2,
      });
      await delay(2000);
      navigate("/home");
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.response?.data?.message || "Register failed!",
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
          Register
        </h2>
        <Form onFinish={onFinish} layout="vertical" className="space-y-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              size="large"
              placeholder="Enter your name"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
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
              placeholder="Enter your password"
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
            Register
          </Button>
        </Form>
        <p className="mt-4 text-center text-gray-600">
          Already had an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
