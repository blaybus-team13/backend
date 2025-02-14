const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const { createAuthRouter } = require("./routers");

mongoose
  .connect("mongodb://root:admin@localhost:27017/test?authSource=admin")
  .then(() => {
    console.log("MongoDB connected");
  });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

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
  apis: ["./app.js", "./routers/**/*.js"], // API 라우트 파일 경로
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", createAuthRouter());

// centerAdmin 라우터 추가 (여기)

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
