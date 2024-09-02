require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
var session = require('express-session')
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT;

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
console.log("connected to mysql");

app.set('view engine', 'ejs');
app.set('views', './views');//views 디렉토리 설정

app.use(express.static('public'));

// bodyParser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))
app.use(express.json()) //데이터 읽기가 안되는걸 이거 추가해서 해결 (eventlistner로 데이터를 보내는 경우에만 필요한듯)
app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 300000 }, resave: true, saveUninitialized: true, rolling: true }))//5분 세션, 클라이언트에서 뭘 할때마다 세션 초기화 (5분동안 idle시 날라간다)

app.get('/login', (req, res) => {
    res.render('login');
});

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
        else {
            if (result.length > 0) {
                req.session.user = result[0];

                bcrypt.compare(password, result[0].password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }

                    if (results) {
                        // Passwords match
                        console.log('로그인 성공');
                        console.log(result[0]);

                        if (result[0].identity == 'teacher') {//교수자면 그에 해당하는 페이지로 이동
                            res.send("<script> location.href='/professors';</script>");
                        }
                        else if (result[0].identity == 'student') {//학생이면 그에 해당하는 페이지로 이동
                            res.send("<script> location.href='/student';</script>");
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
                res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); location.href='/login';</script>");
            }
        }
    });
})

function ensureLoggedIn(req, res, next) {
    const openPaths = ['/signup', '/checkid', '/signupinfo']; // 예외 처리할 경로들
    if (openPaths.includes(req.path)) {
        next();
    } else if (req.session.isLoggedIn) {
        next();
    } else if (req.session.user) {
        req.session.isLoggedIn = true;
        next();
    } else {
        res.send("<script>alert('로그인이 필요합니다.'); location.href='/login';</script>");
    }
}

app.use(ensureLoggedIn);

app.use((req, res, next) => { //로컬 파일들 내에서 세션 정보를 사용하기 위한 미들웨어

    res.locals.id = "";
    res.locals.name = "";

    if (req.session.user) {
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



app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/upload/:lecture_id', (req, res) => {
    const lecture_id = req.params.lecture_id;
    res.render('upload', { lecture_id: lecture_id });
});

app.get('/recent_announcements/:lecture_id', (req, res) => {
    const lecture_id = req.params.lecture_id;
    const identity = req.session.user.identity; // 세션에서 학생 ID 가져오기

    console.log(lecture_id);

    // 교수의 아이디로 되어있는 모든 리스트들을 데이터베이스에서 대조해서 가져옴
    var sql = `SELECT * FROM announcements WHERE lecture_id = '${lecture_id}'`;

    connection.query(sql, function (error, announcements) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('recent_announcements', { announcements: announcements, lecture: lecture_id, identity: identity });
        }
    });
});

app.get('/professors', (req, res) => {
    const professor_id = req.session.user.id; // 세션에서 교수 ID 가져오기

    console.log(professor_id);

    // 교수의 아이디로 되어있는 모든 리스트들을 데이터베이스에서 대조해서 가져옴
    var sql = `SELECT * FROM lectures WHERE professor_id = '${professor_id}'`;

    connection.query(sql, function (error, lectures) {
        if (error) {
            console.log(error);
        }
        else {
            // EJS 템플릿에 강의 데이터를 전달합니다.
            res.render('professors', { lectures: lectures });
        }
    });
})

app.get('/create_lecture', (req, res) => {
    res.render('create_lecture');
})

app.get('/register_lecture', (req, res) => {
    const student_id = req.session.user.id; // 세션에서 현재 학생의 ID 가져오기, 수강 신청시 사용될 예정

    console.log(student_id);

    // 교수의 아이디로 되어있는 모든 리스트들을 데이터베이스에서 대조해서 가져옴
    var sql = 'SELECT * FROM lectures';//모든 강의를 가져옴

    connection.query(sql, function (error, lectures) {
        if (error) {
            console.log(error);
        }
        else {
            // EJS 템플릿에 강의 데이터를 전달합니다.
            res.render('register_lecture', { lectures: lectures });
        }
    });
});


