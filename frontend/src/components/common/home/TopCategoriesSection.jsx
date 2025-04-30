import { BankOutlined, CameraOutlined, CodeOutlined, CommentOutlined, EditOutlined, PictureOutlined, ShopOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Card, Spin } from "antd";
import { Link } from "react-router-dom";

const TopCategoriesSection = ({ categoriesLoading, categories }) => {
  const categoryIcons = {
    "art & design": <PictureOutlined className="text-3xl text-blue-600" />,
    development: <CodeOutlined className="text-3xl text-blue-600" />,
    communication: <CommentOutlined className="text-3xl text-blue-600" />,
    videography: <VideoCameraOutlined className="text-3xl text-blue-600" />,
    photography: <CameraOutlined className="text-3xl text-blue-600" />,
    marketing: <ShopOutlined className="text-3xl text-blue-600" />,
    "content writing": <EditOutlined className="text-3xl text-blue-600" />,
    "finance & bank": <BankOutlined className="text-3xl text-blue-600" />,
  };
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h2 className="text-3xl font-bold mb-2">Top categories</h2>
          <p className="text-lg text-gray-600">
            Explore our Popular Categories
          </p>
        </div>
        <div className="text-right">
          <Link to="/courses">
            <Button type="primary" size="large" className="bg-blue-600">
              All Categories
            </Button>
          </Link>
        </div>
      </div>
      {categoriesLoading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Card
                key={category._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {categoryIcons[category.name.toLowerCase()] || (
                    <PictureOutlined className="text-3xl text-blue-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-gray-600">
                      {category.courseCount} courses
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">No categories</p>
          )}
        </div>
      )}
    </div>
  );
};
export default TopCategoriesSection;
