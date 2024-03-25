const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nintendods123#',
    database: 'MySql-local'
  });
console.log("connected to mysql");


app.set('view engine', 'ejs');
app.set('views', './views');//views 디렉토리 설정

// bodyParser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 라우팅
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/upload', (req, res) => {
    res.render('upload');
})


//회원가입 정보 저장
app.post('/signupinfo', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const studentnum = req.body.studentnum;
    const identity = req.body.identity;

    var sql = `INSERT INTO signin (name, password, studentnum, identity) VALUES ('${name}', '${password}', '${studentnum}', '${identity}')`;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        }
        else{
            console.log('회원가입이 성공적으로 되었습니다.');
            //res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");//성공적으로 회원가입하면 로그인으로 보낸다
            res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");
        }
    });

})

app.get('/test', (req, res) => {
    res.send('<h1>test</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});