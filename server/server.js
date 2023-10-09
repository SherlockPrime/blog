const express = require('express');      // Express 웹 서버 프레임워크
const cors = require('cors');
const mysql = require('mysql');          // MySQL 데이터베이스와 상호작용하기 위한 모듈
const bodyParser = require('body-parser');  // 요청 본문을 파싱하기 위한 body-parser 모듈

const app = express();                   // Express 애플리케이션의 인스턴스를 초기화
const port = 3001;                       // 서버가 리스닝할 포트 번호를 정의

app.use(cors());
app.use(bodyParser.json());               // JSON 입력을 파싱하기 위해 body-parser 미들웨어를 사용

// 데이터베이스 설정
const db = mysql.createConnection({
    host: 'localhost',       // 호스트 주소
    user: 'root',            // 사용자 이름
    password: '1234',        // 비밀번호
    database: 'exKU'         // 사용할 데이터베이스 이름
});

// 데이터베이스 연결
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL 연결 성공...');
});

// 루트 경로로 요청이 들어올 경우 응답
app.get('/', (req, res) => {
    res.send('서버에서 응답했습니다!');
});

app.post('/signup', (req, res) => {
    const { csm_id, csm_pwd, csm_pwdA, csm_name, csm_pNo, csm_birth, csm_email } = req.body;

    if (csm_pwd !== csm_pwdA) {
        return res.status(400).send({ error: 'Passwords do not match.' });
    }


    const sql = "INSERT INTO Customer SET ?";
    const customer = {
        csm_id, csm_pwd, csm_name, csm_pNo, csm_birth, csm_email
    };

    db.query(sql, customer, (err, result) => {
        if (err) throw err;
        res.send({ success: true, msg: 'User registered successfully' });
    });
});

// 모든 고객 정보를 가져오기
app.get('/customers', (req, res) => {
    let sql = 'SELECT * FROM Customer';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// 특정 ID를 가진 고객 정보를 가져오기
app.get('/customer/:id', (req, res) => {
    let sql = `SELECT * FROM Customer WHERE csm_id = ${db.escape(req.params.id)}`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`${port} 포트에서 서버가 시작되었습니다.`);
});
