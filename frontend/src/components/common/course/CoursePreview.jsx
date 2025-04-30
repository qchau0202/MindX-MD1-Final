import { useEffect, useState, memo } from "react";
import { Card, Rate } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";

const CoursePreview = ({
  formValues = {},
  thumbnailList = [],
  courseImagesList = [],
  locationType = "Online",
}) => {
  const { user } = useAuth();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [courseImageUrls, setCourseImageUrls] = useState([]);

  useEffect(() => {
    if (thumbnailList.length > 0 && thumbnailList[0]?.originFileObj) {
      const url =
        thumbnailList[0].preview ||
        URL.createObjectURL(thumbnailList[0].originFileObj);
      setThumbnailUrl(url);
    } else {
      setThumbnailUrl(null);
    }

    const urls = courseImagesList
      .filter((image) => image?.originFileObj)
      .map(
        (image) => image.preview || URL.createObjectURL(image.originFileObj)
      );
    setCourseImageUrls(urls);

    return () => {
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnailList, courseImagesList, thumbnailUrl]);

  useEffect(() => {
    console.log("thumbnailList:", thumbnailList);
    console.log("courseImagesList:", courseImagesList);
  }, [thumbnailList, courseImagesList]);

  const title = formValues.title
  const description = formValues.description
  const level = formValues.level
  const number_of_lessons = formValues.number_of_lessons
  const duration = formValues.duration
  const capacity = formValues.capacity
  const location = formValues.location
  const price = formValues.price

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Side */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
          <span className="flex items-center gap-2">
            By <p className="font-semibold">{user?.name || "Provider"}</p>
          </span>
          <span className="hidden sm:block">|</span>
          <Rate disabled value={0} allowHalf className="text-sm" />
          <span>(Chưa có đánh giá)</span>
          <span className="hidden sm:block">|</span>
          <span className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600" />
            {locationType === "Online" ? "Online" : location}
          </span>
        </div>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="w-full h-64 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            onError={() => console.error("Failed to load thumbnail")}
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Chưa có thumbnail</p>
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mt-6">
            Mô tả khóa học
          </h3>
          <p className="text-base text-gray-700 mt-2 leading-relaxed">
            {description}
          </p>
        </div>
        {courseImageUrls.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mt-6">
              Ảnh khóa học
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {courseImageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Course Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]"
                  onError={() =>
                    console.error(`Failed to load course image ${index + 1}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="md:col-span-1">
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white/95 backdrop-blur-md">
          <ul className="space-y-4 text-gray-700 text-base">
            <li className="flex items-center gap-3">
              <DollarOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Giá:</strong> {price}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <UserOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Sức chứa:</strong> {capacity}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FileTextOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Trình độ:</strong> {level}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FileTextOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Thời lượng:</strong> {duration}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FileTextOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Bài học:</strong>{" "}
                {number_of_lessons}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <EnvironmentOutlined className="text-orange-500 text-lg" />
              <span>
                <strong className="font-medium">Địa điểm:</strong>{" "}
                {locationType === "Online" ? "Online" : location}
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default memo(CoursePreview);