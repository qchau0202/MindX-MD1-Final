import { Card, Button } from "antd";
import { Link } from "react-router-dom";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const CourseCard = ({ course, viewMode }) => {
  if (viewMode === "list") {
    return (
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        {/* Image */}
        <div className="w-1/3">
          <img
            src={`https://placehold.co/300x200/?${encodeURIComponent(
              course.title
            )}`}
            alt={course.title}
            className="w-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="w-2/3 p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600">
              by{" "}
              <span className="font-medium">
                {course.provider_id?.name || "Unknown"}
              </span>{" "}
              in{" "}
              <span className="font-medium">
                {course.categories?.length > 0
                  ? course.categories.map((cat) => cat.name).join(", ")
                  : "No category"}
              </span>
            </p>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FileTextOutlined className="text-orange-500" />
              <span>{course.number_of_lessons || 0} lesson(s)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <UserOutlined className="text-orange-500" />
              <span>{course.enrolled_students || 0} student(s)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <EnvironmentOutlined className="text-orange-500" />
              <span>{course.location || "Unknown"}</span>
            </div>
          </div>
          <Link to={`/courses/${course._id}`}>
            <Button
              type="primary"
              size="large"
              className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-lg px-6 transition-all duration-200"
            >
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card
      hoverable
      cover={
        <img
          src={`https://placehold.co/300x200/?${encodeURIComponent(
            course.title
          )}`}
          alt={course.title}
          className="h-48 object-cover"
        />
      }
      className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
        <p className="text-sm text-gray-600">
          by{" "}
          <span className="font-medium">
            {course.provider_id?.name || "Unknown"}
          </span>{" "}
          in{" "}
          <span className="font-medium">
            {course.categories?.length > 0
              ? course.categories.map((cat) => cat.name).join(", ")
              : "No category"}
          </span>
        </p>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FileTextOutlined className="text-orange-500" />
          <span>{course.number_of_lessons || 0} lesson(s)</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <UserOutlined className="text-orange-500" />
          <span>{course.enrolled_students || 0} student(s)</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <EnvironmentOutlined className="text-orange-500" />
          <span>{course.location || "Unknown"}</span>
        </div>
        <div className="text-center">
          <Link to={`/courses/${course._id}`}>
            <Button
              type="primary"
              size="large"
              className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-lg px-6 transition-all duration-200"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
