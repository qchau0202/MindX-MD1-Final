import { Button, Spin } from "antd";
import { Link } from "react-router-dom";
import CourseCard from "../course/CourseCard";

const FeaturedCoursesSection = ({coursesLoading, courses}) => {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
            <p className="text-lg text-gray-600">Explore our Popular Courses</p>
          </div>
          <div className="text-right">
            <Link to="/courses">
              <Button type="primary" size="large" className="bg-blue-600">
                All Courses
              </Button>
            </Link>
          </div>
        </div>

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
                  No courses available at the moment.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
}
export default FeaturedCoursesSection;