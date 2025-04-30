import { Card, Statistic } from "antd";

const StatisticsSection = () => {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Achievements</h2>
          <p className="text-lg text-gray-600">
            Join thousands of learners and explore our quality courses
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow text-center">
            <Statistic
              value={100000}
              suffix="+"
              valueStyle={{ color: "#3f8600", fontSize: "36px" }}
            />
            <p className="text-lg font-semibold mt-2">Learners</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow text-center">
            <Statistic
              value={1000}
              suffix="+"
              valueStyle={{ color: "#3f8600", fontSize: "36px" }}
            />
            <p className="text-lg font-semibold mt-2">Courses</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow text-center">
            <Statistic
              value={5000}
              suffix="+"
              valueStyle={{ color: "#3f8600", fontSize: "36px" }}
            />
            <p className="text-lg font-semibold mt-2">Quality Instructors</p>
          </Card>
          <Card className="hover:shadow-lg transition-shadow text-center">
            <Statistic
              value={100}
              suffix="%"
              valueStyle={{ color: "#3f8600", fontSize: "36px" }}
            />
            <p className="text-lg font-semibold mt-2">Satisfaction Rate</p>
          </Card>
        </div>
      </div>
    );
}

export default StatisticsSection;