import { Card, Form, Input, Button, Tooltip } from "antd";
import { UserOutlined, MailOutlined, EditOutlined } from "@ant-design/icons";

const ProfileInfoCard = ({
  userData,
  editing,
  form,
  handleEdit,
  handleCancel,
  handleSubmit,
}) => {
  return (
    <Card className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Profile Details
          </h2>
          {!editing && (
            <Tooltip title="Edit profile">
              <Button
                type="text"
                icon={<EditOutlined className="text-blue-500 text-lg" />}
                onClick={handleEdit}
                className="hover:bg-blue-50 rounded-full p-2"
                aria-label="Edit profile information"
              />
            </Tooltip>
          )}
        </div>
        {editing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label={<span className="font-medium text-gray-700">Name</span>}
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                className="rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={<span className="font-medium text-gray-700">Email</span>}
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Email is invalid!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                className="rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </Form.Item>
            <div className="flex space-x-2">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-600 rounded-md text-sm"
                aria-label="Save profile changes"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                className="border-gray-200 hover:bg-gray-100 rounded-md text-sm"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="text-blue-500 mr-2" />
              <span>
                <strong className="font-medium">Name:</strong>{" "}
                {userData?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <MailOutlined className="text-blue-500 mr-2" />
              <span>
                <strong className="font-medium">Email:</strong>{" "}
                {userData?.email || "N/A"}
              </span>
            </div>
            <div>
              <strong className="font-medium">Role:</strong>{" "}
              <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {userData?.role || "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileInfoCard;