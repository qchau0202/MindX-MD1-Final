import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message, Form, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { createCourse, getCategoryCounts } from "../services/api";
import CourseInfoForm from "../components/common/course/CourseInfoForm";
import AddLessons from "../components/common/course/AddLessons";
import CoursePreview from "../components/common/course/CoursePreview";
import debounce from "lodash/debounce";
import { CheckCircleOutlined } from "@ant-design/icons";

const CourseCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [priceType, setPriceType] = useState("Free");
  const [locationType, setLocationType] = useState("Online");
  const [thumbnailList, setThumbnailList] = useState([]);
  const [courseImagesList, setCourseImagesList] = useState([]);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await getCategoryCounts();
        if (res.data.success && res.data.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        } else {
          setCategories([]);
          messageApi.warning("Categories not found!");
        }
      } catch (error) {
        setCategories([]);
        console.error("Error fetching categories:", error);
        messageApi.error("Unable to load categories list!");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, [messageApi]);

  const areRequiredFieldsFilled = (values) => {
    const requiredFields = [
      "title",
      "price",
      "number_of_lessons",
      "duration",
      "location",
      "categories",
    ];
    return requiredFields.every(
      (field) => values[field] !== undefined && values[field] !== ""
    );
  };

  const autoSaveCourse = useCallback(
    debounce(async (values, thumbnailList, courseImagesList) => {
      if (user?.role !== "provider") {
        messageApi.error("Only providers can create courses!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        messageApi.error("You need to login to create a course!");
        return;
      }

      if (!areRequiredFieldsFilled(values)) {
        return;
      }

      try {
        const courseData = new FormData();
        courseData.append("title", values.title);
        courseData.append("description", values.description || "");
        if (values.categories) {
          courseData.append("categories", values.categories);
        }
        courseData.append("price", values.price);
        courseData.append("level", values.level || "All level");
        courseData.append("number_of_lessons", values.number_of_lessons);
        courseData.append("duration", values.duration);
        courseData.append("capacity", values.capacity || "unlimited");
        courseData.append("location", values.location);
        courseData.append("status", "draft");

        if (thumbnailList.length > 0 && thumbnailList[0].originFileObj) {
          courseData.append("thumbnail", thumbnailList[0].originFileObj);
        }
        if (courseImagesList.length > 0) {
          courseImagesList.forEach((file) => {
            courseData.append("courseImages", file.originFileObj);
          });
        }

        const response = await createCourse(courseData);
        if (response.data.success) {
          setCourseId(response.data.data._id);
          messageApi.success("Draft automatically saved!");
        }
      } catch (err) {
        messageApi.error("Auto-save failed: " + err.message);
      }
    }, 2000),
    [user, messageApi]
  );

  const handleSubmit = async () => {
    if (user?.role !== "provider") {
      messageApi.error("Only providers can create courses!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      messageApi.error("You need to login to create a course!");
      return;
    }

    try {
      setLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      const courseData = new FormData();
      courseData.append("title", values.title);
      courseData.append("description", values.description || "");
      if (values.categories) {
        courseData.append("categories", values.categories);
      }
      courseData.append("price", values.price);
      courseData.append("level", values.level || "All level");
      courseData.append("number_of_lessons", values.number_of_lessons);
      courseData.append("duration", values.duration);
      courseData.append("capacity", values.capacity || "unlimited");
      courseData.append("location", values.location);
      courseData.append("status", "pending");

      if (thumbnailList.length > 0 && thumbnailList[0].originFileObj) {
        courseData.append("thumbnail", thumbnailList[0].originFileObj);
      }
      if (courseImagesList.length > 0) {
        courseImagesList.forEach((file) => {
          courseData.append("courseImages", file.originFileObj);
        });
      }

      await createCourse(courseData);
      messageApi.success(
        "Course has been successfully submitted for approval!"
      );
      form.resetFields();
      setThumbnailList([]);
      setCourseImagesList([]);
      setCurrentStep(0);
      setCourseId(null);
      navigate("/courses");
    } catch (err) {
      messageApi.error("Operation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.log("Validation failed:", error);
        messageApi.error(
          "Please fill in all required information before proceeding!"
        );
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Basic Information",
      description: "Add course information and images",
      content: (
        <CourseInfoForm
          form={form}
          categories={categories}
          categoryLoading={categoryLoading}
          priceType={priceType}
          setPriceType={setPriceType}
          locationType={locationType}
          setLocationType={setLocationType}
          thumbnailList={thumbnailList}
          setThumbnailList={setThumbnailList}
          courseImagesList={courseImagesList}
          setCourseImagesList={setCourseImagesList}
          onValuesChange={(changedValues, allValues) => {
            autoSaveCourse(allValues, thumbnailList, courseImagesList);
          }}
        />
      ),
    },
    {
      title: "Add Lessons",
      description: "Create detailed lesson content",
      content: <AddLessons />,
    },
    {
      title: "Preview",
      description: "Review and confirm course",
      content: (
        <CoursePreview
          formValues={form.getFieldsValue(true)}
          thumbnailList={thumbnailList}
          courseImagesList={courseImagesList}
          priceType={priceType}
          locationType={locationType}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      {contextHolder}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Follow the steps to create your course. The course will be
            automatically saved as a draft.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (Steps) */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Course Creation Steps
              </h2>
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                      currentStep === index
                        ? "bg-blue-50 border border-blue-200"
                        : currentStep > index
                        ? "bg-green-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep === index
                          ? "bg-blue-500 text-white"
                          : currentStep > index
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {currentStep > index ? (
                        <CheckCircleOutlined />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-base font-medium ${
                          currentStep === index
                            ? "text-blue-600"
                            : currentStep > index
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Breadcrumb */}
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="flex space-x-2 text-gray-600">
                  <li>
                    <Link to="/" className="hover:text-blue-600">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link to="/courses" className="hover:text-blue-600">
                      Courses
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900 font-medium">Create Course</li>
                </ol>
              </nav>

              {/* Step Content */}
              <div className="mb-8">{steps[currentStep].content}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  Back
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreate;
