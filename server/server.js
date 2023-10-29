var cookieParser = require('cookie-parser');
const express = require('express');      // Express 웹 서버 프레임워크
const cors = require('cors');
const mysql = require('mysql');          // MySQL 데이터베이스와 상호작용하기 위한 모듈
const bodyParser = require('body-parser');  // 요청 본문을 파싱하기 위한 body-parser 모듈
const axios = require('axios');
var cookie = require('cookie')
const app = express();                   // Express 애플리케이션의 인스턴스를 초기화
const port = 3001;                       // 서버가 리스닝할 포트 번호를 정의
const moment = require('moment-timezone');

app.use(cookieParser());
app.use(cors({
    credentials: true
}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({ extended: true }));         // JSON 입력을 파싱하기 위해 body-parser 미들웨어를 사용
app.use(express.json());

// 데이터베이스 설정
const db = mysql.createConnection({
    host: 'localhost',       // 호스트 주소
    user: 'root',            // 사용자 이름
    password: '1234',      // 비밀번호
    database: 'exku',         // 사용할 데이터베이스 이름
    dateStrings : "date"
});

// 데이터베이스 연결
db.connect((err) => {
    if(err) {
        console.error("MySQL 연결 실패:", err);
        return;
    }
    console.log('MySQL 연결 성공...');
});

// 루트 경로로 요청이 들어올 경우 응답
app.get('/', (req, res) => {
    res.send('서버에서 응답했습니다!');
});

app.post('/login', (req, res) => {
    const { csm_id: username, csm_pwd: password } = req.body;
    const query = 'SELECT * FROM customer WHERE csm_id = ? AND csm_pwd = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            
            console.error("Database query failed:", err);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }

        // Check if user exists
        if (results.length > 0) {
            console.log('csm_name:', results[0].csm_name);

            return res.json({ status: 'success', message: 'Login successful!', csm_name: results[0].csm_name });
            
        } else {
            console.log('Invalid username or password');
            return res.json({ status: 'fail', message: 'Invalid username or password!' });
        }
    });
});


app.post('/acceptPost/:id', (req, res) => {
    const postId = req.params.id;
    const acceptedId = req.body.acceptedId;

    const sql = "UPDATE errandpost SET Customer_csm_id = ? WHERE ernd_no = ?";
    db.query(sql, [acceptedId, postId], (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ success: true, msg: 'Post accepted successfully' });
    });
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

    db.query(sql, customer, (err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ success: true, msg: 'User registered successfully' });
    });
});

// 게시물 마커를 위해 모든 게시물 객체 가져오기
app.get('/posts', (req, res) => {
    db.query('SELECT * FROM errandpost', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No posts found' });
      }
  
      res.json(results);
    });
});

app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
    console.log(postId)
    db.query('SELECT * FROM errandpost WHERE ernd_no = ?', [postId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json(results[0]);
    });
  });

app.get('/Errandlist', (req, res) => {
    db.query('SELECT * FROM errandpost', (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json(results);
      });
    });


    app.get('/myErrand', (req, res) => {
        const userId = req.query.id;
        db.query('SELECT * FROM errandpost WHERE csm_id = ?', [userId], (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json(results);
        });
      });
    
    
      app.post('/qna', (req, res) => {
        const { qna_det, qna_time, Customer_csm_id } = req.body;
    
        const sql = "INSERT INTO qna (qna_det, qna_time, Customer_csm_id) VALUES (?, ?, ?)";
    
        db.query(sql, [qna_det, qna_time, Customer_csm_id], (err) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send({ success: true, msg: '문의사항이 성공적으로 등록되었습니다.' });
        });
    });
    
    app.put('/QnaList/:qna_no', (req, res) => {
        const qna_no = req.params.qna_no;
        console.log("Received qna_no:", qna_no);
        const qna_ans = req.body.qna_ans;
      
        if (!qna_ans) {
          return res.status(400).send({ error: "답변 내용이 필요합니다." });
        }
      
        const query = "UPDATE qna SET qna_ans = ? WHERE qna_no = ?";
        db.query(query, [qna_ans, qna_no], (err, results) => {
          if (err) {
            console.error("Error updating answer:", err);
            return res.status(500).send({ error: "서버 오류" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).send({ message: "해당 문의사항이 없습니다." });
          }
          res.send({ message: "답변이 업데이트되었습니다." });
        });
      });

    app.get('/QnaList', (req, res) => {
    
        db.query('SELECT * FROM qna', (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json(results);
      });
    });

app.get('/getErrands', (req, res) => {
    db.query("SELECT * FROM errandpost", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "success": true,
            "errands": rows
        });
    });
});

app.post('/Errand_reg', (req, res) => {
    console.log(req.body);
    const {category, position, lat, lng, reward, vtime, title, content, csm_id} = req.body;
    const sqll = "INSERT INTO errandpost(ernd_cat, ernd_pos, ernd_lat, ernd_lng, ernd_rew, ernd_vtime, ernd_title, ernd_det, csm_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const maan = [category, position, lat, lng, reward, vtime, title, content, csm_id];
    db.query(sqll, maan, (err) => {
        if(err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ success: true, msg: 'errand registered successfully' });
    });
});

