module.exports = (app) => {
  const {
    checkDuplicateUsernameOrEmail,
    signup,
    signin,
    logout,
  } = require("../controllers/user.controller");
  var router = require("express").Router();

  router.post("/signup", [checkDuplicateUsernameOrEmail], signup);
  router.post("/signin", signin);
  router.post("/logout", logout);
  app.use("/api/auth", router);
};
