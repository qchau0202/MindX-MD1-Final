import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AddLessons = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-xl"
      >
        Add lessons
      </Button>
      <p className="text-gray-500 mt-4">
        Adding lessons functionality will be implemented later.
      </p>
    </div>
  );
};

export default AddLessons;
