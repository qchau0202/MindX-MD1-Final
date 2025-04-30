import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Spin, message, Avatar } from "antd";
import ProfileEnrolledCourses from "../components/common/profile/ProfileEnrolledCourses";
import ProfileInfoCard from "../components/common/profile/ProfileInfoCard";
import ProfileCourses from "../components/common/profile/ProfileCourses";
import { getCurrentUser } from "../services/api";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRes = await getCurrentUser();
        setUserData(userRes.data.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        messageApi.error("Failed to load user data!");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, messageApi]);

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      name: userData?.name,
      email: userData?.email,
    });
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setUpdating(true);
      // Call the API to update the user profile
      // await updateUserProfile(values);
      setUserData({ ...userData, ...values });
      setEditing(false);
      messageApi.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      messageApi.error("Profile update failed!");
    } finally {
      setUpdating(false);
    }
  };

  const isProvider = userData?.role === "provider";

  return (
    <div className="min-h-screen">
      {contextHolder}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Section: Profile Information */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar
                      size={100}
                      icon={<UserOutlined />}
                      src={userData?.avatar}
                      className="bg-blue-500 shadow-md"
                      aria-label="User avatar"
                    />
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {userData?.name || "User"}
                      </h1>
                      <p className="text-gray-500 text-base">
                        {userData?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <ProfileInfoCard
                  userData={userData}
                  editing={editing}
                  loading={updating}
                  form={form}
                  handleEdit={handleEdit}
                  handleCancel={handleCancel}
                  handleSubmit={handleSubmit}
                />
              </div>

              {/* Right Section: Enrolled Courses */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Enrolled Courses
                </h2>
                <ProfileEnrolledCourses />
              </div>
            </div>

            {/* Provider Courses (if applicable) */}
            {isProvider && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  My Courses
                </h2>
                <ProfileCourses />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;