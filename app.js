const express = require('express');//express library import
const bodyParser = require('body-parser');//body-parser import, JSON 형식의 body를 파싱하는데 사용

const app = express();//express 객체 생성
const PORT = 3000; //개인 포트를 3000으로 설정

// Middleware to parse JSON bodies
const cors = require('cors');
app.use(cors());

// Mock "database" for storing user information
let users = [];

// Route to handle user sign-up
//signup 요청을 처리하는 라우터
//req는 요청되는 데이터, res는 보내지는 데이터
app.post('/signup', (req, res) => {
    //signup에서 보낸 데이터들을 나열
    const { username, password, student_id, identity } = req.body;

    // 모든 필요 정보 입력 확인
    if (!username || !password || !student_id || !identity) {
        return res.status(400).json({ message: '모든 정보를 입력해주세요.' });
    }

    // 아이디 중복 체크
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: '아이디가 중복됩니다. 다시 입력해주세요.' });
    }

    // 비밀번호 해싱
    // For example, using bcrypt.js

    // Simulate storing the user in the database
    users.push({
        username,
        password,
        student_id,
        identity
    });
    try {
        res.status(201).json({ message: '회원가입이 성공적으로 됐습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
