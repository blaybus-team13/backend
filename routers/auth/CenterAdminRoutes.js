const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CenterAdmin = require("../../models/CenterAdmin");
const Center = require("../../models/Center");

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
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: 시
 *                   subCity:
 *                     type: string
 *                     description: 구
 *                   subSubCity:
 *                     type: string
 *                     description: 동
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
 *                  address:
 *                    type: object
 *                    properties:
 *                      city:
 *                        type: string
 *                        description: 시
 *                      subCity:
 *                        type: string
 *                        description: 구
 *                      subSubCity:
 *                        type: string
 *                        description: 동
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
  try {
    const {
      userid,
      password,
      name,
      tel,
      position,
      profileImage,
      address,
      hasVehicle,
      center,
    } = req.body;

    if (userid === undefined || password === undefined) {
      return res
        .status(400)
        .json({ message: "아이디와 비밀번호를 입력해주세요." });
    }

    const existingUser = await CenterAdmin.findOne({ userid });
    if (existingUser) {
      return res.status(400).json({
        message: "이미 사용중인 아이디입니다.",
      });
    }

    let centerInfo = await Center.findOne({
      name: center.name,
      "address.city": address.city,
      "address.subCity": address.subCity,
      "address.subSubCity": address.subSubCity,
    });

    if (!centerInfo) {
      centerInfo = new Center({
        ...center,
        address,
      });
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
      address,
      center: centerInfo._id,
    });
    await centerAdmin.save();
    res.status(201).json({ message: "센터 관리자 등록이 완료되었습니다." });
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
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         description: 시
 *                       subCity:
 *                         type: string
 *                         description: 구
 *                       subSubCity:
 *                         type: string
 *                         description: 동
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
 *                         type: object
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

// 특정 센터 관리자 정보 조회
router.get("/:id", async (req, res) => {
  try {
    const centerAdmin = await CenterAdmin.findById(req.params.id)
      .populate("center")
      .select("-password");

    if (!centerAdmin) {
      return res.status(404).json({
        message: "해당 관리자를 찾을 수 없습니다.",
      });
    }

    res.status(200).json(centerAdmin);
  } catch (e) {
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 센터 관리자 정보 수정
router.put("/:id", async (req, res) => {
  try {
    const { name, tel, position, address, profileImage } = req.body;

    const updatedAdmin = await CenterAdmin.findByIdAndUpdate(
      req.params.id,
      {
        name,
        tel,
        position,
        address,
        profileImage,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("center");

    if (!updatedAdmin) {
      return res.status(404).json({
        message: "해당 관리자를 찾을 수 없습니다.",
      });
    }

    res.status(200).json(updatedAdmin);
  } catch (e) {
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
});

//로그인

router.post("/login", async (req, res) => {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // 키 존재 확인용

    const { userid, password } = req.body;

    if (!userid || !password) {
      console.log("아이디 또는 비밀번호 누락");
      return res.status(400).json({
        message: "아이디와 비밀번호를 모두 입력해주세요.",
      });
    }

    const admin = await CenterAdmin.findOne({ userid });
    if (!admin) {
      console.log(`사용자 ${userid} 찾을 수 없음`);
      return res.status(401).json({
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    console.log("비밀번호 검증 시작");
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log("비밀번호 검증 결과:", isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    const token = jwt.sign(
      { id: admin._id, userid: admin.userid },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "로그인 성공",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        position: admin.position,
      },
    });
  } catch (e) {
    console.error("로그인 중 오류 발생:", e);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
      error: e.toString(),
    });
  }
});

module.exports = router;
