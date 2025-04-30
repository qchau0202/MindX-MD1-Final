import { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import { Link } from "react-router-dom";
import { getEnrollments } from "../../../services/api";
import { PictureOutlined } from "@ant-design/icons";

const ProfileEnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const enrollmentsRes = await getEnrollments();
        setEnrollments(enrollmentsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        messageApi.error("Could not load enrollments!");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [messageApi]);

  return (
    <div className="space-y-6">
      {contextHolder}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">
            You have not enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => (
            <Card
              key={item._id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              cover={
                <div className="h-32 bg-gray-50 flex items-center justify-center rounded-t-lg overflow-hidden">
                  {item.course_id?.image ? (
                    <img
                      src={item.course_id.image}
                      alt={item.course_id?.title || "Course"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // <PictureOutlined className="text-gray-300 text-3xl" />
                    <img src="https://placehold.co/800x400" />
                  )}
                </div>
              }
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.course_id?._id ? (
                    <Link
                      to={`/courses/${item.course_id?._id}`}
                      className="text-blue-500 hover:text-blue-600"
                      aria-label={`View ${
                        item.course_id?.title || "Unknown Course"
                      }`}
                    >
                      {item.course_id?.title || "Unknown Course"}
                    </Link>
                  ) : (
                    item.course_id?.title || "Unknown Course"
                  )}
                </h3>
                <div className="space-y-1 text-gray-600 text-sm">
                  <p>
                    <strong>Enrolled on:</strong>{" "}
                    {item.enrollment_date
                      ? new Date(item.enrollment_date).toLocaleDateString()
                      : "No enrollment date"}
                  </p>
                  <p>
                    <strong>Level:</strong> {item.course_id?.level || "N/A"}
                  </p>
                </div>
                <div className="mt-4">
                  <Link to={`/courses/${item.course_id?._id}`}>
                    <Button
                      type="primary"
                      className="bg-blue-500 hover:bg-blue-600 rounded-md text-sm w-full"
                      aria-label={`View ${
                        item.course_id?.title || "Unknown Course"
                      }`}
                    >
                      View Course
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

export default ProfileEnrolledCourses;