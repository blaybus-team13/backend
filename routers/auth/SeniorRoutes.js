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
 *               seniorId:
 *                 type: number
 *               basicInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                     enum: [남성, 여성]
 *               careInfo:
 *                 type: object
 *                 properties:
 *                   careGrade:
 *                     type: string
 *                     enum: [등급없음, 1등급, 2등급, 3등급, 4등급, 5등급, 인적지원 등급]
 *                   weight:
 *                     type: number
 *                   diseaseInfo:
 *                     type: string
 *                   address:
 *                     type: string
 *                   dementia:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [정상(증상없음), 집 밖을 배회, 했던 말을 반복하는 등의 단기기억 장애, 가족을 알아보지 못함, 길을 잃거나 자주 가던 곳을 헤맴, 어린아이 같은 행동, 사람을 의심하는 증상, 때리거나 욕설 등의 공격적인 행동]
 *                   livingArrangement:
 *                     type: string
 *                     enum: [독거, 배우자와 동거, 돌봄 시간 중에 집에 있음, 배우자와 동거, 돌봄 시간 중에 자리 비움, 다른 가족과 동거, 돌봄 시간 중에 집에 있음, 다른 가족과 동거, 돌봄 시간 중에 자리 비움]
 *               schedule:
 *                 type: object
 *                 properties:
 *                   careDays:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         day:
 *                           type: string
 *                           enum: [월, 화, 수, 목, 금, 토, 일]
 *                         careStartTime:
 *                           type: string
 *                           format: date-time
 *                         careEndTime:
 *                           type: string
 *                           format: date-time
 *               additionalInfo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [가사도우미 있음, 주차가능, 반려동물 있음, 집 평수 30평 이상]
 *               mealAssistance:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [스스로 식사 가능, 식사 차려드리기, 죽, 반찬 등 조리 필요, 경관식 보조]
 *               toiletAssistance:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [스스로 배변 가능, 가끔 대소변 실수 시 도움, 기저귀 케어 필요, 유치도뇨/방광루/장루 관리]
 *               mobilityAssistance:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [스스로 거동 가능, 이동시 부축 도움, 휠체어 이동 보조, 거동 불가]
 *               dailyLifeService:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [청소, 빨래 보조, 목욕 보조, 병원 동행, 산책, 간단한 운동, 말벗 등 정서지원, 인지자극 활동]
 *               additionalService:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성됨
 *       400:
 *         description: 필수 정보가 누락되었거나 잘못된 요청
 */

router.post("/", async (req, res) => {
  const {
    seniorId,
    basicInfo,
    careInfo,
    schedule,
    additionalInfo,
    mealAssistance,
    toiletAssistance,
    mobilityAssistance,
    dailyLifeService,
    additionalService,
  } = req.body;

  if (
    !seniorId ||
    !basicInfo?.name ||
    !basicInfo?.birthDate ||
    !basicInfo?.gender ||
    !careInfo?.careGrade ||
    !careInfo?.weight ||
    !careInfo?.address ||
    !careInfo?.livingArrangement ||
    !schedule?.careDays ||
    !mealAssistance ||
    !toiletAssistance ||
    !mobilityAssistance ||
    !dailyLifeService
  ) {
    return res.status(400).json({ message: "필수 정보 미입력" });
  }

  const seniorData = {
    seniorId,
    basicInfo,
    careInfo,
    schedule,
    additionalInfo,
    mealAssistance,
    toiletAssistance,
    mobilityAssistance,
    dailyLifeService,
    additionalService,
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
 *         description: 조회할 Senior의 고유 ID (MongoDB ObjectId)
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
 *         description: 수정할 Senior의 고유 ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Senior 정보 수정 성공
 *       400:
 *         description: 유효하지 않은 요청 또는 ID
 *       404:
 *         description: 해당 Senior를 찾을 수 없음
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "유효하지 않은 ID" });
  }

  const senior = await Senior.findById(id);
  if (!senior) {
    return res.status(404).json({ message: "해당 senior를 찾을 수 없음" });
  }

  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === "object" && value !== null) {
      senior[key] = { ...senior[key], ...value };
    } else {
      senior[key] = value;
    }
  }

  await senior.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "senior 정보 수정 성공",
    data: senior,
    updatedFields: Object.keys(req.body),
  });
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
 *         description: 삭제할 Senior의 고유 ID (MongoDB ObjectId)
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
