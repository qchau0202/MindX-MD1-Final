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
} from "../../services/api";

const { Title } = Typography;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
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
      .catch(() => antMessage.error("Error loading data!"))
      .finally(() => setLoading(false));
  }, []);

  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  const courseColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Goal", dataIndex: "objective", key: "objective" },
  ];

  const lessonColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Video", dataIndex: "video_url", key: "video_url" },
    { title: "Order", dataIndex: "order", key: "order" },
    {
      title: "Course",
      key: "course",
      render: (_, record) => record.course_id?.title || "N/A",
    },
  ];

  const enrollmentColumns = [
    {
      title: "Student",
      key: "user",
      render: (_, record) => record.customer_id?.name || "N/A",
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.customer_id?.email || "N/A",
    },
    {
      title: "Course",
      key: "course",
      render: (_, record) => record.course_id?.title || "N/A",
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollment_date",
      key: "enrollment_date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "User",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "No user data" }}
        />
      ),
    },
    {
      key: "2",
      label: "Course",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "No course data" }}
        />
      ),
    },
    {
      key: "3",
      label: "Lesson",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={lessonColumns}
          dataSource={lessons}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "No lesson data" }}
        />
      ),
    },
    {
      key: "4",
      label: "Enrollment",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={enrollmentColumns}
          dataSource={enrollments}
          rowKey="_id"
          scroll={{ y: "calc(100vh - 250px)" }}
          locale={{ emptyText: "No enrollment data" }}
        />
      ),
    },
  ];

  return (
    <div className="h-full p-6 bg-gray-100">
      <Title level={2} className="text-center">
        Dashboard
      </Title>
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-6">
            Message: {message}
          </p>
          <Tabs defaultActiveKey="1" items={tabItems} type="card" />
        </>
      )}
    </div>
  );
};

export default Dashboard;
