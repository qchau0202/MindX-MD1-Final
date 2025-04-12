import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, message, Rate } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { getCourseById, enrollCourse, getEnrollments } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (loading) return; // Chờ session khôi phục
      setLoadingCourse(true);
      try {
        // Lấy khóa học
        const courseRes = await getCourseById(id);
        console.log("API response (getCourseById):", courseRes);
        if (courseRes.data.success) {
          setCourse(courseRes.data.data);
        } else {
          throw new Error("API không trả về dữ liệu hợp lệ");
        }

        // Kiểm tra trạng thái đăng ký
        if (user && token) {
          const enrollRes = await getEnrollments();
          console.log("API response (getEnrollments):", enrollRes);
          const userEnrollment = enrollRes.data.data.find(
            (e) =>
              e.customer_id._id.toString() === user._id &&
              e.course_id._id.toString() === id
          );
          setIsEnrolled(!!userEnrollment);
        }
      } catch (err) {
        message.error("Lỗi khi tải khóa học!", 3);
        console.error("Error fetching course/enrollment:", err);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourseAndEnrollment();
  }, [id, user, token, loading]);

  const handleEnroll = async () => {
    if (!course) return;

    console.log("Auth state:", { user, token });
    if (!user || !token) {
      message.warning("Vui lòng đăng nhập để đăng ký khóa học!", 3);
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      console.log("Sending enroll request:", { course_id: id, token });
      const res = await enrollCourse({ course_id: id });
      console.log("Enroll response:", res);
      if (res.data.success) {
        message.success("Đăng ký khóa học thành công!", 3);
        setIsEnrolled(true);
      } else {
        throw new Error(res.data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Error enrolling course:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
      });
      message.error(
        err.response?.data?.message || "Lỗi khi đăng ký khóa học!",
        3
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || loadingCourse) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold">Khóa học không tồn tại</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold">{course.title}</h2>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                By{" "}
                <p className="font-bold">
                  {course.provider_id?.name || "Không xác định"}
                </p>
              </span>
              <span>|</span>
              <Rate disabled value={course.rating || 0} allowHalf />
              <span>({course.rating || "0"} đánh giá)</span>
              <span>|</span>
              <EnvironmentOutlined />
              <span>{course.location || "Không xác định"}</span>
            </div>
            <img
              src={`https://placehold.co/800x400/?${encodeURIComponent(
                course.title
              )}`}
              alt={course.title}
              className="w-full object-cover rounded-lg shadow"
            />
            <div>
              <h3 className="text-xl font-semibold mt-4">Mô tả khóa học</h3>
              <p className="text-gray-700">
                {course.description || "Chưa có mô tả"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-1">
            <Card className="shadow-lg">
              <ul className="space-y-4 text-gray-700 text-base">
                <li className="flex items-center gap-2">
                  <DollarOutlined className="text-orange-500" />
                  <span>
                    <strong>Giá:</strong>{" "}
                    {course.price === "Free"
                      ? "Miễn phí"
                      : `${course.price.toLocaleString()} VNĐ`}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <UserOutlined className="text-orange-500" />
                  <span>
                    <strong>Sức chứa:</strong>{" "}
                    {course.capacity === "unlimited"
                      ? "Không giới hạn"
                      : course.capacity || "Không xác định"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileTextOutlined className="text-orange-500" />
                  <span>
                    <strong>Trình độ:</strong>{" "}
                    {course.level || "Không xác định"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileTextOutlined className="text-orange-500" />
                  <span>
                    <strong>Thời lượng:</strong>{" "}
                    {course.duration || "Không xác định"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileTextOutlined className="text-orange-500" />
                  <span>
                    <strong>Bài học:</strong> {course.number_of_lessons || 0}
                  </span>
                </li>
              </ul>
              <Button
                type="primary"
                size="large"
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                onClick={handleEnroll}
                loading={enrolling}
                disabled={enrolling || isEnrolled}
              >
                {isEnrolled ? "Đã đăng ký" : "Đăng ký Ngay"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;