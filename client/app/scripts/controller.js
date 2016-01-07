angular.module('factorRoomApp')
  .controller('testCtrl', function(test_service){
  	alert('hi');
  	test_service.testService();
  })
  
.controller('AuthCtrl', function(getUserData_service, $location, $scope){
    var cookies = {};
    $scope.logout = function(){
      document.cookie="accessToken=";
      document.cookie="userId=";
      $('#btnLogout').addClass('displayNone');
      $location.path('/');
    };
    $scope.getCookieDetails = function(){
      var accessToken, userId, userName;
      if(document && document.cookie){
        var cookies = document.cookie.split(';');
        for(var i = 0;i<cookies.length; i++){
          if(cookies[i] && (cookies[i].indexOf('accessToken') > -1)){
            var authcookie1 = cookies[i].split('=');
            if(authcookie1[1] && authcookie1[1].indexOf('accessToken') === -1){
              accessToken = authcookie1[1];
            }
          }
          else if(cookies[i].indexOf('userId') > -1){
            var authcookie2 = cookies[i].split('=');
            if(authcookie2[1] && authcookie2[1].indexOf('userId') === -1)
              userId = authcookie2[1];
          }
          else if(cookies[i].indexOf('userName') > -1){
            var authcookie3 = cookies[i].split('=');
            if(authcookie3[1] && authcookie3[1].indexOf('userName') === -1)
              userName = authcookie3[1];
          }
        }
      }
      return {accessToken: accessToken, userId: userId, userName: userName};
    };
    cookies = $scope.getCookieDetails();
    if(cookies.accessToken && cookies.userId)
      $location.path('/home');
    else
      $location.path('/');
  })
  .controller('LandingCtrl', function ($scope, $location, Enum, signup_service, login_service) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.activateLogin = function() {
      $('#login-modal').show();
    }

    $scope.activateSignup = function() {
      $('#signup-modal').show();
    }

    $scope.createAcct =  function(){
      var data = {
        "firstname":$('#signup-modal #firstname').val(),
        "lastname":$('#signup-modal #lastname').val(),
        "email":$('#signup-modal #email').val(),
        "password":$('#signup-modal #password').val(),
        "role":Enum.user_roles[$('#signup-modal #userType').val().toLowerCase()]
      };
      signup_service.signup(data, {
        success:function(result){
          console.log(result);
          $location.path('/home');
        },
        error:function(error){
          alert(JSON.stringify(error));
        }
      });
    };
    $scope.login = function(){
      var data = {
        "email":$('#login-modal #email').val(),
        "password":$('#login-modal #password').val(),
      };
      login_service.login(data, {
        success:function(result){
          console.log(result);
          $location.path('/home');
        },
        error:function(error){
          alert(JSON.stringify(error));
        }
      });
    }
  })
  .controller('HomeCtrl', function ($location, User, $scope, save_data_factory, createStory_service, createKo_service, publishStory_service, unPublishStory_service, listStory_service, angularFilepicker, getUserData_service) {
    //add all dynamic data or initial functions like listStory() after the user data loads

    $scope.profile = {};

    angularFilepicker.setKey('AAOAqsj9SZCOdgsFogWc2z');

    var data = {}; // For passing to services

    // $scope.profile.bio = 'Hello';

    var cookies = $scope.getCookieDetails();
    getUserData_service.getUserData({'userId' : cookies.userId, 'id': cookies.accessToken},{
      success:function(response){
        $location.path('/home');
        $scope.userData = {};
        $scope.ko = {};
        $scope.userData = response;
        console.log(response);
        $scope.kos = [];
        if(response.avatar == undefined) {
          $scope.profile.profile_img = './images/default.png';
        }
        else {
          $scope.profile.profile_img = response.avatar;
        }
        $scope.profile.bio = response.bio;

        $scope.ko.thumbnail = './images/default.png';
        var contents;
        $scope.username = $scope.userData.firstname + ' ' + $scope.userData.lastname;
        angularFilepicker.setKey('AAOAqsj9SZCOdgsFogWc2z');

        $('#btnLogout').removeClass('displayNone');
        listStory_service.listStory({
          success : function (response) {
            console.log(response);
            $scope.kos = response;
          },
          error : function (error) {
            console.log(error);
          }
        });
      },
      error: function(error){
        $location.path('/');
      }
    });

    // Change user avatar
    $scope.changeAvatar = function() {
      angularFilepicker.pickAndStore(
            {
              mimetype : 'image/*'
            },
            {
            location:"S3",
            access: 'public'
            },
            function(Blob) {

              console.log("https://s3.amazonaws.com/durgatneogi/" + Blob[0].key);
              //$scope.ko.thumbnail = "";
              data = {
                id : cookies.userId,
                access_token : cookies.accessToken,
                avatar : "https://s3.amazonaws.com/durgatneogi/" + Blob[0].key
              };

              User.updateUserProfile(data, cookies.accessToken)
                .then(function (response) {

                    $scope.profile.profile_img = "https://s3.amazonaws.com/durgatneogi/" + Blob[0].key;

                })
                .catch(function (error) {
                  console.log(error);
                })

            }
        );
    };

    $(".editable").bind("focusout", function(){
      data = {
        id : cookies.userId,
        access_token : cookies.accessToken,
        bio : $scope.profile.bio
      };

      User.updateUserProfile(data, cookies.accessToken)
        .then(function (response) {

            // $scope.profile.profile_img = "https://s3.amazonaws.com/durgatneogi/" + Blob[0].key;

        })
        .catch(function (error) {
          console.log(error);
        })


    });


    $(function() {
      $('#myEditor').froalaEditor({
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']

        // Set the save param.
        /*saveParam: 'content',

        // Set the save URL.
        saveURL: 'http://0.0.0.0:3000/api/koModels',

        // HTTP request type.
        saveMethod: 'POST',

        // Additional save params.
        saveParams: {
          title: "TestingKo",
          description: "Testing ko",
        type:  "text",
        meat: {
          content: 'content'
        },
        thumbnail: {},
        status: "unpublished",
        authorId: 2,
        storyId: "5678a394a1d85cf655095dd6"
        }*/
      })

      .on('froalaEditor.contentChanged', function (e, editor) {
        // Do something here.
        console.log("content changed 1");
        var editorContent = editor.$box.contents()[2];
        contents = editorContent.firstChild.innerHTML;
      });


      /*.on('froalaEditor.save.before', function (e, editor) {
        // Before save request is made.
      })
      .on('froalaEditor.save.after', function (e, editor, response) {
        // After successfully save request.
      })
      .on('froalaEditor.save.error', function (e, editor, error) {
        // Do something here.
      })*/
    });
// data = { storyId : 1, status : 'published' }

    $scope.kounPublish = function (storyid) {
      var data = {
        storyId : storyid,
        status : 'unpublished'
      }

      unPublishStory_service.unPublish(data, {
        success: function (response) {
          alert('Unpublished');
          listStory_service.listStory({
            success : function (response) {
              console.log(response);
              $scope.kos = response;
            },
            error : function (error) {
              console.log(error);
            }
          });
        },
        error : function (error) {
          alert('Error');
        }
      });
    };

    $scope.kopublish = function (storyid) {
      var data = {
        storyId : storyid,
        status : 'published'
      }
      console.log(data);
      publishStory_service.publish(data, {
        success: function (response) {
          alert('Published');
          listStory_service.listStory({
            success : function (response) {
              console.log(response);
              $scope.kos = response;
            },
            error : function (error) {
              console.log(error);
            }
          });

        },
        error : function (error) {
          alert('Error');
        }
      });
    }


    $scope.uploadImage = function () {
      angularFilepicker.pickAndStore(
            {
              mimetype : 'image/*'
            },
            {
            location:"S3",
            access: 'public'
        },
            function(Blob) {

              console.log("https://s3.amazonaws.com/durgatneogi/" + Blob[0].key);
              //$scope.ko.thumbnail = "";
              $scope.$apply(function () {
                $scope.ko.thumbnail = "https://s3.amazonaws.com/durgatneogi/" + Blob[0].key;
              })
            }
        );
    }
    $scope.saveChanges = function(){
      //$('#myEditor').froalaEditor('save.save');
      if($scope.ko && $scope.ko.title && $scope.ko.title.length > 0 && $scope.ko.description && $scope.ko.description.length > 0 && $scope.ko.koWeight && $scope.ko.koWeight.length > 0 && $scope.ko.thumbnail && $scope.ko.thumbnail.length > 0&& contents && contents.length > 0){
        var data = {
          "title": $scope.ko.title,
          "description": $scope.ko.description,
          "koWeight": $scope.ko.koWeight,
          "thumbnail": $scope.ko.thumbnail,
          "type": "text",
          "meat":{
            "content": contents
          },
          "status": "unpublished",
        }

        createStory_service.createStory({
          success:function(response){
            createKo_service.createKo(data, {
              success: function(response){
                var ele = $('#myEditor').find('.fr-wrapper').find('.fr-element');
                ele.empty();
                $scope.ko.title = '';
                $scope.ko.description = '';
                $scope.ko.koWeight = '';
                $scope.ko.thumbnail = '';
                alert("successfully created story");
                $('#createStoryPart').removeClass('displayNone');
                $('#editorPart').addClass('displayNone');
                listStory_service.listStory({
                  success : function (response) {
                    console.log(response);
                    $scope.kos = response;
                  },
                  error : function (error) {
                    console.log(error);
                  }
                });
              },
              error: function(error){
                alert(JSON.stringify(error));
              }
            })

          },
          error: function(error){
            alert("not able to create story");
          }
        });
      }
      else{
        alert("Please enter all values");
      }
    };
    $scope.createStory = function(){
      $('#createStoryPart').addClass('displayNone');
      $('#editorPart').removeClass('displayNone');
    };
  })
  .controller('LogoutCtrl', function ($scope, $location) {
    document.cookie="accessToken=";
    document.cookie="userId=";
    // $('#btnLogout').addClass('displayNone');
    $location.path('/');
  })
  ;