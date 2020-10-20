/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
var tools = require('../common/tools');

module.exports = function (schema, options) {
	schema.pre('save', function (next) {
		this.updated_time = new Date();
		next();
	});

	schema.set('timestamps', { createdAt: 'created_time', updatedAt: 'updated_time' });
	schema.set('toJSON', {
		transform: function (doc, ret, options) {
		  ret.created_time = tools.formatDate(ret.created_time)
		  ret.updated_time = tools.formatDate(ret.updated_time)
		  return ret
		}
	})
};
