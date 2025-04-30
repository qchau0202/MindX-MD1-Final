import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const AppLayout = () => {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="sticky top-0 z-10 " />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
