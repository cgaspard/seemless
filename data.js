var Data = {

	APIObjectName : "Data",

	Name: "arcticfox",
	
	Entities : {

		getList : function() {
			console.log("Calling Data.Entities.getList()");
			return  [{"id" : 1},{"id": 2}];
		},

		getList2 : function() {
			console.log("Calling Data.Entities.getList()");
			return  [{"id" : 1},{"id": 2}];
		},

		APIObjectName : "Entities",	
		
		User : {
			APIObjectName: "User",

			table : "tblusers",

			getAll : function() {
				return  {"id" : "1234", "name" : "test"};
			}

		},
	
		Order : {
			APIObjectName: "Order",
			table : "tblorders"
		}
	}



}

module.exports = Data;