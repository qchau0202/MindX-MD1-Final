import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Card, Button, Tag, message } from "antd";
import { Link } from "react-router-dom";

const ProfileCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.role !== "provider") {
        messageApi.error("You do not have access to this page!");
        return;
      }

      try {
        setLoading(true);
        const response = await getProviderCourses();
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          messageApi.error("Failed to load courses!");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        messageApi.error("Error loading courses!");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, messageApi]);

  const getStatusTag = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-600",
      pending: "bg-blue-100 text-blue-600",
      approved: "bg-green-100 text-green-600",
      rejected: "bg-red-100 text-red-600",
    };
    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || colors.draft
        }`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">You have no courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  {getStatusTag(course.status)}
                </div>
                <div className="space-y-2 text-gray-600 text-sm">
                  <p>
                    <strong>Price:</strong>{" "}
                    {course.price === "Free"
                      ? "Free"
                      : `${course.price.toLocaleString()} VNĐ`}
                  </p>
                  <p>
                    <strong>Level:</strong> {course.level}
                  </p>
                  <p>
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p>
                    <strong>Lessons:</strong> {course.number_of_lessons}
                  </p>
                  <p>
                    <strong>Location:</strong> {course.location}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link to={`/courses/${course._id}`}>
                    <Button
                      type="primary"
                      className="bg-blue-500 hover:bg-blue-600 rounded-md text-sm"
                      aria-label={`View details for ${course.title}`}
                    >
                      Details
                    </Button>
                  </Link>
                  <Link to={`/courses/edit/${course._id}`}>
                    <Button
                      className="border-gray-200 hover:bg-gray-100 rounded-md text-sm"
                      aria-label={`Edit ${course.title}`}
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCourses;