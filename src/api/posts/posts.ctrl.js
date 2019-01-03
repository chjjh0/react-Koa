const { ObjectId } = require('mongoose').Types;
const Post = require('models/post');
const Joi = require('joi');

// objectId 검증
exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    
    // 검증 실패: 없는 ID로 요청이 들어오면 400 error 반환
    // ID가 자릿수가 맞지 않을 때 발생
    // 자릿수는 맞는데 없는 ID면 bad request 발생
    if(!ObjectId.isValid(id)) {
        ctx.status = 400;
        return null;
    }

    // next를 리턴해야 ctx.body가 제대로 설정됨
    return next();
};


// POST /api/postMessage
// { title, body, tags }
exports.write = async (ctx) => {
    // 객체가 빈 값인지 검증
    const schema = Joi.object().keys({
        // required()가 붙으면 필수항목이라는 의미
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required() // 문자열 배열
    });
    // parameter convention (검증할 객체, schema)
    const result = Joi.validate(ctx.request.body, schema);

    // error 응답
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
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
    // default page 수는 1
    // query는 문자열이므로 숫자로 형변환
    const page = parseInt(ctx.query.page || 1, 10);

    // 잘못된 페이지가 주어지면 error
    if(page<1) {
        ctx.status = 400;
        return;
    }

    try {
        // find() 함수 후에 exec()를 붙여줘야 서버에 쿼리를 요청
        // sort() _id를 기준으로 -1: 내림차순 1: 오름차순
        // limit() 보이는 개수 제한 10개씩 보이기
        // skip() 
        //   1페이지면 1-1 = 0 * 10 = 0이므로 0개 뛰어 넘어 limit 함수에서 지정한 10개만큼 표시
        //   2페이지면 2-1 = 1 * 10 = 10이므로 10개 뛰어 넘어 10개만큼 표시하기에, 20번째부터 10개 표시 됨
        // lean() 반환형을 JSON형태로 반환
        const posts = await Post.find()
            .sort({_id:-1})
            .limit(10)
            .skip((page - 1) * 10)
            .lean()
            .exec();
        // 마지막 페이지 알려주기
        const postCount = await Post.count().exec();
        const limitBodyLength = post => ({
            ...post,
            body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
        });
        // ctx.set은 response header를 설정
        ctx.set('Last-Page', Math.ceil(postCount /10));
        ctx.body = posts.map(limitBodyLength);
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