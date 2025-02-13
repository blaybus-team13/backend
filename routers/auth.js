const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { Carer, CenterAdmin, Center } = require("../models");

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

  /**
   * @swagger
   * /auth/center_admin:
   *   post:
   *     summary: 센터 관리자 등록
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
   *               name:
   *                type: string
   *               tel:
   *                type: string
   *               position:
   *                type: string
   *               profileImage:
   *                type: string
   *               hasVehicle:
   *                type: boolean
   *               center:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   tel:
   *                     type: string
   *                   address:
   *                     type: string
   *                   hasVehicle:
   *                     type: boolean
   *                   centerGrade:
   *                     type: number
   *                   operationYears:
   *                     type: number
   *                   shortBio:
   *                     type: string
   *     responses:
   *       201:
   *         description: 생성됨
   */
  router.post("/center_admin", async (req, res) => {
    const {
      userid,
      password,
      name,
      tel,
      position,
      profileImage,
      hasVehicle,
      center,
    } = req.body;

    if (userid === undefined || password === undefined) {
      return res
        .status(400)
        .json({ message: "아이디와 비밀번호를 입력해주세요." });
    }

    let centerInfo = null;
    try {
      // if center exists
      centerInfo = await Center.findOne({ tel: center.tel });

      if (centerInfo === null) {
        centerInfo = new Center(center);
        await centerInfo.save();
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const centerAdmin = new CenterAdmin({
        userid,
        password: hashedPassword,
        name,
        tel,
        position,
        profileImage,
        hasVehicle,
        center: centerInfo._id,
      });
      await centerAdmin.save();
      res.status(201).json({ message: "관리자 계장 생성 성공" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e + "서버 에러 on 관리자 계정 생성" });
    }
  });

  /**
   * @swagger
   * /auth/center_admin:
   *  get:
   *   summary: 센터 모든 관리자 조회
   *  responses:
   *   200:
   *    description
   *      성공
   */
  router.get("/center_admin", async (req, res) => {
    try {
      const centerAdmins = await CenterAdmin.find();
      res.json(centerAdmins);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e + "서버 에러 on 관리자 계정 생성" });
    }
  });

  return router;
};

module.exports = createAuthRouter;
