const express = require("express");
const router = express.Router();

const centerAdminRouter = require("./CenterAdminRoutes");
const carerRouter = require("./CarerRoutes");
const seniorRouter = require("./SeniorRoutes");

const createAuthRouter = () => {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: 로그인인
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userid:
   *                 type: string
   *               password:
   *                type: string
   *     responses:
   *       201:
   *         description: 생성됨
   */
  router.post("/login", async (req, res) => {
    const { userid, password } = req.body;

    if (userid === undefined || password === undefined) {
      return res
        .status(400)
        .json({ message: "아이디와 비밀번호를 입력해주세요." });
    }
    res.json({ message: "로그인 성공" });
  });

  router.use("/center_admin", centerAdminRouter);
  router.use("/carer", carerRouter);
  router.use("/senior", seniorRouter);

  return router;
};

module.exports = createAuthRouter;
