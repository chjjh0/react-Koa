// import middleware
const Koa = require('koa');
const Router = require ('koa-router');

// import api
const api = require('./api');

// create instance
const app = new Koa();
const router = new Router();


// router setting
router.use('/api', api.routes()).use(router.allowedMethods());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
    console.log('listening to port 4000');
});