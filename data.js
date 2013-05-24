var Mapper = require('mapper');

var conn = { user: 'root', password: 'addison123', database: 'mygait' };

// set verbose flag to trace SQL
// set strict to be warned of invalid columns in JSON objects
Mapper.connect(conn, {verbose: true, strict: false});

var MyGait = {

	Init : function  () {
		console.log("Adding mapt for tblusers");
		this.User = Mapper.map("tblusers", "id");
	}
	
};

MyGait.Init();


var Data = {

	//APIObjectName : "Data",

	Name: "arcticfox",
	
	Entities : {

		User : {
			Get : function(id) {
				var myCallback = arguments[arguments.length - 1];

				MyGait.User.where({"id":id}).one(function(err, user) {
					myCallback(err, user);
				});
			},
			Where : function(whereCondition) {

			},
			Add : function() {

			},
			Update : function() {

			},
			Delete : function() {

			}
		},

		Order : {
			table : "tblorders"
		}
	}
}

module.exports = Data;