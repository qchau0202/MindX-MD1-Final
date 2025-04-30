import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Tabs, Button } from "antd";
import { useAuth } from "../contexts/AuthContext";
import {
  getCourseById,
  enrollCourse,
  unenrollCourse,
  getEnrollments,
} from "../services/api";
import CourseOverview from "../components/common/course/CourseOverview";
import CourseInfoCard from "../components/common/course/CourseInfoCard";
import CommentForm from "../components/common/CommentForm";

const { TabPane } = Tabs;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (loading) return;
      setLoadingCourse(true);
      try {
        if (!id || id === "undefined") {
          throw new Error("Invalid course ID");
        }

        const courseRes = await getCourseById(id);
        if (courseRes.data.success) {
          setCourse(courseRes.data.data);
        } else {
          throw new Error("API did not return valid data");
        }

        if (user && token) {
          const enrollRes = await getEnrollments();
          const userEnrollment = enrollRes.data.data.find(
            (e) =>
              e.customer_id._id.toString() === user._id &&
              e.course_id._id.toString() === id &&
              e.enrolled_status === true
          );
          setIsEnrolled(!!userEnrollment);
        }
      } catch (err) {
        message.error(err.message || "Error loading course!", 3);
        console.error("Error fetching course/enrollment:", err);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourseAndEnrollment();
  }, [id, user, token, loading]);

  const handleEnroll = async () => {
    if (!course) return;

    if (!user || !token) {
      message.warning("Please login to enroll in the course!", 3);
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const res = await enrollCourse({ course_id: id });
      if (res.data.success) {
        message.success("Course enrollment successful!", 3);
        setIsEnrolled(true);
      } else {
        throw new Error(res.data.message || "Enrollment failed");
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Error during course enrollment!"
      );
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!course) return;

    setUnenrolling(true);
    try {
      const res = await unenrollCourse({ course_id: id });
      if (res.data.success) {
        message.success("Course unenrollment successful!", 3);
        setIsEnrolled(false);
      } else {
        throw new Error(res.data.message || "Unenrollment failed");
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Error during course unenrollment!"
      );
    } finally {
      setUnenrolling(false);
    }
  };

  if (loading || loadingCourse) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">
          Course does not exist
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title and price */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {course.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <span className="text-xl text-gray-500 line-through">
              {course.price === "Free"
                ? "Free"
                : `${(course.price * 1.2).toLocaleString()} VND`}
            </span>
            <span className="text-2xl font-semibold text-orange-500">
              {course.price === "Free"
                ? "Free"
                : `${course.price.toLocaleString()} VND`}
            </span>
            <Button
              type="primary"
              size="large"
              className="bg-orange-500 hover:bg-orange-600 rounded-lg px-6"
              onClick={handleEnroll}
              loading={enrolling}
              disabled={isEnrolled || enrolling}
            >
              {isEnrolled ? "Enrolled" : "Enroll Now"}
            </Button>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs defaultActiveKey="1" className="mb-6">
              <TabPane tab="Overview" key="1">
                <CourseOverview course={course} />
              </TabPane>
              <TabPane tab="Curriculum" key="2">
                <p>No content available for this section yet.</p>
              </TabPane>
              <TabPane tab="Instructor" key="3">
                <p>No content available for this section yet.</p>
              </TabPane>
              <TabPane tab="FAQs" key="4">
                <p>No content available for this section yet.</p>
              </TabPane>
              <TabPane tab="Reviews" key="5">
                <p>No content available for this section yet.</p>
              </TabPane>
            </Tabs>

            {/* Comment form */}
            <CommentForm />
          </div>
          <div className="md:col-span-1">
            <CourseInfoCard
              course={course}
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              unenrolling={unenrolling}
              handleEnroll={handleEnroll}
              handleUnenroll={handleUnenroll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;