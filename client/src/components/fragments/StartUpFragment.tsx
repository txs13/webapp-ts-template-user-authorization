import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

const StartUpFragment: React.FunctionComponent = () => {

  let navigate = useNavigate();

  useEffect(() => {
    navigate("/login")
  }, [navigate])

  return <>START UP FRAGMENT</>;
};

export default StartUpFragment;
