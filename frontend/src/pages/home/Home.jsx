import { useState, useEffect } from "react";
import { Spin, message, Card, Button } from "antd";
import { Link } from "react-router-dom";
import {
  PictureOutlined,
  CodeOutlined,
  CommentOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  ShopOutlined,
  EditOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { getCategoryCounts, getCourses } from "../../services/api";
import CourseCard from "../../components/course/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Map danh mục với icon
  const categoryIcons = {
    "art & design": <PictureOutlined className="text-3xl text-blue-600" />,
    development: <CodeOutlined className="text-3xl text-blue-600" />,
    communication: <CommentOutlined className="text-3xl text-blue-600" />,
    videography: <VideoCameraOutlined className="text-3xl text-blue-600" />,
    photography: <CameraOutlined className="text-3xl text-blue-600" />,
    marketing: <ShopOutlined className="text-3xl text-blue-600" />,
    "content writing": <EditOutlined className="text-3xl text-blue-600" />,
    "finance & bank": <BankOutlined className="text-3xl text-blue-600" />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoryCountsRes] = await Promise.all([
          getCourses(),
          getCategoryCounts(),
        ]);

        const coursesData = coursesRes.data.data || [];
        // Sắp xếp theo enrolled_students giảm dần, lấy 8 khóa học
        const sortedCourses = coursesData
          .sort(
            (a, b) => (b.enrolled_students || 0) - (a.enrolled_students || 0)
          )
          .slice(0, 8);
        setCourses(sortedCourses);

        const rawCategories = categoryCountsRes.data?.data;
        const categoriesData = Array.isArray(rawCategories)
          ? rawCategories
              .sort((a, b) => b.courseCount - a.courseCount)
              .slice(0, 8)
          : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        message.error("Lỗi khi tải dữ liệu, vui lòng thử lại!", 3);
      } finally {
        setCoursesLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Khám phá Tri thức Mới
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Học mọi lúc, mọi nơi với EduPress. Khám phá các khóa học đa dạng từ
            các chuyên gia hàng đầu.
          </p>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Top Categories
          </h2>
          {categoriesLoading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Card
                    key={category._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {categoryIcons[category.name.toLowerCase()] || (
                        <PictureOutlined className="text-3xl text-blue-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-gray-600">
                          {category.courseCount} khóa học
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  Chưa có danh mục nào
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Explore our Popular Courses
          </p>
          {coursesLoading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
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
              <div className="text-center mt-12">
                <Link to="/courses">
                  <Button type="primary" size="large" className="bg-blue-600">
                    All Courses
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
