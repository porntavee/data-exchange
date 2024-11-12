// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  rountURL: "https://dsslocal.linkflow.co.th/",
  serviceURL: "https://dsslocal.linkflow.co.th/api/staging/callapi",
  apiUrl: "https://dsslocal.linkflow.co.th/api/staging",
  // serviceURL:"10.11.2.73:3009",
  baseUrl: "https://dsslocal.linkflow.co.th/",
  websocketUrl: "wss://dsslocal.linkflow.co.th/websocket/v1/remote",
  allowedDomains: [
    "dsslocal.linkflow.co.th",
    "edims.infitel.co.th",
    "edd.linkflow.co.th",
    "10.4.2.250",
    "localhost",
    "dss.motorway.go.th"
  ]
};
