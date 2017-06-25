// CRUD SQL语句
var serviceModel = {
    insert: 'INSERT INTO service(type,content_zh,content_en) VALUES(?,?,?)',
    update: 'update service set content_zh=?,content_en=? where type=?',
    delete: 'delete from service where type=?',
    queryContentByType: 'select content_zh,content_en from service where type=?',
    queryType: 'select type from service where type=?',
};

module.exports = serviceModel;


