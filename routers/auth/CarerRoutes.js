const express = require("express");
const router = express.Router();
const multer = require("multer");

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
 * /api/carer/register:
 *   post:
 *     summary: 새로운 요양보호사 등록
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
      address,
      workingArea,
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
      address,
      workingArea,
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
 * /api/carer/update/{id}:
 *   put:
 *     summary: 요양보호사 정보 수정
 */

router.put("/update/:id", upload.fields(uploadFields), async (req, res) => {
  try {
    const carerId = req.params.id;
    const updateData = { ...req.body };

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
 * /api/carer/list:
 *   get:
 *     summary: 전체 요양보호사 목록 조회
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
 * /api/carer/{id}:
 *   get:
 *     summary: 특정 요양보호사 상세 정보 조회
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
 * /api/carer/{id}:
 *   delete:
 *     summary: 요양보호사 정보 삭제
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
 * /api/carer/update-job-condition/{id}:
 *   patch:
 *     summary: 요양보호사 구직 조건 업데이트
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
