import { Card } from "antd";

const FeedbackSection = () => {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">What Our Students Say</h2>
          <p className="text-lg text-gray-600">
            Hear from our learners about their experiences
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <p className="text-gray-600 italic mb-4">
              "This platform transformed my career! The courses are practical
              and engaging."
            </p>
            <h4 className="text-lg font-semibold">Nguyen Van A</h4>
            <p className="text-gray-500">Front-end Developer</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <p className="text-gray-600 italic mb-4">
              "I learned so much from the design courses. The instructors are
              top-notch!"
            </p>
            <h4 className="text-lg font-semibold">Tran Thi B</h4>
            <p className="text-gray-500">UI/UX Designer</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <p className="text-gray-600 italic mb-4">
              "The flexibility of learning at my own pace was a game-changer for
              me."
            </p>
            <h4 className="text-lg font-semibold">Le Van C</h4>
            <p className="text-gray-500">Marketing Specialist</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <p className="text-gray-600 italic mb-4">
              "Amazing content and support. I landed my dream job after
              completing the course!"
            </p>
            <h4 className="text-lg font-semibold">Pham Thi D</h4>
            <p className="text-gray-500">Data Analyst</p>
          </Card>
        </div>
      </div>
    );
}
export default FeedbackSection;