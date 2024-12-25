// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  rountURL: "https://dss.motorway.go.th:4433/",
  loginURL: "https://dss.motorway.go.th:4433/minsight/api/",
  dataExchangeURL: "https://dss.motorway.go.th:4433/dxc/api",
  backupURL: "https://dss.motorway.go.th:4433/minsight/api",
  serviceURL: "https://dss.motorway.go.th:4433/api/staging/callapi",
  apiUrl: "https://dss.motorway.go.th:4433/api/v1",
  DSSURL: "https://dss.motorway.go.th/dssadmin/index.php/api",
  dataExchange: "https://dss.motorway.go.th:4433/",
  // serviceURL:"10.11.2.73:3009",
  baseUrl: "https://dss.motorway.go.th:4433/",
  websocketUrl: "wss://dsslocal.linkflow.co.th/websocket/v1/remote",
  allowedDomains: [
    "dss.motorway.go.th:4433",
    "dsslocal.linkflow.co.th",
    "edims.infitel.co.th",
    "edd.linkflow.co.th",
    "10.4.2.250",
    "localhost",
    "dss.motorway.go.th"
  ]
};
