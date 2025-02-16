const express = require("express");
const router = express.Router();

const centerAdminRouter = require("./CenterAdminRoutes");
const carerRouter = require("./CarerRoutes");
const seniorRouter = require("./SeniorRoutes");

const createAuthRouter = () => {
  router.use("/center_admin", centerAdminRouter);
  router.use("/carer", carerRouter);
  router.use("/senior", seniorRouter);

  return router;
};

module.exports = createAuthRouter;
