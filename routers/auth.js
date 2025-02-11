const express = require("express");
const router = express.Router();

const User = require("../models/User");

const createAuthRouter = (sequelize) => {
  /**
   * @swagger
   * /api/auth/login:
   *  post:
   *   summary: 로그인
   *  requestBody:
   *   required: true
   *  content:
   *  application/json:
   *  schema:
   *  type: object
   * properties:
   * email:
   * type: string
   * password:
   * type: string
   * responses:
   * 200:
   * description: 로그인 성공
   * 400:
   * description: 로그인 실패
   * 404:
   * description: 유저 없음
   */
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "유저가 없습니다." });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }
    res.json({ message: "로그인 성공" });
  });
};
