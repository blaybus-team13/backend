const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CenterAdmin = require("../../models/CenterAdmin");

/**
 * @swagger
 * /auth/center_admin:
 *   post:
 *     summary: 센터 관리자 등록
 *     tags: [CenterAdmin]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *         description: application/json
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - password
 *               - name
 *               - tel
 *               - position
 *               - address
 *               - center
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 관리자 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 format: password
 *               name:
 *                 type: string
 *                 description: 관리자 이름
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *               position:
 *                 type: string
 *                 description: 직책
 *               address:
 *                 type: string
 *                 description: 주소
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지
 *               center:
 *                 type: object
 *                 required:
 *                   - name
 *                   - tel
 *                   - address
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: 센터 이름
 *                   tel:
 *                     type: string
 *                     description: 센터 전화번호
 *                   address:
 *                     type: string
 *                     description: 센터 주소
 *                   hasVehicle:
 *                     type: boolean
 *                     description: 차량 운행 여부
 *                   centerGrade:
 *                     type: number
 *                     description: 센터 등급
 *                   operationYears:
 *                     type: number
 *                     description: 운영 연수
 *                   shortBio:
 *                     type: string
 *                     description: 센터 소개
 *     responses:
 *       201:
 *         description: 센터 관리자 등록 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

router.post("/", async (req, res) => {
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
 *   get:
 *     summary: 센터 모든 관리자 조회
 *     tags: [CenterAdmin]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: 센터 관리자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: 관리자 ID
 *                   userid:
 *                     type: string
 *                     description: 관리자 아이디
 *                   name:
 *                     type: string
 *                     description: 관리자 이름
 *                   tel:
 *                     type: string
 *                     description: 전화번호
 *                   position:
 *                     type: string
 *                     description: 직책
 *                   address:
 *                     type: string
 *                     description: 주소
 *                   profileImage:
 *                     type: string
 *                     description: 프로필 이미지 경로
 *                   center:
 *                     type: object
 *                     description: 센터 정보
 *                     properties:
 *                       name:
 *                         type: string
 *                       tel:
 *                         type: string
 *                       address:
 *                         type: string
 *                       hasVehicle:
 *                         type: boolean
 *                       centerGrade:
 *                         type: number
 *                       operationYears:
 *                         type: number
 *                       shortBio:
 *                         type: string
 *       500:
 *         description: 서버 오류
 */

router.get("/", async (req, res) => {
  try {
    const centerAdmins = await CenterAdmin.find();
    res.json(centerAdmins);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e + "서버 에러 on 관리자 계정 생성" });
  }
});

module.exports = router;
