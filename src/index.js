// .env 활성화
// moongoose로 DB 연결
require('dotenv').config();
const mongoose = require('mongoose');

const {
    PORT: port = 4000,  // 값이 존재하지 않는다면 4000을 기본 값으로 사용
    MONGO_URI: mongoURI
} = process.env;

// Node의 Promise를 사용하도록 설정
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
    console.log('connected to mongodb');
}).catch((e) => {
    console.error(e);
});

// import middleware
const Koa = require('koa');
const Router = require ('koa-router');
const bodyParser = require('koa-bodyparser');

// import api
const api = require('./api');

// create instance
const app = new Koa();
const router = new Router();


// router setting
router.use('/api', api.routes()).use(router.allowedMethods());

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log('listening to port', port);
});