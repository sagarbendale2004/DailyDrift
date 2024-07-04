// eslint-disable-next-line no-unused-vars
import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logouthandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={logouthandler}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
