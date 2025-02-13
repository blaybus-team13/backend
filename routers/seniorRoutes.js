const express = require("express");
const router = express.Router();
const Senior = require("../models/Senior");

const mongoose = require("mongoose");

// create
/**
 * @swagger
 * /seniors:
 *   post:
 *     summary: 새로운 Senior 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Senior의 이름
 *               tel:
 *                 type: string
 *                 description: Senior의 전화번호
 *               address:
 *                 type: string
 *                 description: Senior의 주소
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지 경로
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 어르신 필요 서비스
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 원하는 근무 요일
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: 근무 시간간
 *               minSalary:
 *                 type: number
 *                 description: 최소 시급
 *               info:
 *                 type: object
 *                 description: 성별, 몸무게, 동거인 여부
 *                 properties:
 *                   gender:
 *                     type: string
 *                     description: 성별
 *                   weight:
 *                     type: number
 *                     description: 몸무게 (kg)
 *                   hasCohabitant:
 *                     type: boolean
 *                     description: 동거인이 있는지 여부 (true/false)
 *     responses:
 *       201:
 *         description: 생성됨
 *       500:
 *         description: 필수 정보가 누락되었거나 잘못된 요청
 */
router.post("/seniors", async (req, res) => {
  const {
    name,
    tel,
    address,
    services,
    workingDays,
    workingHours,
    minSalary,
    profileImage,
    info,
  } = req.body;
  if (
    !name ||
    !tel ||
    !address ||
    !profileImage || // 필수 정보로 들어가지 않을 시 수정 예정
    !services ||
    !workingDays ||
    !workingHours ||
    !info ||
    !minSalary
  ) {
    return res.status(500).json({ message: "모든 필수 정보 미입력" });
  }
  const senior = new Senior(req.body);
  const savedSenior = await senior.save();
  res.status(201).json({ message: "senior 정보 생성 성공", data: savedSenior });
});

// read
/**
 * @swagger
 * /seniors/{id}:
 *   get:
 *     summary: 특정 Senior 상세 정보 조회
 *     description: Senior의 ID를 사용하여 정보를 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 조회할 Senior의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Senior 정보를 조회됨
 *       500:
 *         description: 서버 오류 또는 Senior를 찾을 수 없음
 */
router.get("/seniors/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ message: "유효하지 않은 ID" });
  }
  // if (!id) {
  //   return res.status(500).json({ message: "senior id 미제공" });
  // }
  const senior = await Senior.findById(id);
  if (!senior) {
    return res.status(500).json({ message: "해당 senior를 찾을 수 없음" });
  }
  res.status(201).json({ message: "senior 정보 조회 성공", data: senior });
});

// update
/**
 * @swagger
 * /seniors/{id}:
 *   patch:
 *     summary: 특정 Senior 정보 수정
 *     description: Senior의 ID를 사용하여 모든 정보를 수정함
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 Senior의 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Senior의 이름
 *               tel:
 *                 type: string
 *                 description: Senior의 전화번호
 *               address:
 *                 type: string
 *                 description: Senior의 주소
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지 경로
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 어르신 필요 서비스
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 원하는 근무 요일
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: 근무 시간간
 *               minSalary:
 *                 type: number
 *                 description: 최소 시급
 *               info:
 *                 type: object
 *                 description: 성별, 몸무게, 동거인 여부
 *                 properties:
 *                   gender:
 *                     type: string
 *                     description: 성별
 *                   weight:
 *                     type: number
 *                     description: 몸무게 (kg)
 *                   hasCohabitant:
 *                     type: boolean
 *                     description: 동거인이 있는지 여부 (true/false)
 *     responses:
 *       201:
 *         description: Senior 정보 수정 성공
 *       500:
 *         description: 서버 오류 또는 잘못된 요청
 */
router.patch("/seniors/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ message: "유효하지 않은 ID" });
  }
  const updateData = req.body;

  // 혹시 필요할까봐 데이터 검증 작성
  const allowedUpdates = [
    "name",
    "tel",
    "address",
    "profileImage",
    "services",
    "workingDays",
    "workingHours",
    "minSalary",
    "info",
  ];
  const isValidOperation = Object.keys(updateData).every((field) =>
    allowedUpdates.includes(field)
  );
  if (!isValidOperation) {
    return res.status(500).json({ message: "잘못된 업데이트가 포함됨" });
  }

  const updatedSenior = await Senior.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedSenior) {
    return res.status(500).json({ message: "해당 senior를 찾을 수 없음" });
  }
  res.status(201).json({
    message: "senior 정보 수정 성공",
    data: updatedSenior,
    updatedFields: Object.keys(updateData),
  });
});

// delete
/**
 * @swagger
 * /seniors/{id}:
 *   delete:
 *     summary: 특정 Senior 삭제
 *     description: Senior의 ID를 사용하여 데이터를 삭제함
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 Senior의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Senior 삭제 성공
 *       500:
 *         description: 서버 오류 또는 잘못된 요청, senior을 찾을 수 없음
 */
router.delete("/seniors/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ message: "유효하지 않은 ID" });
  }

  const deletedSenior = await Senior.findByIdAndDelete(id);
  if (!deletedSenior) {
    return res.status(500).json({ message: "해당 senior를 찾을 수 없음" });
  }
  res.status(200).json({
    message: "senior 정보 삭제됨",
    data: deletedSenior,
  });
});

module.exports = router;
