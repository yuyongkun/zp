// CRUD SQL语句
var serviceModel = {
    insert: 'INSERT INTO service(type,content) VALUES(?,?)',
    update: 'update service set content=? where type=?',
    delete: 'delete from service where type=?',
    queryContentByType: 'select content from service where type=?',
    queryType: 'select type from service where type=?',
};

module.exports = serviceModel;
