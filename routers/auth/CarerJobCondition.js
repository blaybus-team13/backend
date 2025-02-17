const express = require("express");
const router = express.Router();
const CarerJobCondition = require("../../models/CarerJobCondition");

/**
 * @swagger
 * /api/carer-job-conditions:
 *   post:
 *     summary: 요양보호사 구직 조건 등록
 *     tags: [CarerJobCondition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - subCity
 *               - subSubCity
 *               - cityDetail
 *               - workingDays
 *               - workingTime
 *               - desiredSalary
 *             properties:
 *               city:
 *                 type: string
 *                 description: 시
 *                 example: "서울시"
 *               subCity:
 *                 type: string
 *                 description: 구
 *                 example: "강북구"
 *               subSubCity:
 *                 type: string
 *                 description: 동
 *                 example: "수유동"
 *               cityDetail:
 *                 type: string
 *                 description: 상세주소
 *                 example: "미시령로 3337번길"
 *               workingDays:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: boolean
 *                   tuesday:
 *                     type: boolean
 *                   wednesday:
 *                     type: boolean
 *                   thursday:
 *                     type: boolean
 *                   friday:
 *                     type: boolean
 *                   saturday:
 *                     type: boolean
 *                   sunday:
 *                     type: boolean
 *               workingTime:
 *                 type: object
 *                 properties:
 *                   morning:
 *                     type: boolean
 *                   afternoon:
 *                     type: boolean
 *                   night:
 *                     type: boolean
 *               desiredSalary:
 *                 type: number
 *                 minimum: 15000
 *                 description: 희망 시급
 *                 example: 15000
 *     responses:
 *       201:
 *         description: 구직 조건 등록 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

router.post("/", auth, async (req, res) => {
  try {
    const {
      city,
      subCity,
      subSubCity,
      cityDetail,
      workingDays,
      workingTime,
      desiredSalary,
    } = req.body;

    // 필수 필드 검증
    if (!city || !subCity || !subSubCity || !cityDetail) {
      return res.status(400).json({
        message: "근무 희망 지역 정보를 모두 입력해주세요.",
      });
    }

    const hasSelectedDay = Object.values(workingDays).some((day) => day);
    if (!hasSelectedDay) {
      return res.status(400).json({
        message: "근무 요일을 선택해주세요.",
      });
    }
    const hasSelectedTime = Object.values(workingTime).some((time) => time);
    if (!hasSelectedTime) {
      return res.status(400).json({
        message: "근무 시간대를 선택해주세요.",
      });
    }

    const jobCondition = new CarerJobCondition({
      city,
      subCity,
      subSubCity,
      cityDetail,
      workingDays,
      workingTime,
      desiredSalary,
    });

    await jobCondition.save();

    res.status(201).json({
      success: true,
      message: "구직 조건이 등록되었습니다.",
      jobCondition,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "구직 조건 등록 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/carer-job-conditions/{id}:
 *   put:
 *     summary: 구직 조건 수정
 *     tags: [CarerJobCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 구직 조건 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - subCity
 *               - subSubCity
 *               - cityDetail
 *               - workingDays
 *               - workingTime
 *               - desiredSalary
 *             properties:
 *               city:
 *                 type: string
 *                 description: 시
 *               subCity:
 *                 type: string
 *                 description: 구
 *               subSubCity:
 *                 type: string
 *                 description: 동
 *               cityDetail:
 *                 type: string
 *                 description: 상세주소
 *               workingDays:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: boolean
 *                   tuesday:
 *                     type: boolean
 *                   wednesday:
 *                     type: boolean
 *                   thursday:
 *                     type: boolean
 *                   friday:
 *                     type: boolean
 *                   saturday:
 *                     type: boolean
 *                   sunday:
 *                     type: boolean
 *               workingTime:
 *                 type: object
 *                 properties:
 *                   morning:
 *                     type: boolean
 *                   afternoon:
 *                     type: boolean
 *                   night:
 *                     type: boolean
 *               desiredSalary:
 *                 type: number
 *                 minimum: 15000
 *                 description: 희망 시급
 *     responses:
 *       200:
 *         description: 구직 조건 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 구직 조건을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      city,
      subCity,
      subSubCity,
      cityDetail,
      workingDays,
      workingTime,
      desiredSalary,
    } = req.body;

    if (!city || !subCity || !subSubCity || !cityDetail) {
      return res.status(400).json({
        message: "근무 희망 지역을 입력해주세요.",
      });
    }
    if (workingDays && !Object.values(workingDays).some((day) => day)) {
      return res.status(400).json({
        message: "근무 요일을 선택해주세요.",
      });
    }

    if (workingTime && !Object.values(workingTime).some((time) => time)) {
      return res.status(400).json({
        message: "근무 시간대를 선택해주세요.",
      });
    }

    const updatedJobCondition = await CarerJobCondition.findByIdAndUpdate(
      req.params.id,
      {
        city,
        subCity,
        subSubCity,
        cityDetail,
        workingDays,
        workingTime,
        desiredSalary,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJobCondition) {
      return res.status(404).json({
        message: "구직 조건을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      message: "구직 조건이 수정되었습니다.",
      jobCondition: updatedJobCondition,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "구직 조건 수정 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/carer-job-conditions/{id}:
 *   delete:
 *     summary: 구직 조건 삭제
 *     tags: [CarerJobCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 구직 조건 ID
 *     responses:
 *       200:
 *         description: 구직 조건 삭제 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 구직 조건을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedJobCondition = await CarerJobCondition.findByIdAndDelete(
      req.params.id
    );

    if (!deletedJobCondition) {
      return res.status(404).json({
        message: "구직 조건을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      message: "구직 조건이 삭제되었습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "구직 조건 삭제 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/carer-job-conditions/{id}:
 *   get:
 *     summary: 요양보호사 구직 조건 조회
 *     tags: [CarerJobCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 구직 조건 ID
 *     responses:
 *       200:
 *         description: 구직 조건 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobCondition:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                     subCity:
 *                       type: string
 *                     subSubCity:
 *                       type: string
 *                     cityDetail:
 *                       type: string
 *                     workingDays:
 *                       type: object
 *                       properties:
 *                         monday:
 *                           type: boolean
 *                         tuesday:
 *                           type: boolean
 *                         wednesday:
 *                           type: boolean
 *                         thursday:
 *                           type: boolean
 *                         friday:
 *                           type: boolean
 *                         saturday:
 *                           type: boolean
 *                         sunday:
 *                           type: boolean
 *                     workingTime:
 *                       type: object
 *                       properties:
 *                         morning:
 *                           type: boolean
 *                         afternoon:
 *                           type: boolean
 *                         night:
 *                           type: boolean
 *                     desiredSalary:
 *                       type: number
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 구직 조건을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

router.get("/:id", auth, async (req, res) => {
  try {
    const jobCondition = await CarerJobCondition.findById(req.params.id);

    if (!jobCondition) {
      return res.status(404).json({
        message: "구직 조건을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      jobCondition,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "구직 조건 조회 중 오류가 발생했습니다.",
    });
  }
});
