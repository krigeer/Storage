export const getUser = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

