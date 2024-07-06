import { useSelector } from "react-redux";

const CheckUserData = () => {
  const userData = useSelector((state) => state.auth.userData);

  console.log("Redux state userData:", userData);

  return null;
};

export default CheckUserData;
