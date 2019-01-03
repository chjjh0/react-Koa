const Router = require('koa-router');
const postCtrl = require('./posts.ctrl');

const posts = new Router();


posts.get('/', postCtrl.list);
posts.post('/', postCtrl.write);
// 검증이 필요한 곳에 미들웨어 추가
posts.get('/:id', postCtrl.checkObjectId, postCtrl.read);
posts.delete('/:id', postCtrl.checkObjectId, postCtrl.remove);
posts.patch('/:id', postCtrl.checkObjectId, postCtrl.update);

module.exports = posts;