const express = require("express");
const router = express.Router();
const Senior = require("../../models/Senior");

const mongoose = require("mongoose");

// create
/**
 * @swagger
 * /auth/senior:
 *   post:
 *     summary: 새로운 Senior 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicInfo:
 *                 type: object
 *                 properties:
 *                   seniorProfileImage:
 *                     type: string
 *                   name:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                     enum: [남, 여]
 *                   address:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tel:
 *                     type: string
 *               careInfo:
 *                 type: object
 *                 properties:
 *                   weight:
 *                     type: number
 *                   hasCohabitant:
 *                     type: boolean
 *                   familyInfo:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       memberCount:
 *                         type: number
 *                   careGrade:
 *                     type: string
 *               schedule:
 *                 type: object
 *                 properties:
 *                   workingSchedule:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         day:
 *                           type: string
 *                         hours:
 *                           type: array
 *                           items:
 *                             type: number
 *               care:
 *                 type: object
 *                 properties:
 *                   medicalConditions:
 *                     type: array
 *                     items:
 *                       type: string
 *                   reqServices:
 *                     type: array
 *                     items:
 *                       type: string
 *                   specificRequirements:
 *                     type: string
 *               reqCarer:
 *                 type: object
 *                 properties:
 *                   reqWorkingSchedule:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         day:
 *                           type: string
 *                         hours:
 *                           type: array
 *                           items:
 *                             type: number
 *                   expectedStartDate:
 *                     type: string
 *                     format: date
 *                   desiredSalary:
 *                     type: number
 *               plus:
 *                 type: object
 *                 properties:
 *                   managerTel:
 *                     type: string
 *                   managerEmail:
 *                     type: string
 *     responses:
 *       201:
 *         description: 생성됨
 *       400:
 *         description: 필수 정보가 누락되었거나 잘못된 요청
 */
router.post("/", async (req, res) => {
  const { basicInfo, careInfo, schedule, care, reqCarer, plus } = req.body;

  if (
    !basicInfo.name ||
    !basicInfo.tel ||
    !basicInfo.address ||
    !basicInfo.birthDate ||
    !basicInfo.gender ||
    !careInfo.weight ||
    careInfo.hasCohabitant === undefined ||
    !careInfo.careGrade ||
    !care.reqServices ||
    !plus.managerTel ||
    !plus.managerEmail
  ) {
    return res.status(400).json({ message: "필수 정보 미입력" });
  }

  const seniorData = {
    basicInfo,
    careInfo,
    schedule,
    care,
    reqCarer,
    plus,
  };

  const senior = new Senior(seniorData);
  const savedSenior = await senior.save();
  res.status(201).json({ message: "senior 정보 생성 성공", data: savedSenior });
});

//read
/**
 * @swagger
 * /auth/senior/{id}:
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
 *       200:
 *         description: Senior 정보를 조회됨
 *       400:
 *         description: 유효하지 않은 ID
 *       404:
 *         description: Senior를 찾을 수 없음
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "유효하지 않은 ID" });
  }
  const senior = await Senior.findById(id);
  if (!senior) {
    return res.status(404).json({ message: "해당 senior를 찾을 수 없음" });
  }
  res.status(200).json({ message: "senior 정보 조회 성공", data: senior });
});

// update
/**
 * @swagger
 * /auth/senior/{id}:
 *   patch:
 *     summary: 특정 Senior 정보 수정
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
 *               basicInfo:
 *                 type: object
 *               careInfo:
 *                 type: object
 *               schedule:
 *                 type: object
 *               care:
 *                 type: object
 *               reqCarer:
 *                 type: object
 *               plus:
 *                 type: object
 *     responses:
 *       200:
 *         description: Senior 정보 수정 성공
 *       400:
 *         description: 유효하지 않은 ID 또는 잘못된 요청
 *       404:
 *         description: Senior를 찾을 수 없음
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "유효하지 않은 ID" });
  }
  const updateData = req.body;

  const allowedUpdates = [
    "basicInfo",
    "careInfo",
    "schedule",
    "care",
    "reqCarer",
    "plus",
  ];
  const isValidOperation = Object.keys(updateData).every((field) =>
    allowedUpdates.includes(field)
  );
  if (!isValidOperation) {
    return res.status(400).json({ message: "잘못된 업데이트가 포함됨" });
  }

  try {
    const senior = await Senior.findById(id);
    if (!senior) {
      return res.status(404).json({ message: "해당 senior를 찾을 수 없음" });
    }

    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === "object" && updateData[key] !== null) {
        senior[key] = { ...senior[key], ...updateData[key] };
      } else {
        senior[key] = updateData[key];
      }
    });

    const updatedSenior = await senior.save();
    res.status(200).json({
      message: "senior 정보 수정 성공",
      data: updatedSenior,
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    res.status(400).json({ message: "업데이트 실패", error: error.message });
  }
});

// delete
/**
 * @swagger
 * /auth/senior/{id}:
 *   delete:
 *     summary: 특정 Senior 삭제
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
 *       400:
 *         description: 유효하지 않은 ID
 *       404:
 *         description: Senior를 찾을 수 없음
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "유효하지 않은 ID" });
  }

  const deletedSenior = await Senior.findByIdAndDelete(id);
  if (!deletedSenior) {
    return res.status(404).json({ message: "해당 senior를 찾을 수 없음" });
  }
  res.status(200).json({
    message: "senior 정보 삭제됨",
    data: deletedSenior,
  });
});

module.exports = router;
