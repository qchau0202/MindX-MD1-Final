import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="sticky top-0 z-10 bg-white" />
      <main className="flex-grow px-4">{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
