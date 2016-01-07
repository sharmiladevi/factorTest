angular.module('factorRoomApp')
	.constant('Enum', {
		user_roles: {
			'admin':1,
			'editor':2,
			'author':3,
			'contributor':4,
			'reader':0
		},
		API_URL: {
			'loopback':'http://ec2-52-23-248-96.compute-1.amazonaws.com:3000/api/'
		},
		month: {
			0: "JAN",
			1: "FEB",
			2: "MAR",
			3: "APR",
			4: "MAY",
			5: "JUN",
			6: "JUL",
			7: "AUG",
			8: "SEP",
			9: "OCT",
			10: "NOV",
			11: "DEC"
		}
	})
	;