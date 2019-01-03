const mongoose = require('mongoose');

// mongoose module의 Schema를 사용
const { Schema } = mongoose;


// Field Default Value setting
const Post = new Schema({
    title: String,
    body: String,
    tags: [String], // 문자열 배열
    publishedDate: {
        type: Date,
        default: new Date() // 현재 날짜를 기본 값으로 지정
    }
});

// model instance 생성 후 export
// parameter convention ('schema name', schema object)
module.exports = mongoose.model('Post', Post);