const express = require('express'),
      bodyParser = require('body-parser'),
      mysql = require('mysql'),
      nodemailer = require('nodemailer'),
      cors = require('cors');

const app = express();

const conn = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '111111',
        database: 'o3'
    }
);
conn.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

app.use(cors());  // cors 허용

// 모든 상담 케이스
app.get('/counsels', (req, res)=>{
    let sql = 'SELECT * FROM info';

    conn.query(sql, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else{
            res.json(results);
        }
    });
});

// 특정 상담케이스 1개 창
app.get('/counsels/:id', (req, res)=>{
    let id = req.params.id;

    let sql = 'SELECT * FROM info WHERE id=?';

    conn.query(sql, [id], (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else{
            res.json(results);
        }
    });
});

// (챗봇에서 링크타고 넘어왔을 때 정보 받아 보여주는 상담케이스 목록: 지역/나이/성별/치료분야)
app.get('/counsels/:location/:age/:sex/:category', (req, res)=>{
    let location = req.params.location,
        age_users = req.params.age,
        sex_users = req.params.sex,
        category = req.params.category;
    
    let sql = 'SELECT * FROM info WHERE (location=? OR age_users=? OR sex_users=? OR category=?)';
    
    conn.query(sql, [location, age_users, sex_users, category], (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else{
            res.json(results);
        }
    });
});

// 사용자의 상담 신청
app.get('/users', (req, res)=>{

});

// 사용자 상담 정보 받기
app.post('/users', (req, res)=>{
    let name_input = req.body.name,
        phoneNumber_input = req.body.phoneNumber,
        description_input = req.body.description;

    // 신청자 정보 메일 전송
    let transporter = nodemailer.createTransport({
        service: 'naver',
        auth: {
            user: 'heech1013@naver.com',
            pass: 'gozjxhsxptmxm' // (해커톤테스트)
        }
    });
    let mailOption = {
        from: 'heech1013@naver.com',
        to: 'heech1013@naver.com', // 신청 대상
        subject: `[상담, 여기!] ${name_input}님이 상담신청을 하였습니다.`,
        text: `신청자 이름: ${name_input}, 전화번호: ${phoneNumber_input}, 상담내용: ${description_input}`
    };
    transporter.sendMail(mailOption, (err, info)=>{
        if(err){
            console.log(err);
        } else{
            console.log(`Email sent!: ${name_input}`);
            res.status(200).send('successfully applied');
        }
        transporter.close();
    });
});

app.listen(3000, ()=>{
    console.log('server connected.');
});