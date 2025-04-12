// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Typography,
  message as antMessage,
  Spin,
  Skeleton,
} from "antd";
import {
  getCourses,
  getUsers,
  getLessons,
  getEnrollments,
  testBackend,
} from "../../services/api";

const { Title } = Typography;

const Dashboard = () => {
  const [message, setMessage] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      testBackend()
        .then((res) => {
          console.log("testBackend response:", res);
          setMessage(res.data);
          return res.data;
        })
        .catch((err) => {
          console.error("testBackend error:", err);
          throw err;
        }),
      getUsers()
        .then((res) => {
          console.log("getUsers response:", res);
          setUsers(res.data.data || []);
          return res.data.data;
        })
        .catch((err) => {
          console.error("getUsers error:", err);
          throw err;
        }),
      getCourses()
        .then((res) => {
          console.log("getCourses response:", res);
          setCourses(res.data.data || []);
          return res.data.data;
        })
        .catch((err) => {
          console.error("getCourses error:", err);
          throw err;
        }),
      getLessons()
        .then((res) => {
          console.log("getLessons response:", res);
          setLessons(res.data.data || []);
          return res.data.data;
        })
        .catch((err) => {
          console.error("getLessons error:", err);
          throw err;
        }),
      getEnrollments()
        .then((res) => {
          console.log("getEnrollments response:", res);
          setEnrollments(res.data.data || []);
          return res.data.data;
        })
        .catch((err) => {
          console.error("getEnrollments error:", err);
          throw err;
        }),
    ])
      .catch(() => antMessage.error("Có lỗi xảy ra khi tải dữ liệu."))
      .finally(() => setLoading(false));
  }, []);

  const userColumns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
  ];

  const courseColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Mục tiêu", dataIndex: "objective", key: "objective" },
  ];

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

  const tabItems = [
    {
      key: "1",
      label: "Người dùng",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "Không có dữ liệu người dùng" }}
        />
      ),
    },
    {
      key: "2",
      label: "Khóa học",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "Không có dữ liệu khóa học" }}
        />
      ),
    },
    {
      key: "3",
      label: "Bài học",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={lessonColumns}
          dataSource={lessons}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "Không có dữ liệu bài học" }}
        />
      ),
    },
    {
      key: "4",
      label: "Đăng ký",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={enrollmentColumns}
          dataSource={enrollments}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "Không có dữ liệu đăng ký" }}
        />
      ),
    },
  ];

  return (
    <div className="h-full p-6 bg-gray-100">
      <Title level={2} className="text-center">
        Bảng điều khiển quản trị
      </Title>
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Spin size="large"/>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-6">
            Backend says: {message}
          </p>
          <Tabs defaultActiveKey="1" items={tabItems} type="card" />
        </>
      )}
    </div>
  );
};

export default Dashboard;
