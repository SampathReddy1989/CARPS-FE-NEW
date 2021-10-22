export const environment = {
  //apiUrl: "http://ec2-3-137-41-38.us-east-2.compute.amazonaws.com:8080/carps",
  apiUrl: "http://ec2-18-117-141-36.us-east-2.compute.amazonaws.com:8080/carps",
  roles: [
    { rid: 1, roleName: "Admin", active: "Y" },
    { rid: 2, roleName: "Manager", active: "Y" },
    { rid: 3, roleName: "TL", active: "Y" },
    { rid: 4, roleName: "Agent", active: "Y" },
    { rid: 5, roleName: "Auditor", active: "Y" },
  ],

  production: true,
};