app.get('/student', (req, res) => {
    const student_id = req.session.user.id; // 세션에서 학생 ID 가져오기

    // 학생이 수강신청한 모든 강의의 ID를 가져옴
    var sqlLectureIds = `SELECT lecture_id FROM student_lecture WHERE student_id = ?`;

    connection.query(sqlLectureIds, [student_id], function (error, lectures) {
        if (error) {
            console.log(error);
            return res.status(500).send('Database error occurred'); // 오류 처리
        }

        // 학생이 수강신청한 강의가 없으면, 공지사항 없이 강의 데이터만 전달
        if (lectures.length === 0) {
            return res.render('student', { lectures: [], announcements: [] });
        }

        // 학생이 수강신청한 모든 강의의 ID를 배열로 추출
        var lectureIds = lectures.map(l => l.lecture_id);

        // 추출한 강의 ID 배열을 사용하여 해당 강의의 모든 공지사항을 최신 순으로 가져옴
        var sqlAnnouncements = `SELECT * FROM announcements WHERE lecture_id IN (?) ORDER BY regdate DESC`;

        connection.query(sqlAnnouncements, [lectureIds], function (error, announcements) {
            if (error) {
                console.log(error);
                return res.status(500).send('Error retrieving data.'); // 오류 처리
            }

            // EJS 템플릿에 강의 데이터와 공지사항을 전달
            res.render('student', { lectures: lectures, announcements: announcements });
        });
    });
});

// 게시물 편집 라우트
app.get('/edit_announcement/:lecture_id/:idx', function (req, res) {
    // 게시물 ID를 URL 매개변수에서 가져옵니다.
    var lecture_id = req.params.lecture_id;
    var idx = req.params.idx;

    // 데이터베이스에서 해당 강의 ID와 공지사항 ID의 공지사항을 찾습니다.
    connection.query('SELECT * FROM announcements WHERE lecture_id = ? AND idx = ?', [lecture_id, idx], function (error, results, fields) {
        if (error) throw error;

        // 편집이 완료되면, 사용자를 게시물 목록 페이지로 리다이렉트합니다.
        res.render('edit_announcement', { announcement: results[0] }); //이 announcement의 값들을 보여줘야된다
    });
});


app.get('/manage_students/:lecture_id', (req, res) => {
    const lecture_id = req.params.lecture_id;
    const loggedInProfessorId = req.session.user.id; // 현재 로그인된 교수의 professor_id

    // 해당 강의의 professor_id와 lecture 정보를 데이터베이스에서 조회합니다.
    const query = 'SELECT * FROM lectures WHERE lecture_id = ?';
    connection.query(query, [lecture_id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).send('Lecture not found');
        }

        const lecture = results[0];

        // 현재 로그인된 교수의 professor_id와 해당 강의의 professor_id가 일치하는지 확인합니다.
        if (loggedInProfessorId !== lecture.professor_id) {
            return res.status(403).send('Access denied');
        }

        // 강의를 수강 중인 학생들을 조회합니다.
        const studentQuery = `
            SELECT s.id as student_id, s.name, s.studentnum, sl.lecture_id 
            FROM student_lecture sl 
            JOIN members s ON sl.student_id = s.id 
            WHERE sl.lecture_id = ?`;

        connection.query(studentQuery, [lecture_id], (studentError, students) => {
            if (studentError) {
                console.error(studentError);
                return res.status(500).send('Database error');
            }

            // 수강생 관리 페이지로 이동하면서 학생 리스트와 강의 정보를 전달합니다.
            res.render('manage_students', { lecture: lecture, students: students });
        });
    });
});



app.post('/remove_student', (req, res) => {
    const student_id = req.body.student_id;
    const lecture_id = req.body.lecture_id;

    console.log(`Removing student ${student_id} from lecture ${lecture_id}`);

    // student_lecture 테이블에서 해당 학생을 삭제합니다.
    var sql = `DELETE FROM student_lecture WHERE student_id = ? AND lecture_id = ?`;

    connection.query(sql, [student_id, lecture_id], function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).send('Database error');
        } else {
            console.log(`Student ${student_id} removed from lecture ${lecture_id}`);

            var updateSql = `UPDATE lectures SET cur_num = cur_num - 1 WHERE lecture_id = ?`;

            connection.query(updateSql, [lecture_id], function (updateError, updateResults) {
                if (updateError) {
                    console.log(updateError);
                    res.status(500).send('Database error');
                } else {
                    console.log(`Lecture ${lecture_id} cur_num decreased by 1`);
                    res.send(`<script>alert('수강이 취소되었습니다.'); location.href='/manage_students/${lecture_id}';</script>`);
                }
            });
        }
    });
});


