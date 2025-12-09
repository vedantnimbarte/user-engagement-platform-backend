/**
 * Path for all the services.
 **/
const pathOfService = {
  frontend: `http://localhost:8080`,
  loginPath: `http://localhost:4001`,
  adminPath: `http://localhost:4000`,
  nodeMailerPath: `http://localhost:4002`,
  onBoardingPath: `http://localhost:4004`,
  trackingPath: `http://localhost:4005`,
};

const liveHost = "https://userplus.io";
if (process.env.NODE_ENV.trim() === "production") {
  pathOfService.frontend = liveHost;
  pathOfService.loginPath = `${liveHost}/api/login`;
  pathOfService.adminPath = `${liveHost}/api/admin`;
  pathOfService.nodeMailerPath = `${liveHost}/api/nodeMailer`;
  pathOfService.onBoardingPath = `${liveHost}/api/on-boarding`;
  pathOfService.trackingPath = `${liveHost}/api/tracking`;
}

const pathOfServiceMui = {
  frontend: `http://localhost:8080`,
  loginPath: `http://localhost:4001`,
  adminPath: `http://localhost:4000`,
  nodeMailerPath: `http://localhost:4002`,
  onBoardingPath: `http://localhost:4004`,
  trackingPath: `http://localhost:4005`,
};

const liveHostMui = "https://userlove.dev";
if (process.env.NODE_ENV.trim() === "production") {
  pathOfServiceMui.frontend = liveHostMui;
  pathOfServiceMui.loginPath = `${liveHostMui}/api/login`;
  pathOfServiceMui.adminPath = `${liveHostMui}/api/admin`;
  pathOfServiceMui.nodeMailerPath = `${liveHostMui}/api/nodeMailer`;
  pathOfServiceMui.onBoardingPath = `${liveHostMui}/api/on-boarding`;
  pathOfServiceMui.trackingPath = `${liveHostMui}/api/tracking`;
}

module.exports = { pathOfService, pathOfServiceMui };
