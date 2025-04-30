import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h1 className="text-xl font-semibold mb-4 text-black">
              EduPress
            </h1>
            <p className="text-gray-400">
              EduPress is your go-to platform for online learning, offering a
              wide range of courses to help you achieve your goals.
            </p>
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-4 text-black">GET HELP</h1>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-4 text-black">
              CONTACT US
            </h1>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                support@edupress.com
              </li>
              <li className="text-gray-400">Phone: +84 123 456 789</li>
              <li className="text-gray-400">
                Address: 123 Learning St., Hanoi, Vietnam
              </li>
            </ul>
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-4 text-black">
              FOLLLOW US
            </h1>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FacebookOutlined className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <TwitterOutlined className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <InstagramOutlined className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-black">
            © {new Date().getFullYear()} EduPress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
