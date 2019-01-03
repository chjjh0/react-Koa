const Post = require('models/post');


// POST /api/postMessage
// { title, body, tags }
exports.write = async (ctx) => {
    const { title, body, tags } = ctx.request.body;

    // Create New Post Instance
    // 파라미터에 위에서 만든 객체를 넣음
    const post = new Post({
        title, body, tags
    });
    
    try {
        // DB에 등록/저장
        // await를 사용하여 저장될 때까지 기다림
        await post.save();
        // 저장된 결과를 반환
        ctx.body = post;
    } catch(e) {
        // DB의 오류가 발생
        ctx.throw(e, 500);
    }
};

// GET /api/posts
exports.list = async (ctx) => {
    try {
        // find() 함수 후에 exec()를 붙여줘야 서버에 쿼리를 요청
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch(e) {
        ctx.throw(e, 500);
    }
};
// GET /api/posts/:id
exports.read = async (ctx) => {
    const { id } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        // 포스트가 존재하지 않습니다
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

// DELETE /api/posts/:id
exports.remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e) {
        e.throw(e, 500);
    }
};

// PATCH /api/posts/:id
exports.update = async (ctx) => {
    const { id } = ctx.params;
    try {
        // 부분수정이 가능하기 때문에 ctx.request.body로 받음
        // 강제 전체 수정이라면 선언한 post를 넣어도 됨
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true
            // 이 값을 설정해야 업데이트 된 객체를 반환
            // 설정하지 않으면 업데이트 되기 전의 객체를 반환
        }).exec();
        // 포스트가 존재하지 않을 때
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};