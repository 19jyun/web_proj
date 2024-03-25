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
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const studentnum = req.body.studentnum;
    const identity = req.body.identity;

    //멤버 테이블에 회원가입 데이터 저장
    var sql = `INSERT INTO members (id, name, password, studentnum, identity) VALUES ('${id}', '${name}', '${password}', '${studentnum}', '${identity}')`;

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


app.post('/logininfo', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;

    //멤버 테이블에 회원가입 데이터 저장
    var sql = `select * from members where id = '${id}' and password = '${password}'`;

    var values = [id, password];

    connection.query(sql, values, function (error, result) {
        if (error) {
            console.log(error);
        }
        else{
            //console.log(result.length);//결과가 없으면 0, 있으면 1

            if(result.length == 0){
                res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); location.href='/login';</script>");
            }
            else{
                res.send("<script>alert('로그인 성공'); location.href='/';</script>");//로그인 성공 부분은 없애도 될듯
            }
        }
    });
})


app.get('/test', (req, res) => {
    res.send('<h1>test</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});