import { useEffect } from "react";

const useAuthorization = (user: object) => {
  useEffect(() => {
    if (!user) {
      window.location.replace("/unauthorized");
    }
  }, [user]);
};

export default useAuthorization;
