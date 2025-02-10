const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

sequelize.sync()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Error:', err));

app.get('/', (req, res) => {
    res.send("hello world")
})

app.get('/test', async (req, res) => {
    const users = await User.create({
        name: 'Alice',
        email: 'test@email.com'
    });
    res.json(users);
});


app.use((req, res, next) => {
  res.status(404).json({
    message: '요청하신 리소스를 찾을 수 없습니다.'
  });
});


// 에러 핸들러
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 포트 설정
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행중입니다.`);
});

module.exports = app;