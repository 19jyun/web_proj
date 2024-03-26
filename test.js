const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
var session = require('express-session')
const bcrypt = require('bcrypt');

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
app.use(express.static(__dirname))
app.use(express.json()) //데이터 읽기가 안되는걸 이거 추가해서 해결 (eventlistner로 데이터를 보내는 경우에만 필요한듯)
app.use(session({ secret: 'test_proj', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}))

app.use((req, res, next) => { //로컬 파일들 내에서 세션 정보를 사용하기 위한 미들웨어

    res.locals.id = "";
    res.locals.name ="";

    if(req.session.user){
        res.locals.id = req.session.user.id
        res.locals.name = req.session.user.name
    }
    
    next()
  })

// 라우팅
app.get('/', (req, res) => {

    console.log(req.session.user);

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

app.get('/professors', (req, res) => {
    res.render('professors');
})

app.get('/create_lecture', (req, res) => {
    res.render('create_lecture');
})

app.get('/register_lecture', (req, res) => {
    res.render('register_lecture');
});

app.get('/student', (req, res) => {
    res.render('student');
});


//회원가입 정보 저장
app.post('/signupinfo', (req, res) => {

    console.log(req.body);

    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const studentnum = req.body.studentnum;
    const identity = req.body.identity;

    bcrypt.hash(password, 10, function(err, hash) {
        // Now store hash in your password DB.
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Error creating account.");
        }
        
        // Assuming you have a `members` table and the connection to the database is established
        var sql = `INSERT INTO members (id, name, password, studentnum, identity) VALUES (?, ?, ?, ?, ?)`;

        connection.query(sql, [id, name, hash, studentnum, identity], function (error, results) {
            if (error) {
                console.log(error);
                return res.send('Error during registration.');
            } else {
                console.log('Registration successful.');
                res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");
            }
        });
    });
})

// Check if ID is already taken
app.post('/checkid', (req, res) => {
    const id = req.body.id;

    console.log(id);

    // 데이터베이스에서 'id' 값이 이미 존재하는지 확인합니다.
    // 이 예에서는 'users' 테이블을 사용하고 있습니다.
    // 실제 데이터베이스와 테이블 이름에 따라 이 코드를 수정해야 합니다.
    var sql = `SELECT * FROM members WHERE id = ?`;

    connection.query(sql, [id], function (error, results) {

        if (error) {
            console.log(error);
            res.send('오류가 발생했습니다.');
        } else {
            if (results.length > 0) {

                console.log(results);
                res.send('이미 존재하는 아이디입니다.');
            } else {

                console.log(results);
                res.send('사용 가능한 아이디입니다.');
            }
        }
    });
});

//강의개설 정보 저장
app.post('/lectureinfo', (req, res) => {
    const lecture_id = req.body.lecture_id;
    const lecture_name = req.body.lecture_name;
    const professor_id = req.body.professor_id;

    //강의 테이블에 강의개설 데이터 저장
    var sql = `INSERT INTO lectures (lecture_id, lecture_namek professor_id) VALUES ('${lecture_id}', '${lecture_name}', '${professor_id}')`;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        }
        else{
            console.log('강의개설이 성공적으로 되었습니다.');
            //res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");//성공적으로 회원가입하면 로그인으로 보낸다
            res.send("<script>alert('강의가 성공적으로 개설 되었습니다.'); location.href='/professors';</script>");
        }
    });
})

app.post('/announcementinfo', (req, res) => {
    const lecture_id = req.body.lecture_id;
    const title = req.body.title;
    const maintext = req.body.maintext;

    //강의 테이블에 강의개설 데이터 저장
    var sql = `INSERT INTO announcements (lecture_id, title, maintext, regdate) VALUES ('${lecture_id}', '${title}', '${maintext}', now())`;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        }
        else{
            console.log('공지사항이 업로드 되었습니다.');
            //res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");//성공적으로 회원가입하면 로그인으로 보낸다
            res.send("<script>alert('공지사항이 업로드 되었습니다.'); location.href='/professors';</script>");
        }
    });
})

app.post('/logininfo', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;

    //멤버 테이블에 회원가입 데이터 저장
    //var sql = `select * from members where id = '${id}' and password = '${password}'`;
    var sql = `SELECT * FROM members WHERE id = ?`;

    //var values = [id, password];

    connection.query(sql, [id], function (error, result) {
        if (error) {
            console.log(error);
        }
        else{
            if (result.length > 0) {
                req.session.user = result[0];
    
                bcrypt.compare(password, result[0].password, function(err, results) {
                    if(err){
                        console.log(err);
                    }
                    
                    if (results) {
                        // Passwords match
                        console.log('로그인 성공');
                        
                        if(result[0].identity == 'teacher'){//교수자면 그에 해당하는 페이지로 이동
                            res.send("<script>alert('로그인 되었습니다.'); location.href='/professors';</script>");
                        }
                        else if(result[0].identity == 'student'){//학생이면 그에 해당하는 페이지로 이동
                            res.send("<script>alert('로그인 되었습니다.'); location.href='/student';</script>");
                        }

                        // proceed with login
                    } 
                    else {
                        // Passwords don't match
                        console.log('비밀번호 다름');
                        res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); location.href='/login';</script>");
                    }
                });
            } else {
                // No user found with that id
                res.send("<script>alert('걍 에러입니다.'); location.href='/login';</script>");
            }
        }
    });
})

app.get('/logout', (req, res) => {
    req.session.user = null;
    res.send("<script>alert('로그아웃 되었습니다.'); location.href='/';</script>");
});

app.get('/test', (req, res) => {
    res.send('<h1>test</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});