//회원가입 정보 저장
app.post('/signupinfo', (req, res) => {

    console.log(req.body);

    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const studentnum = req.body.studentnum;
    const identity = req.body.identity;

    bcrypt.hash(password, 10, function (err, hash) {
        // Now store hash in your password DB.
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Error creating account.");
        }

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

//강의개설 정보 개설 시 저장
app.post('/lectureinfo', (req, res) => {
    const lecture_id = req.body.lecture_id;
    const lecture_name = req.body.lecture_name;
    const professor_id = req.session.user.id;//이 정도는 현재 로그인 세션을 통해 저장
    const max_num = req.body.max_num;

    //강의 테이블에 강의개설 데이터 저장
    var sql = `INSERT INTO lectures (lecture_id, lecture_name, professor_id, max_num, cur_num) VALUES ('${lecture_id}', '${lecture_name}', '${professor_id}', '${max_num}', 0)`;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('강의개설이 성공적으로 되었습니다.');
            //res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");//성공적으로 회원가입하면 로그인으로 보낸다
            res.send("<script>alert('강의가 성공적으로 개설 되었습니다.'); location.href='/professors';</script>");
        }
    });
})

app.post('/stu_lec_info/', (req, res) => {
    const student_id = req.session.user.id;
    const lecture_id = req.body.lecture_id;
    const lecture_name = req.body.lecture_name;

    // Check if the student is already enrolled in the course
    var checkEnrollmentQuery = `SELECT * FROM student_lecture WHERE student_id = ? AND lecture_id = ?`;

    connection.query(checkEnrollmentQuery, [student_id, lecture_id], function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            // The student is already enrolled in this course
            var sql = 'SELECT * FROM lectures'; // 다시 강의 목록을 가져옴
            connection.query(sql, function (error, lectures) {
                if (error) {
                    console.log(error);
                } else {
                    return res.render('register_lecture', {
                        lectures: lectures,
                        errorMessage: '이미 수강신청이 되어 있는 수업입니다.'
                    });
                }
            });
        } else {
            // Proceed with the enrollment
            var sql = `INSERT INTO student_lecture (student_id, lecture_id, lecture_name) VALUES (?, ?, ?)`;
            connection.query(sql, [student_id, lecture_id, lecture_name], function (error, lectures) {
                if (error) {
                    console.log(error);
                    res.send("<script>alert('에러.'); location.href='/student';</script>");
                } else {
                    console.log('수강신청이 성공적으로 되었습니다.');
                    res.send("<script>alert('수강신청이 성공적으로 되었습니다.'); location.href='/student';</script>");
                }
            });
        }
    });
});




app.post('/announcementinfo', (req, res) => {
    const lecture_id = req.body.lecture_id;
    const title = req.body.title;//게시물 저장
    const maintext = req.body.maintext;

    //강의 테이블에 강의개설 데이터 저장
    var sql = `INSERT INTO announcements (lecture_id, title, maintext, regdate) VALUES ('${lecture_id}', '${title}', '${maintext}', now())`;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('공지사항이 업로드 되었습니다.');
            //res.send("<script>alert('회원가입이 성공적으로 되었습니다.'); location.href='/login';</script>");//성공적으로 회원가입하면 로그인으로 보낸다
            res.send("<script>alert('공지사항이 업로드 되었습니다.'); location.href='/professors';</script>");
        }
    });
})

app.post('/editannouncementinfo', (req, res) => {
    const lecture_id = req.body.lecture_id;
    const title = req.body.title;//게시물 저장
    const maintext = req.body.maintext;
    const idx = req.body.idx;

    //강의 테이블에 강의개설 데이터 저장
    var sql = `UPDATE announcements SET lecture_id = ?, title = ?, maintext = ?, regdate = now() WHERE idx = ?`;
    connection.query(sql, [lecture_id, title, maintext, idx], function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('공지사항이 수정됐습니다.');
            res.send(`<script>alert('공지사항이 수정됐습니다.'); location.href='/recent_announcements/${lecture_id}';</script>`);
        }
    });
})

// 게시물 삭제 라우트
app.post('/delete_announcement/:lecture_id/:idx', function (req, res) {
    // 게시물 ID를 URL 매개변수에서 가져옵니다.
    var idx = req.params.idx;
    var lecture_id = req.params.lecture_id;

    // 데이터베이스에서 해당 ID의 게시물을 찾아 삭제합니다.
    connection.query('DELETE FROM announcements WHERE idx = ?', [idx], function (error, results, fields) {
        if (error) throw error;

        // 삭제가 완료되면, 사용자를 게시물 목록 페이지로 리다이렉트합니다.
        res.send(`<script>alert('게시물이 삭제 되었습니다.'); location.href='/recent_announcements/${lecture_id}';</script>`);
    });
});


app.get('/logout', (req, res) => {
    req.session.user = null;
    res.send("<script>alert('로그아웃 되었습니다.'); location.href='/login';</script>");
});

app.get('/test', (req, res) => {
    res.send('<h1>test</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});