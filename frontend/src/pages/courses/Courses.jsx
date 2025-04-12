import { useState, useEffect } from "react";
import { Spin, message } from "antd";
import { getCourses } from "../../services/api";
import CourseCard from "../../components/course/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getCourses();
        setCourses(res.data.data || []);
      } catch (err) {
        message.error("Lỗi khi tải danh sách khóa học!", 3);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">All Courses</h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          Khám phá tất cả khóa học của chúng tôi
        </p>
        {loading ? (
          <div className="text-center">
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                Chưa có khóa học nào
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
