import { useState, useEffect } from "react";
import { getCategoryCounts, getCourses } from "../services/api";
import FeedbackSection from "../components/common/home/FeedbackSection";
import StatisticsSection from "../components/common/home/StatisticsSection";
import FeaturedCoursesSection from "../components/common/home/FeaturedCoursesSection";
import TopCategoriesSection from "../components/common/home/TopCategoriesSection";
import HeroSection from "../components/common/home/HeroSection";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoryCountsRes] = await Promise.all([
          getCourses(),
          getCategoryCounts(),
        ]);

        const coursesData = coursesRes.data.data || [];
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
      } finally {
        setCoursesLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen px-4 py-8">
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* Top Categories Section */}
      <section className="py-16">
        <TopCategoriesSection
          categoriesLoading={categoriesLoading}
          categories={categories}
        />
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white">
        <FeaturedCoursesSection
          coursesLoading={coursesLoading}
          courses={courses}
        />
      </section>
      {/* Statistics Section */}
      <section className="py-16 bg-gray-100">
        <StatisticsSection />
      </section>
      {/* Student Feedback Section */}
      <section className="py-16 bg-white">
        <FeedbackSection />
      </section>
    </div>
  );
};

export default Home;
