const Koa = require('koa');
const app = new Koa();

app.use((ctx) => {
    ctx.body = 'hello world';
});

app.listen(4000, () => {
    console.log('listening to port 4000');
});