import { useEffect, useState } from "react";
import { Tabs, Table, Typography, message as antMessage } from "antd";
import {
  getCourses,
  getUsers,
  getLessons,
  getEnrollments,
  testBackend,
} from "../../services/api";

const { Title } = Typography;

const Home = () => {
  const [message, setMessage] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    testBackend()
      .then((res) => setMessage(res.data))
      .catch(() => setMessage("Không thể kết nối Backend"));

    getUsers()
      .then((res) => setUsers(res.data.data))
      .catch(() => antMessage.error("Lỗi khi lấy Users"));

    getCourses()
      .then((res) => setCourses(res.data.data))
      .catch(() => antMessage.error("Lỗi khi lấy Courses"));

    getLessons()
      .then((res) => setLessons(res.data.data))
      .catch(() => antMessage.error("Lỗi khi lấy Lessons"));

    getEnrollments()
      .then((res) => setEnrollments(res.data.data))
      .catch(() => antMessage.error("Lỗi khi lấy Enrollments"));
  }, []);

  // Cột bảng Users
  const userColumns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
  ];

  // Cột bảng Courses
  const courseColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Mục tiêu", dataIndex: "objective", key: "objective" },
  ];

  // Cột bảng Lessons
  const lessonColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Video", dataIndex: "video_url", key: "video_url" },
    { title: "Thứ tự", dataIndex: "order", key: "order" },
    {
      title: "Khóa học",
      key: "course",
      render: (_, record) => record.course_id?.title || "N/A",
    },
  ];

  // Cột bảng Enrollments
  const enrollmentColumns = [
    {
      title: "Người học",
      key: "user",
      render: (_, record) => record.customer_id?.name || "N/A",
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.customer_id?.email || "N/A",
    },
    {
      title: "Khóa học",
      key: "course",
      render: (_, record) => record.course_id?.title || "N/A",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "enrollment_date",
      key: "enrollment_date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-4">
      <Title level={2} className="text-center">
        EduPress Dashboard
      </Title>
      <p className="text-center text-gray-600 mb-6">Backend says: {message}</p>

      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Users" key="1">
          <Table columns={userColumns} dataSource={users} rowKey="_id" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Courses" key="2">
          <Table columns={courseColumns} dataSource={courses} rowKey="_id" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Lessons" key="3">
          <Table columns={lessonColumns} dataSource={lessons} rowKey="_id" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Enrollments" key="4">
          <Table
            columns={enrollmentColumns}
            dataSource={enrollments}
            rowKey="_id"
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
