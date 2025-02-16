const express = require("express");
const router = express.Router();
const multer = require("multer");
const Carer = require("../models/Carer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = "uploads/";
    if (file.fieldname.includes("Cert")) {
      uploadDir += "certificates/";
    } else if (file.fieldname === "profileImage") {
      uploadDir += "profiles/";
    } else {
      uploadDir += "general/";
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const uploadFields = [
  { name: "careAssitantCertImage", maxCount: 1 },
  { name: "socialWorkerCertImage", maxCount: 1 },
  { name: "nursingAssistantCertImage", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
];

/**
 * @swagger
 * /auth/carer/register:
 *   post:
 *     summary: 새로운 요양보호사 등록
 *     tags: [Carer]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *         description: multipart/form-data
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - password
 *               - name
 *               - tel
 *               - careAssitantCertNumber
 *               - careAssitantCertImage
 *               - hasVehicle
 *               - hasDementiaTraining
 *               - addressCity
 *               - addressSubCity
 *               - addressSubSubCity
 *               - workingAreaCity
 *               - workingAreaSubCity
 *               - workingAreaSubSubCity
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 사용자 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 format: password
 *               name:
 *                 type: string
 *                 description: 이름
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *               careAssitantCertNumber:
 *                 type: string
 *                 description: 요양보호사 자격증 번호 (필수)
 *               careAssitantCertImage:
 *                 type: file
 *                 description: 요양보호사 자격증 이미지 (필수)
 *               socialWorkerCertNumber:
 *                 type: string
 *                 description: 사회복지사 자격증 번호
 *               socialWorkerCertImage:
 *                 type: file
 *                 description: 사회복지사 자격증 이미지
 *               nursingAssistantCertNumber:
 *                 type: string
 *                 description: 간호조무사 자격증 번호
 *               nursingAssistantCertImage:
 *                 type: file
 *                 description: 간호조무사 자격증 이미지
 *               hasVehicle:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: 자차 보유 여부
 *               hasDementiaTraining:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: 치매 교육 이수 여부
 *               addressCity:
 *                 type: string
 *                 description: 거주지 시 (예: 서울시)
 *               addressSubCity:
 *                 type: string
 *                 description: 거주지 구 (예: 강남구)
 *               addressSubSubCity:
 *                 type: string
 *                 description: 거주지 동 (예: 역삼동)
 *               workingAreaCity:
 *                 type: string
 *                 description: 희망 근무지 시 (예: 서울시)
 *               workingAreaSubCity:
 *                 type: string
 *                 description: 희망 근무지 구 (예: 강남구)
 *               workingAreaSubSubCity:
 *                 type: string
 *                 description: 희망 근무지 동 (예: 역삼동)
 *               profileImage:
 *                 type: file
 *                 description: 프로필 이미지
 *               images:
 *                 type: array
 *                 items:
 *                   type: file
 *                 description: 추가 이미지 (최대 5개)
 */

router.post("/register", upload.fields(uploadFields), async (req, res) => {
  try {
    const {
      userid,
      password,
      name,
      tel,
      careAssitantCertNumber,
      socialWorkerCertNumber,
      nursingAssistantCertNumber,
      hasVehicle,
      hasDementiaTraining,
      hasSocialWorkerCert,
      hasNursingAssistantCert,
      addressCity,
      addressSubCity,
      addressSubSubCity,
      workingAreaCity,
      workingAreaSubCity,
      workingAreaSubSubCity,
    } = req.body;

    // 요양보호사 자격증 필수 체크
    if (!careAssitantCertNumber || !req.files.careAssitantCertImage) {
      return res.status(400).json({
        message: "요양보호사 자격증은 필수입니다.",
      });
    }

    const carerData = {
      userid,
      password,
      name,
      tel,
      careAssitantCert: {
        certNumber: careAssitantCertNumber,
        certImage: req.files.careAssitantCertImage[0].path,
        isCertified: false, // 최초 등록시 미인증 상태
      },
      hasVehicle: hasVehicle === "true",
      hasDementiaTraining: hasDementiaTraining === "true",
      address: {
        city: addressCity,
        subCity: addressSubCity,
        subSubCity: addressSubSubCity,
      },
      workingArea: [
        {
          city: workingAreaCity,
          subCity: workingAreaSubCity,
          subSubCity: workingAreaSubSubCity,
        },
      ],
    };

    // 사회복지사 자격증 정보 추가 (토글이 true인 경우에만)
    if (hasSocialWorkerCert === "true") {
      if (!socialWorkerCertNumber || !req.files.socialWorkerCertImage) {
        return res.status(400).json({
          message: "번호와 이미지를 모두 입력해주세요.",
        });
      }
      carerData.socialWorkerCert = {
        certNumber: socialWorkerCertNumber,
        certImage: req.files.socialWorkerCertImage[0].path,
        isCertified: false,
      };
    }

    // 간호조무사 자격증 정보 추가 (토글이 true인 경우에만)
    if (hasNursingAssistantCert === "true") {
      if (!nursingAssistantCertNumber || !req.files.nursingAssistantCertImage) {
        return res.status(400).json({
          message: "번호와 이미지를 모두 입력해주세요.",
        });
      }
      carerData.nursingAssistantCert = {
        certNumber: nursingAssistantCertNumber,
        certImage: req.files.nursingAssistantCertImage[0].path,
        isCertified: false,
      };
    }

    // 프로필 사진 추가 (있는 경우)
    if (req.files.profileImage) {
      carerData.profileImage = req.files.profileImage[0].path;
    }

    // 추가 이미지 추가 (있는 경우)
    if (req.files.images) {
      carerData.images = req.files.images.map((file) => file.path);
    }

    const newCarer = new Carer(carerData);
    await newCarer.save();

    res.status(201).json({
      carer: newCarer,
      message: "축하드려요, 가입이 완료되었습니다!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /auth/carer/update/{id}:
 *   put:
 *     summary: 요양보호사 정보 수정
 *     tags: [Carer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 요양보호사 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 이름
 *               tel:
 *                 type: string
 *                 description: 전화번호
 *               careAssitantCertNumber:
 *                 type: string
 *                 description: 요양보호사 자격증 번호
 *               careAssitantCertImage:
 *                 type: file
 *                 description: 요양보호사 자격증 이미지
 *               hasSocialWorkerCert:
 *                 type: string
 *                 enum: ['true', 'false']
 *               socialWorkerCertNumber:
 *                 type: string
 *               socialWorkerCertImage:
 *                 type: file
 *               hasNursingAssistantCert:
 *                 type: string
 *                 enum: ['true', 'false']
 *               nursingAssistantCertNumber:
 *                 type: string
 *               nursingAssistantCertImage:
 *                 type: file
 *               hasVehicle:
 *                 type: string
 *                 enum: ['true', 'false']
 *               hasDementiaTraining:
 *                 type: string
 *                 enum: ['true', 'false']
 *               addressCity:
 *                 type: string
 *               addressSubCity:
 *                 type: string
 *               addressSubSubCity:
 *                 type: string
 *               workingAreaCity:
 *                 type: string
 *               workingAreaSubCity:
 *                 type: string
 *               workingAreaSubSubCity:
 *                 type: string
 *               profileImage:
 *                 type: file
 *               images:
 *                 type: array
 *                 items:
 *                   type: file
 *     responses:
 *       200:
 *         description: 정보 수정 성공
 *       404:
 *         description: 요양보호사를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

router.put("/update/:id", upload.fields(uploadFields), async (req, res) => {
  try {
    const carerId = req.params.id;
    const updateData = { ...req.body };

    if (
      updateData.addressCity &&
      updateData.addressSubCity &&
      updateData.addressSubSubCity
    ) {
      updateData.address = {
        city: updateData.addressCity,
        subCity: updateData.addressSubCity,
        subSubCity: updateData.addressSubSubCity,
      };
    }

    if (
      updateData.workingAreaCity &&
      updateData.workingAreaSubCity &&
      updateData.workingAreaSubSubCity
    ) {
      updateData.workingArea = [
        {
          city: updateData.workingAreaCity,
          subCity: updateData.workingAreaSubCity,
          subSubCity: updateData.workingAreaSubSubCity,
        },
      ];
    }

    if (req.files) {
      if (req.files.careAssitantCertImage) {
        updateData["careAssitantCert.certImage"] =
          req.files.careAssitantCertImage[0].path;
      }
      if (updateData.hasSocialWorkerCert === "true") {
        if (req.files.socialWorkerCertImage) {
          updateData["socialWorkerCert.certImage"] =
            req.files.socialWorkerCertImage[0].path;
        }
        if (updateData.socialWorkerCertNumber) {
          updateData["socialWorkerCert.certNumber"] =
            updateData.socialWorkerCertNumber;
        }
      } else if (updateData.hasSocialWorkerCert === "false") {
        updateData.socialWorkerCert = undefined;
      }

      if (updateData.hasNursingAssistantCert === "true") {
        if (req.files.nursingAssistantCertImage) {
          updateData["nursingAssistantCert.certImage"] =
            req.files.nursingAssistantCertImage[0].path;
        }
        if (updateData.nursingAssistantCertNumber) {
          updateData["nursingAssistantCert.certNumber"] =
            updateData.nursingAssistantCertNumber;
        }
      } else if (updateData.hasNursingAssistantCert === "false") {
        updateData.nursingAssistantCert = undefined;
      }
      if (req.files.profileImage) {
        updateData.profileImage = req.files.profileImage[0].path;
      }
      if (req.files.images) {
        updateData.images = req.files.images.map((file) => file.path);
      }
    }

    const updatedCarer = await Carer.findByIdAndUpdate(carerId, updateData, {
      new: true,
    });

    if (!updatedCarer) {
      return res.status(404).json({ message: "해당 정보를 찾을 수 없습니다." });
    }

    res.json({
      carer: updatedCarer,
      message: "정보가 성공적으로 수정되었습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /auth/carer/list:
 *   get:
 *     summary: 전체 요양보호사 목록 조회
 *     tags: [Carer]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: 요양보호사 목록 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/list", async (req, res) => {
  try {
    const carers = await Carer.find()
      .select("-password")
      .populate("jobCondition")
      .populate("workExperiences");
    res.json(carers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /auth/carer/{id}:
 *   get:
 *     summary: 특정 요양보호사 상세 정보 조회
 *     tags: [Carer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 요양보호사 ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: 요양보호사 정보 조회 성공
 *       404:
 *         description: 요양보호사를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

router.get("/:id", async (req, res) => {
  try {
    const carer = await Carer.findById(req.params.id)
      .select("-password")
      .populate("jobCondition")
      .populate("workExperiences");

    if (!carer) {
      return res
        .status(404)
        .json({ message: "요양보호사를 찾을 수 없습니다." });
    }

    res.json(carer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /auth/carer/{id}:
 *   delete:
 *     summary: 요양보호사 정보 삭제
 *     tags: [Carer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 요양보호사 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "보호사 정보가 삭제되었습니다."
 *       404:
 *         description: 해당 보호사를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

router.delete("/:id", async (req, res) => {
  try {
    const deletedCarer = await Carer.findByIdAndDelete(req.params.id);

    if (!deletedCarer) {
      return res
        .status(404)
        .json({ message: "해당 보호사를 찾을 수 없습니다." });
    }

    res.json({ message: "보호사 정보가 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /auth/carer/update-job-condition/{id}:
 *   patch:
 *     summary: 요양보호사 구직 조건 업데이트
 *     tags: [Carer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 요양보호사 ID
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
 *               - jobCondition
 *             properties:
 *               jobCondition:
 *                 type: string
 *                 description: 구직 조건 ID
 *     responses:
 *       200:
 *         description: 구직 조건 업데이트 성공
 *       404:
 *         description: 해당 보호사를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

router.patch("/update-job-condition/:id", async (req, res) => {
  try {
    const { jobCondition } = req.body;

    const updatedCarer = await Carer.findByIdAndUpdate(
      req.params.id,
      { jobCondition },
      { new: true }
    );

    if (!updatedCarer) {
      return res
        .status(404)
        .json({ message: "해당 보호사를 찾을 수 없습니다." });
    }

    res.json({
      carer: updatedCarer,
      message: "구직 조건이 업데이트되었습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
