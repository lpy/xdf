"use strict";

var dashboardApp = angular.module('Dashboard', ['ngRoute']);
var host = "http://59.157.4.42:5001";
var apiHost = "http://59.157.4.42:5001/api";
var router = {
  audio: '/v1/audio',
  allAssignment: '/v1/assignments',
  allLesson: '/v1/lessons',
  lesson: '/v1/lesson',
  assignment: '/v1/assignment',
  student: '/v1/student',
  question: '/v1/question'
};


dashboardApp
  .directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
  .directive('bsPopover', function() {
    return function(scope, element) {
      $(element).popover();
    };
});

dashboardApp
  .service('audioUpload', ['$http', function ($http) {
  this.uploadAudioToUrl = function(file, assignment_id, id, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);
    fd.append('assignmentId', assignment_id);
    fd.append('id', id);
    console.log(fd);
    $http
      .post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
      .success(function(){

      })
      .error(function(){
      });
    }
}]);


dashboardApp
  .controller("MainController", ['$scope', '$http', function($scope, $http) {
    $scope.display = {
      assignment: "none",
      lesson: "none",
      analysis: "none"
    };

    $scope.assignmentIDs = [];
    $scope.assignments = {};

    $scope.lessonIDs = [];
    $scope.lessons = {};

    $scope.studentIDs = [];
    $scope.students = {};

    $scope.showAssignmentSidebar = function() {
      $scope.display.assignment = "block";
      $scope.display.analysis = "none";
      $scope.display.lesson = "none";
    };
    
    $scope.showLessonSidebar = function() {
      $scope.display.assignment = "none";
      $scope.display.analysis = "none";
      $scope.display.lesson = "block";
    };
    
    $scope.generateAssignment = function() {
    };
    
    $scope.refreshData = function() {
      $scope.display.assignment = "none";
      $scope.display.analysis = "none";
      $scope.display.lesson = "none";
        $http.get(apiHost + router.allLesson)
            .success(function(data) {
                $scope.lessons = {};
                $scope.lessonIDs = [];
                data.lessons.forEach(function(lesson) {
                    $scope.lessons[lesson["_id"]] = lesson;
                    $scope.lessonIDs.push(lesson['_id']);
                });
            });
        $http.get(apiHost + router.allAssignment)
          .success(function(data) {
            $scope.assignments = {};
            $scope.assignmentIDs = [];
            data.assignments.forEach(function(assignment) {
              $scope.assignments[assignment["_id"]] = assignment;
              $scope.assignmentIDs.push(assignment["_id"]);
            });
          });
    };

    $scope.refreshData();
  }])
  .controller("AddController", ['$scope', '$http', '$window', function($scope, $http, $window) {

    $scope.release = {
      links: []
    };

    $scope.addLesson = function() {
        $http.post(apiHost + router.lesson, {
            name: $scope.add.lessonName
        }).then(function() {
          $window.location.href = "#";
          $scope.refreshData();
          $route.reload();
        });
    };

    $scope.addAssignment = function() {
        $http.post(apiHost + router.assignment, {
            name: $scope.add.assignmentName
        }).then(function() {
          $window.location.href = "#";
          $scope.refreshData();
          $route.reload();
        });
    };

    $scope.releaseAssignment = function() {
      $http.post(apiHost + router.assignment + '/' + $scope.release.assignmentId + '/release', {
        lessonId: $scope.release.lessonId
      }).then(function(data) {
        $scope.release.links = data.data.links;
        $scope.release.studentIds = data.data.studentIds;
        $scope.release.studentNames = data.data.studentNames;
        $scope.release.excel = host + '/excel/' + data.data.excel;
      });
    };

    $scope.clear = function() {
      $scope.release.links = [];
      $scope.release.studentIds = [];
      $scope.release.studentNames = [];
      $scope.release.excel = "";
    };
  }])
  .controller("AssignmentDetailController", ["$scope", "$routeParams", "$http", "$route", "audioUpload", function($scope, $routeParams, $http, $route, audioUpload) {

    $scope.assignmentId = $routeParams.assignment_id;
    $scope.optionList = [];

    $http.get(apiHost + router.assignment + "/" + $scope.assignmentId + '?studentId=admin')
      .success(function(data) {
        console.log(data);
        $scope.assignment = data.assignment;
      });

    $scope.addOption = function() {
      $scope.optionList.push($scope.add.optionContent);
      $scope.add.optionContent = "";
    };

    $scope.addQuestion = function() {
      $http.post(apiHost + router.question, {
        assignmentId: $scope.assignmentId,
        content: $scope.add.content,
        optionList: JSON.stringify($scope.optionList),
        answer: $scope.add.answer,
        answerContent: $scope.add.answerContent,
        audio: ""
      }).then(function(data) {
        console.log(data);
        $route.reload();
      });
    };

    $scope.deleteQuestion = function(question_id) {
      $http.delete(apiHost + router.question + '/' + question_id)
        .success(function() {
          $route.reload();
        })
    };

    $scope.uploadAudio = function() {
      var file = $scope.audio;
      var id = 1;
      if ($scope.assignment.questionList) {
        id = $scope.assignment.questionList.length + 1;
      }
      var uploadUrl = apiHost + router.audio;
      audioUpload.uploadAudioToUrl(file, $scope.assignmentId, id, uploadUrl);
    };

  }])
  .controller("LessonDetailController", ["$scope", "$routeParams", "$http", '$route', '$window', function($scope, $routeParams, $http, $route, $window) {

    $scope.lessonId = $routeParams.lesson_id;
    $http.get(apiHost + router.lesson + "/" + $scope.lessonId)
      .success(function (data) {
        $scope.lesson = data.lesson;
      });

    $scope.addStudent = function() {
      $http.post(apiHost + router.student, {
        studentId: $scope.add.studentId,
        name: $scope.add.studentName,
        lessonId: $scope.lessonId
      }).then(function() {
        $route.reload();
      });
    };

    $scope.deleteStudent = function(student_id) {
      $http.delete(apiHost + router.student + '/' + student_id)
        .success(function() {
          $route.reload();
        })
    };

    $scope.deleteLesson = function() {
      $http.delete(apiHost + router.lesson + '/' + $scope.lessonId)
        .success(function() {
          $window.location.href = "#";
          $scope.refreshData();
          $route.reload();
        })
    };

  }]);

  
dashboardApp
  .config(['$routeProvider', function($routeProvider) {

    $routeProvider
      .when('/assignment/:assignment_id', {
        templateUrl: '/static/assignment-detail.html',
        controller: 'AssignmentDetailController'
      })
      .when('/lesson/:lesson_id', {
        templateUrl: '/static/lesson-detail.html',
        controller: 'LessonDetailController'
      });
  }]);


dashboardApp
  .filter('numberToCharacter', function() {
    return function(num) {
      return String.fromCharCode(65 + num);
    }
  });
