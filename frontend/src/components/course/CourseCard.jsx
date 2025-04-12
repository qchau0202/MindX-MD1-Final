import { Card, Button } from "antd";
import { Link } from "react-router-dom";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const CourseCard = ({ course }) => {
  return (
    <Card
      hoverable
      cover={<img src="https://placehold.co/300x200" alt={course.title} />}
      className="transition-shadow"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-gray-600">
          by {course.provider_id?.name || "Unknown"} in{" "}
          {course.categories?.length > 0
            ? course.categories.map((cat) => cat.name).join(", ")
            : "Chưa có danh mục"}
        </p>
        <div className="flex items-center gap-2 text-gray-600">
          <FileTextOutlined />
          <span>{course.number_of_lessons} lessons</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <UserOutlined />
          <span>{course.enrolled_students || 0} students</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <EnvironmentOutlined />
          <span>{course.location}</span>
        </div>
        <Link to={`/courses/${course._id}`}>
          <Button type="primary" className="mt-4">
            Read more
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CourseCard;