import { Card, Button, Tooltip } from "antd";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";

const CourseInfoCard = ({
  course,
  isEnrolled,
  unenrolling,
  handleUnenroll,
}) => {
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md transition-all duration-300 hover:shadow-xl">
      <ul className="space-y-5 text-gray-700 text-base">
        <li className="flex items-center gap-3">
          <UserOutlined className="text-orange-500 text-lg" />
          <span>
            <strong className="font-medium">Capacity:</strong>{" "}
            {course.capacity || "Unknown"}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <FileTextOutlined className="text-orange-500 text-lg" />
          <span>
            <strong className="font-medium">Level:</strong>{" "}
            {course.level || "Unknown"}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <FileTextOutlined className="text-orange-500 text-lg" />
          <span>
            <strong className="font-medium">Duration:</strong>{" "}
            {course.duration || "Unknown"}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <FileTextOutlined className="text-orange-500 text-lg" />
          <span>
            <strong className="font-medium">Lesson:</strong>{" "}
            {course.number_of_lessons || 0}
          </span>
        </li>
      </ul>
      {isEnrolled ? (
        <div className="flex gap-3 mt-6">
          <Tooltip title="You are already enrolled in this course">
            <Button
              type="primary"
              size="large"
              className="flex-1 bg-green-500 hover:bg-green-600 rounded-lg"
              disabled
            >
              Enrolled
            </Button>
          </Tooltip>
          <Button
            type="default"
            size="large"
            className="flex-1 hover:bg-gray-100 rounded-lg"
            onClick={handleUnenroll}
            loading={unenrolling}
            disabled={unenrolling}
          >
            Unenroll
          </Button>
        </div>
      ) : null}
    </Card>
  );
};

export default CourseInfoCard;
