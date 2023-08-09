import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkuserDetails } from "../Redux/Auth/action";
import { Box, Text, Toast } from "@chakra-ui/react";

function Home() {
  const dispatch = useDispatch();
  const { errorMessage, userDetails } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(checkuserDetails())
      .then((res) => {})
      .catch((err) => {
        Toast({
          title: err,
          status: "error",
          description: errorMessage,
          duration: 6000,
          isClosable: true,
        });
      });
  }, []);
  return (
    <Box>
      <Text>{userDetails}</Text>
    </Box>
  );
}

export default Home;
