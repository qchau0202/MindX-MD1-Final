import { Form, Spin } from "antd";
import CustomInput from "../../ui/CustomInput";
import ImageUploaderList from "../../ui/ImageUploaderList";

const CourseInfoForm = ({
  form,
  categories,
  categoryLoading,
  priceType,
  setPriceType,
  locationType,
  setLocationType,
  thumbnailList,
  setThumbnailList,
  courseImagesList,
  setCourseImagesList,
  onValuesChange,
}) => {
  const handlePriceTypeChange = (value) => {
    setPriceType(value);
    form.setFieldsValue({
      priceType: value,
      price: value === "Free" ? "Free" : undefined,
    });
  };

  const handleLocationTypeChange = (value) => {
    setLocationType(value);
    form.setFieldsValue({
      locationType: value,
      location: value === "Online" ? "Online" : undefined,
    });
  };

  const handleThumbnailChange = ({ fileList: newFileList }) => {
    setThumbnailList(newFileList);
    onValuesChange({}, form.getFieldsValue());
  };

  const handleCourseImagesChange = ({ fileList: newFileList }) => {
    setCourseImagesList(newFileList);
    onValuesChange({}, form.getFieldsValue());
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="space-y-8"
      initialValues={{
        level: "All level",
        capacity: "unlimited",
        price: "Free",
        priceType: "Free",
        location: "Online",
        locationType: "Online",
      }}
      onValuesChange={onValuesChange}
    >
      {/* Section: Images */}
      <div className="space-y-8 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800">
          Lessons & Images
        </h2>
        <ImageUploaderList
          fileList={thumbnailList}
          onChange={handleThumbnailChange}
          maxCount={1}
          title="Lesson Thumbnail"
          description="Upload a thumbnail for the lesson (Max 1 image, recommended size: 800x600)"
        />
        <ImageUploaderList
          fileList={courseImagesList}
          onChange={handleCourseImagesChange}
          maxCount={5}
          title="Lesson Images"
          description="Upload images for the lesson (Max 5 images, recommended size: 800x600)"
        />
      </div>

      {/* Section: Basic Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Basic Information
        </h2>
        <Form.Item
          name="title"
          label={
            <span className="font-medium text-gray-700">Lesson Title</span>
          }
          rules={[
            { required: true, message: "Please enter the course's title" },
          ]}
        >
          <CustomInput
            placeholder="Enter course title"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={<span className="font-medium text-gray-700">Description</span>}
        >
          <CustomInput
            type="textarea"
            rows={4}
            placeholder="Enter course description"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
        </Form.Item>
        <Form.Item
          name="categories"
          label={<span className="font-medium text-gray-700">Category</span>}
          rules={[{ required: true, message: "Please choose a category!" }]}
        >
          {categoryLoading ? (
            <Spin tip="Loading..." />
          ) : (
            <CustomInput
              type="select"
              placeholder="Choose a category"
              className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <CustomInput.Option key={category._id} value={category._id}>
                    {category.name}
                  </CustomInput.Option>
                ))
              ) : (
                <CustomInput.Option disabled value="">
                  No categories available
                </CustomInput.Option>
              )}
            </CustomInput>
          )}
        </Form.Item>
      </div>

      {/* Section: Additional Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Additional Information
        </h2>
        <Form.Item
          label={<span className="font-medium text-gray-700">Price</span>}
          required
        >
          <div className="flex gap-4">
            <Form.Item name="priceType" >
              <CustomInput
                type="select"
                onChange={handlePriceTypeChange}
                className="w-1/3 rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              >
                <CustomInput.Option value="Free">Free</CustomInput.Option>
                <CustomInput.Option value="Paid">Paid</CustomInput.Option>
              </CustomInput>
            </Form.Item>
            {priceType === "Paid" && (
              <Form.Item
                name="price"
                noStyle
                rules={[
                  { required: true, message: "Please enter the price!" },
                  {
                    type: "number",
                    min: 0,
                    message: "Price must be greater than or equal to 0!",
                  },
                ]}
              >
                <CustomInput
                  type="number"
                  min={0}
                  placeholder="Enter price"
                  className="w-2/3 rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                />
              </Form.Item>
            )}
          </div>
        </Form.Item>
        <Form.Item
          name="level"
          label={<span className="font-medium text-gray-700">Level</span>}
          rules={[{ required: true, message: "Please choose a level!" }]}
        >
          <CustomInput
            type="select"
            placeholder="Choose a level"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            <CustomInput.Option value="All level">
              All levels
            </CustomInput.Option>
            <CustomInput.Option value="Beginner">Beginner</CustomInput.Option>
            <CustomInput.Option value="Intermediate">
              Intermediate
            </CustomInput.Option>
            <CustomInput.Option value="Advanced">Advanced</CustomInput.Option>
          </CustomInput>
        </Form.Item>
        <Form.Item
          name="number_of_lessons"
          label={<span className="font-medium text-gray-700">Number of lessons</span>}
          rules={[
            { required: true, message: "Please enter number of lessons!" },
            {
              type: "number",
              min: 1,
              message: "Number of lessons must be greater than or equal to 1!",
            },
          ]}
        >
          <CustomInput
            type="number"
            min={1}
            placeholder="Enter number of lessons"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
        </Form.Item>
        <Form.Item
          name="duration"
          label={<span className="font-medium text-gray-700">Duration</span>}
          rules={[{ required: true, message: "Please enter the duration!" }]}
        >
          <CustomInput
            placeholder="Enter duration (e.g., 4 weeks)"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
        </Form.Item>
        <Form.Item
          name="capacity"
          label={<span className="font-medium text-gray-700">Capacity</span>}
          rules={[{ required: true, message: "Please enter capacity!" }]}
        >
          <CustomInput
            type="select"
            placeholder="Choose a capacity"
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            <CustomInput.Option value="unlimited">
              Unlimited
            </CustomInput.Option>
            <CustomInput.Option value={10}>10</CustomInput.Option>
            <CustomInput.Option value={20}>20</CustomInput.Option>
            <CustomInput.Option value={50}>50</CustomInput.Option>
            <CustomInput.Option value={100}>100</CustomInput.Option>
          </CustomInput>
        </Form.Item>
        <Form.Item
          label={<span className="font-medium text-gray-700">Location</span>}
          required
        >
          <div className="flex gap-4">
            <Form.Item name="locationType">
              <CustomInput
                type="select"
                onChange={handleLocationTypeChange}
                className="w-1/3 rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              >
                <CustomInput.Option value="Online">Online</CustomInput.Option>
                <CustomInput.Option value="Offline">Offline</CustomInput.Option>
              </CustomInput>
            </Form.Item>
            {locationType === "Offline" && (
              <Form.Item
                name="location"
                noStyle
                rules={[{ required: true, message: "Please enter location!" }]}
              >
                <CustomInput
                  placeholder="Enter location (e.g., Hanoi)" 
                  className="w-2/3 rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                />
              </Form.Item>
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default CourseInfoForm;