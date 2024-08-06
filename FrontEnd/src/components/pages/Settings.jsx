import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { useShowToast } from "../hooks/useShowToast";
import useLogout from "../../atoms/useLogout";

const Settings = () => {

  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
        if (data.error) {
            showToast("An error occurred", "error");
            return;
        }
        showToast("Account frozen successfully", "success");
        await logout();

    } catch (error) {
      showToast("An error occurred", "error");
    }
  };
  return (
    <>
      <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
      </Text>
      <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Freeze Account
      </Button>
    </>
  );
};

export default Settings;
