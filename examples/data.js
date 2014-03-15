var Data = {
	Entities : {
		User : {
			Get : function(userToGet) {
				for (var i = Users.length - 1; i >= 0; i--) {
					if(Users[i].id == userToGet) {
						return Users[i];

					}
				};
				return null;
			},

			List : function() {
				return Users;

			}
		}
	}
};

var Users = [
	{id: 4916, firstname :"Corey", lastname: "Gaspard"}, 
	{id: 1235, firstname :"John", lastname: "Doe"}
];

module.exports = Data;