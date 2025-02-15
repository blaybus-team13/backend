const express = require("express");
const router = express.Router();
const Senior = require("../../models/Senior");

const mongoose = require("mongoose");

/**
 * @swagger
 * /auth/senior:
 *   post:
 *     summary: 새로운 Senior 생성
 *     tags: [Senior]
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
 *               - name
 *               - tel
 *               - address
 *               - services
 *               - workingDays
 *               - workingHours
 *               - minSalary
 *               - info
 *             properties:
 *               name:
 *                 type: string
 *                 description: 이름
 *                 example: "신짱구"
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *               address:
 *                 type: string
 *                 description: 주소
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 필요 서비스
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 희망 근무 요일
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: 근무 시간
 *               minSalary:
 *                 type: number
 *                 description: 시급
 *               info:
 *                 type: object
 *                 required:
 *                   - gender
 *                   - weight
 *                   - hasCohabitant
 *                 properties:
 *                   gender:
 *                     type: string
 *                     description: 성별
 *                   weight:
 *                     type: number
 *                     description: 몸무게
 *                   hasCohabitant:
 *                     type: boolean
 *                     description: 동거인 여부
 *                     example: true
 *     responses:
 *       201:
 *         description: Senior 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "senior 정보 생성 성공"
 *                 data:
 *                   $ref: '#/components/schemas/Senior'
 *       500:
 *         description: 필수 정보 미입력 또는 서버 오류
 */
router.post("/", async (req, res) => {
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
    !profileImage ||
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

/**
 * @swagger
 * /auth/senior/{id}:
 *   patch:
 *     summary: 특정 Senior 정보 수정
 *     tags: [Senior]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 Senior ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *         description: application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "신짱구"
 *               tel:
 *                 type: string
 *               address:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: number
 *               minSalary:
 *                 type: number
 *               info:
 *                 type: object
 *                 properties:
 *                   gender:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   hasCohabitant:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Senior 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "senior 정보 수정 성공"
 *                 data:
 *                   $ref: '#/components/schemas/Senior'
 *                 updatedFields:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: 수정 실패
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ message: "유효하지 않은 ID" });
  }
  const senior = await Senior.findById(id);
  if (!senior) {
    return res.status(500).json({ message: "해당 senior를 찾을 수 없습니다" });
  }
  res.status(201).json({ message: "senior 정보 조회 성공", data: senior });
});

/**
 * @swagger
 * /auth/senior/{id}:
 *   patch:
 *     summary: 특정 Senior 정보 수정
 *     tags: [Senior]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 Senior ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *         description: application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               tel:
 *                 type: string
 *               address:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: number
 *               minSalary:
 *                 type: number
 *                 example: 12000
 *               info:
 *                 type: object
 *                 properties:
 *                   gender:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   hasCohabitant:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Senior 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "senior 정보 수정 성공"
 *                 data:
 *                   $ref: '#/components/schemas/Senior'
 *                 updatedFields:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: 수정 실패
 */

router.patch("/:id", async (req, res) => {
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
 * /auth/senior/{id}:
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
router.delete("/:id", async (req, res) => {
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
