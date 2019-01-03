const Router = require('koa-router');
const postCtrl = require('./posts.ctrl');

const posts = new Router();


posts.get('/', postCtrl.list);
posts.post('/', postCtrl.write);
posts.get('/:id', postCtrl.read);
posts.delete('/:id', postCtrl.remove);
posts.patch('/:id', postCtrl.update);

module.exports = posts;