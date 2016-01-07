angular.module('factorRoomApp')
	.factory('save_data_factory', function() {
		var savedData = {};
		var authdata = {}, currentStoryId;
		return {
			setCurrentStoryId: function(id){
				currentStoryId = id;
			},
			getCurrentStoryId: function(){
				return currentStoryId;
			},
			setAuthData: function(data){
				authdata = data;
			},
			getAuthData: function(){
				return authdata;
			},
			set: function(data) {
				savedData = data;
			},
			get: function() {
				return savedData;
			}
		};
	});