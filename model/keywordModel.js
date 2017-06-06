// CRUD SQL语句
var keywordModel = {
    insert: 'INSERT INTO keyword(id,number,keyword,describes) VALUES(?,?,?,?)',
    update: 'update keyword set keyword=?,describes=? where number=?',
    queryKeyword: 'select * from keyword where number=?',
};

module.exports = keywordModel;
