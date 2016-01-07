angular.module('factorRoomApp')
.service('test_service', function (){
	var getdata_service = {};
	getdata_service.testService = function(data, cb){
		alert("fine");
	};
	return getdata_service;
})

.service('angularFilepicker', function($window){
	return $window.filepicker;
})

.service('User', function ($q, $http, save_data_factory, Enum) {
		return {
			updateUserProfile : function (data, accessToken) {
				var deffered = $q.defer();
				console.log(data);
				// var userData = save_data_factory.get();
				$http({
					method : 'PUT',
					url : Enum.API_URL.loopback + 'users/'+data.id+'?access_token=' + accessToken,
					data : data
				})
				.success(function (data, status, headers, config) {
					console.log(data);
					deffered.resolve(data);
				})
				.error (function (data, status, headers, config) {
					console.log(data);
					deffered.reject(data);
				});

				return deffered.promise;

			}
		}
	})


	// End of User service


	.service('signup_service', function ($http, login_service, Enum){
		var sign_up_service = {};
		sign_up_service.signup = function(data, cb){
			$http({
		        method: 'POST',
		        url: Enum.API_URL.loopback + 'users',
		        data: data
		    }).success(function(response){
		    	login_service.login({
		    		"email":data.email,
		    		"password":data.password
		    	},cb);
	        }).error(function(error) {
				cb.error(error);
	        });
		};
		return sign_up_service;
	})
	.service('login_service', function ($http, save_data_factory, getUserData_service, Enum){
		var log_service = {};
		log_service.login = function(data, cb){
			$http({
		        method: 'POST',
		        url: Enum.API_URL.loopback + 'users/login',
		        data: data
		    }).success(function(response){
		    	document.cookie = "accessToken="+response.id;
		    	document.cookie = "userId="+response.userId;
		    	document.cookie = "userName="+response.firstname + ' ' + response.lastname;
		    	save_data_factory.setAuthData(response);
				getUserData_service.getUserData(response, cb);
	        }).error(function(error) {
				cb.error(error);
	        });
		};
		return log_service;
	})
	.service('getUserData_service', function ($http, save_data_factory, Enum){
		var getdata_service = {};
		getdata_service.getUserData = function(data, cb){
			$http({
		        method: 'GET',
		        url: Enum.API_URL.loopback + 'users/' + data.userId + '?access_token=' + data.id
		    }).success(function(response){
		    	save_data_factory.set(response);
		    	document.cookie = "userName="+response.firstname + ' ' + response.lastname;
				cb.success(response);
	        }).error(function(error) {
				cb.error(error);
	        });
		};
		return getdata_service;
	})
	.service('createStory_service', function ($http, save_data_factory, Enum){
		var createStory_ser = {};
		createStory_ser.createStory = function(cb){
			var authData = save_data_factory.get();
			var data = {
				"authorId": authData.id
			}
			$http({
				method: 'POST',
				url: Enum.API_URL.loopback + 'storyModels',
				data: data
			}).success(function(response){
				var a = response;
				save_data_factory.setCurrentStoryId(response.id);
				if(cb)
					cb.success(response);
	        }).error(function(error) {
				cb.error(error);
	        });
		};
		return createStory_ser;
	})
	.service('createKo_service', function ($http, save_data_factory, Enum){
		var createKo_ser = {};
		createKo_ser.createKo = function(data, cb){
			var dateIns = new Date();
			var time = dateIns.toTimeString(),
			month = Enum.month[dateIns.getMonth()],
			day = dateIns.getDate(),
			year = dateIns.getFullYear();
			var storyId = save_data_factory.getCurrentStoryId();
			var authData = save_data_factory.get();

			data.storyId = storyId;
			data.authorId =  authData.id;
			data.authorDate = data.publishDate = month + ',' + day + ',' + year;
			data.authorTime = data.publishTime = time;

			$http({
				method: 'POST',
				url: Enum.API_URL.loopback + 'koModels',
				data: data
			}).success(function(response){
				if(cb)
					cb.success(response);
	        }).error(function(error) {
				cb.error(error);
	        });
		};
		return createKo_ser;
	})
	.service('listStory_service', function ($http, Enum, save_data_factory) {
		var listStory_ser = {};
		listStory_ser.listStory = function (cb) {
			var userData = save_data_factory.get();
			console.log(userData);
			$http({
				method : 'GET',
				url: Enum.API_URL.loopback + 'koModels?filter[where][authorId]=' + userData.id
			})
			.success(function (response) {
				console.log(response);
				if(cb)
					cb.success(response);

			})
			.error(function (error) {
				cb.error(error);
			});
		};
		return listStory_ser;
	})
	.service('publishStory_service', function ($http, Enum) {
		var publishStory_ser = {};
		publishStory_ser.publish = function (data, cb) {
			$http({
		    method : 'POST',
		    url : Enum.API_URL.loopback + 'koModels/update?where[storyId]='+data.storyId,
		    data : data
		   })
			.success(function (response) {
				if(cb)
					cb.success(response);
			})
			.error(function (error) {
				cb.error(error);
			})
		};
		return publishStory_ser;
	})
	.service('unPublishStory_service', function ($http, Enum) {
		var unpublishStory_ser = {};
		unpublishStory_ser.unPublish = function (data, cb) {
			$http({
				method : 'POST',
				url : Enum.API_URL.loopback + 'koModels/update?where[storyId]='+data.storyId,
				data : data
			})
			.success(function (response) {
				if(cb)
					cb.success(response);
			})
			.error(function (error) {
				cb.error(error);
			})
		};
		return unpublishStory_ser;
	})

	;