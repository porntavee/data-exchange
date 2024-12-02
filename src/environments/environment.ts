// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "https://dsslocal.linkflow.co.th/api/staging",
  loginURL: "https://dss.motorway.go.th:4433/dnm/api",
  dataExchangeURL: "https://dss.motorway.go.th:4433/dxc/api",
  serviceURL: "https://dsslocal.linkflow.co.th/api/staging/callapi",
  DSSURL: "https://dss.motorway.go.th/dssadmin/index.php/api",
  // serviceURL: "http://localhost:8040/api/staging/callapi",
  // serviceURL:"http://10.11.2.179:3009",
  // websocketUrl: 'ws://localhost/api/v1/device/remote'
  // serviceURL:"10.11.2.73:3009",
  rountURL: "https://dsslocal.linkflow.co.th/",
  // apiUrl: "http://localhost:8040/api/v1",
  // apiUrl: 'http://localhost:8042/api/staging',
  baseUrl: "https://dsslocal.linkflow.co.th/",
  websocketUrl: "wss://dsslocal.linkflow.co.th/websocket/v1/remote",
  allowedDomains: [
    "localhost:8040",
    "dss.motorway.go.th:4433",
    "dsslocal.linkflow.co.th",
    "edims.infitel.co.th",
    "edd.linkflow.co.th",
    "line.linkflow.co.th:8001",
    "localhost:8042",
    "192.168.1.230:8001",
    "192.168.43.210:8080",
    "192.168.1.31",
    "dss.motorway.go.th",
    "dpub.linkflow.co.th",
    "dss.motorway.go.th:4433"
  ]
};
