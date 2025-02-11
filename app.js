const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const sequelize = require("./config/database");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Error:", err));

// Swagger 설정
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "API 문서화 예제",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 서버",
      },
    ],
  },
  apis: ["./app.js", "./routes/*.js"], // API 라우트 파일 경로
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 새 사용자 추가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성됨
 */
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "요청하신 리소스를 찾을 수 없습니다.",
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 포트 설정
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행중입니다.`);
});

module.exports = app;
