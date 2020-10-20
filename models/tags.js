var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var TagsSchema = new Schema({
	name: { type: String},
	company_id: {type: String},
});

mongoose.model('Tags', TagsSchema);
