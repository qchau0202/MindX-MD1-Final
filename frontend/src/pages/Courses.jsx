import { useState, useEffect } from "react";
import { Spin, message, Input } from "antd";
import { Link } from "react-router-dom";
import { getCourses, getCategoryCounts } from "../services/api";
import CourseCard from "../components/common/course/CourseCard";
import FilterForm from "../components/common/FilterForm";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await getCourses();
        const coursesData = coursesRes.data.data || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);

        const categoryCountsRes = await getCategoryCounts();
        setCategoryCounts(categoryCountsRes.data.data || []);
      } catch (err) {
        message.error("Error loading data!", 3);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleFilter = (filters) => {
    let filtered = [...courses];

    if (filters.category) {
      filtered = filtered.filter((course) =>
        course.categories?.some((cat) => cat.name === filters.category)
      );
    }
    if (filters.author) {
      filtered = filtered.filter(
        (course) => course.provider_id?.name === filters.author
      );
    }
    if (filters.price) {
      filtered = filtered.filter((course) => {
        if (filters.price === "free") return course.price === 0;
        if (filters.price === "paid") return course.price > 0;
        return true;
      });
    }
    if (filters.level) {
      filtered = filtered.filter((course) => course.level === filters.level);
    }
    if (filters.rating) {
      filtered = filtered.filter((course) => course.rating >= filters.rating);
    }

    setFilteredCourses(filtered);
  };

  const handleReset = () => {
    setFilteredCourses(courses);
    setSearchTerm("");
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Courses</li>
          </ol>
        </nav>

        <h2 className="text-3xl font-bold text-center mb-4">All Courses</h2>
        <p className="text-lg text-center text-gray-600 mb-8">
          Explore our courses and start learning today!
        </p>

        <div className="flex gap-6">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center gap-4 mb-8">
              <div className="w-1/3">
                <Input
                  placeholder="Search courses..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <AppstoreOutlined />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <UnorderedListOutlined />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center">
                <Spin size="large" tip="Loading..." />
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-600 col-span-full">
                    No courses found
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="w-80">
            <FilterForm
              onFilter={handleFilter}
              onReset={handleReset}
              categoryCounts={categoryCounts}
              courses={courses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
