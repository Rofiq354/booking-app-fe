import { Outlet } from "react-router-dom";
import Navbar from "../../layouts/Navbar";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserLayout;
