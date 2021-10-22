// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  //apiUrl: 'http://ec2-3-137-41-38.us-east-2.compute.amazonaws.com:8080/carps',
  apiUrl: "http://ec2-18-117-141-36.us-east-2.compute.amazonaws.com:8080/carps",
  roles: [{ rid: 1, roleName: 'Admin', active: 'Y' },
  { rid: 2, roleName: 'Manager', active: 'Y' },
  { rid: 3, roleName: 'TL', active: 'Y' },
  { rid: 4, roleName: 'Agent', active: 'Y' },
  { rid: 5, roleName: 'Auditor', active: 'Y' }, ],

  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
