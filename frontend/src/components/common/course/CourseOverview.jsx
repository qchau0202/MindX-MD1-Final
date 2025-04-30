import { Rate } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

const CourseOverview = ({ course }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
        <span className="flex items-center gap-2">
          <ClockCircleOutlined className="text-orange-500" />
          Duration: {course.duration || "Unknown"}
        </span>
        <span className="flex items-center gap-2">
          <TeamOutlined className="text-orange-500" />
          {course.capacity === "unlimited"
            ? "unlimited"
            : `${course.capacity || 0} học viên`}
        </span>
        <span className="flex items-center gap-2">
          <FileTextOutlined className="text-orange-500" />
          {course.level || "Unknown"}
        </span>
        <span className="flex items-center gap-2">
          <FileTextOutlined className="text-orange-500" />
          {course.number_of_lessons || 0} lessons
        </span>
        <span className="flex items-center gap-2">
          <CheckSquareOutlined className="text-orange-500" />3 quizzes
        </span>
      </div>

      <img
        src={`https://placehold.co/800x400/?${encodeURIComponent(
          course.title
        )}`}
        alt={course.title}
        className="w-full h-64 object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
      />

      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
        <span className="flex items-center gap-2">
          By{" "}
          <p className="font-semibold">
            {course.provider_id?.name || "Unknown"}
          </p>
        </span>
        <Rate
          disabled
          value={course.rating || 0}
          allowHalf
          className="text-sm"
        />
        <span>({course.rating || "0"} rating)</span>
        <span className="flex items-center gap-2">
          <EnvironmentOutlined className="text-orange-500" />
          {course.location || "Unknown"}
        </span>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Course Description
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          {course.description || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default CourseOverview;
