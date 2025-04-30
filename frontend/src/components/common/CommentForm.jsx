import { Form, Input, Button, Checkbox } from "antd";

const { TextArea } = Input;

const CommentForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Comment submitted:", values);
    form.resetFields();
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Leave a Comment
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Your email address will not be published. Required fields are marked
      </p>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
              placeholder="Your name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Email is invalid!" },
            ]}
          >
            <Input
              className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
              placeholder="Your email"
            />
          </Form.Item>
        </div>
        <Form.Item
          name="comment"
          label="Comment"
          rules={[{ required: true, message: "Please enter your comment!" }]}
        >
          <TextArea
            rows={4}
            className="rounded-lg py-2.5 text-base border-gray-300 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
            placeholder="Write your comment..."
          />
        </Form.Item>
        <Form.Item name="saveInfo" valuePropName="checked">
          <Checkbox className="text-gray-600">
            Save my name, email, and website in this browser for the next time I comment.
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-orange-500 hover:bg-orange-600 rounded-lg px-6 py-2 text-base font-medium transition-all duration-200"
          >
            Send Comment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CommentForm;