app.post('/comments', (req, res) => {
    // 요청에서 필요한 데이터 추출
    const { comm_content, Customer_csm_id, comm_rec_id } = req.body;

    // 현재 시간을 가져옵니다.
    const comm_time = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

    // 데이터베이스에 저장하는 쿼리
    const query = "INSERT INTO comment (comm_content, comm_time, Customer_csm_id, comm_rec_id) VALUES (?, ?, ?, ?)";
    
    // 쿼리 실행
    db.query(query, [comm_content, comm_time, Customer_csm_id, comm_rec_id], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database Error', error: error.message });
        }
        res.status(200).json({ success: true, message: 'Comment added successfully' });
    });
});

// 수신쪽지함
app.get('/comments/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT * FROM comment WHERE comm_rec_id = ?";
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database Error', error: error.message });
        }
        res.status(200).json(results);
    });
});

// 발신 쪽지함
app.get('/sendcomments/:userId', (req, res) => {
    const userId = req.params.userId;

    // 발신한 쪽지를 가져오기 위해 Customer_csm_id 기반으로 쿼리를 작성합니다.
    const query = "SELECT * FROM comment WHERE Customer_csm_id = ?";
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database Error', error: error.message });
        }
        res.status(200).json(results);
    });
});


app.post('/payment/ready', async (req, res) => {
  try {
      const { amount } = req.body;

      const headers = {
          'Authorization': 'KakaoAK af3f9cfee314d59416184f2c1830b7ed',
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      };

      const data = {
          cid: 'TC0ONETIME',
          partner_order_id: 'partner_order_id',
          partner_user_id: 'partner_user_id',
          item_name: '포인트',
          quantity: '1',
          total_amount: amount,
          vat_amount: '0',
          tax_free_amount: '0',
          approval_url: 'http://localhost:3001/payment/approve',
          cancel_url: 'http://localhost:3001/Pay',
          fail_url: 'http://localhost:3001/Pay',
      };

      const formData = new URLSearchParams();
      for (const key in data) {
          formData.append(key, data[key]);
      }

      const response = await axios.post('https://kapi.kakao.com/v1/payment/ready', formData, { headers: headers });

      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
  }
});

app.get('/payment/approve', async (req, res) => {
  try {
      const pg_token = req.query.pg_token;
      console.log('Received pg_token:', pg_token);

      if (!pg_token) {
          return res.status(400).send({ error: "pg_token is required" });
      }

      const headers = {
          'Authorization': 'KakaoAK af3f9cfee314d59416184f2c1830b7ed',
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      };

      const data = {
        cid: 'TC0ONETIME',
        partner_order_id: 'partner_order_id',
        partner_user_id: 'partner_user_id',
       
        
    };

      const formData = new URLSearchParams();
      for (const key in data) {
          formData.append(key, data[key]);
      }

      const response = await axios.post('https://kapi.kakao.com/v1/payment/approve', formData, { headers: headers });

      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
  }
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


app.post('/completeTransaction', (req, res) => {
  const { postId, reward, writerId, executorId } = req.body;

  // writerId의 현재 포인트를 가져옵니다.
  let checkWriterPoints = `SELECT csm_pt FROM customer WHERE csm_id = ?`;

  db.query(checkWriterPoints, [writerId], (err, result) => {
    if (err) {
      res.json({ success: false, msg: '포인트 확인 중 오류 발생' });
      return;
    }

    // 포인트가 reward보다 작다면 거래를 진행하지 않습니다.
    if (result[0].csm_pt < reward) {
      res.json({ success: false, msg: '포인트가 부족합니다.' });
      return;
    }

    // writerId의 포인트 감소
    let decreaseWriterPoints = `UPDATE customer SET csm_pt = csm_pt - ? WHERE csm_id = ?`;

    // executorId의 포인트 증가
    let increaseExecutorPoints = `UPDATE customer SET csm_pt = csm_pt + ? WHERE csm_id = ?`;

    // errandpost의 ernd_acpt 업데이트
    let updatePost = `UPDATE errandpost SET ernd_acpt = TRUE WHERE ernd_no = ?`;

    // 포인트 확인 후에 모든 거래를 진행합니다.
    db.query(decreaseWriterPoints, [reward, writerId], (err, result) => {
      if (err) {
        res.json({ success: false, msg: '거래 성사 중 오류 발생' });
        return;
      }

      db.query(increaseExecutorPoints, [reward, executorId], (err, result) => {
        if (err) {
          res.json({ success: false, msg: '거래 성사 중 오류 발생' });
          return;
        }

        db.query(updatePost, [postId], (err, result) => {
          if (err) {
            res.json({ success: false, msg: '거래 성사 중 오류 발생' });
          } else {
            res.json({ success: true, msg: '거래 성사 완료!' });
          }
        });
      });
    });
  });
});

// 서버 시작
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});

app.use((req, res, next) => {
  res.status(404).send({ error: "Not found!" });
});
app.listen(port, () => {
    console.log(`${port} 포트에서 서버가 시작되었습니다.`);
});



