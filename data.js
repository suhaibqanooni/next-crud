export const personalInformation = {
  name: "GM",
  email: "gm@gmail.com",
};
export const headerTabs = [
  {
    label: "Users",
    link: "/user",
    permissions: ["ADMIN"],
  },
  {
    label: "Employees",
    link: "/employees",
    permissions: ["ADMIN"],
  },
  {
    label: "Orders",
    link: "/orders",
    permissions: ["ADMIN"],
  },
];
export const categoryOptions = [
  { value: "LAPTOPS", label: "LAPTOPS" },
  { value: "PRINTERS", label: "PRINTERS" },
  { value: "OTHER", label: "OTHER" },
];
export const userRolesOptions = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "USER", label: "USER" },
  { value: "LOCAL", label: "LOCAL" },
];

export const localVariable = {
  user: "user",
  accessToken: "accessToken",
};
export const baseURL = "http://localhost:3000/";
