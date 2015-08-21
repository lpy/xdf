"use strict";

var dashboardApp = angular.module('Dashboard', ['ngRoute']);
var host = "http://127.0.0.1:5001/api";
var router = {
  allAssignment: '/v1/assignments',
  allLesson: '/v1/lessons',
  lesson: '/v1/lesson',
  assignment: '/v1/assignment',
  student: '/v1/student',
  question: '/v1/question'
};


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
        $http.get(host + router.allLesson)
            .success(function(data) {
                $scope.lessons = {};
                $scope.lessonIDs = [];
                data.lessons.forEach(function(lesson) {
                    $scope.lessons[lesson["_id"]] = lesson;
                    $scope.lessonIDs.push(lesson['_id']);
                });
            });
        $http.get(host + router.allAssignment)
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
        $http.post(host + router.lesson, {
            name: $scope.add.lessonName
        }).then(function() {
          $window.location.href = "#";
          $scope.refreshData();
          $route.reload();
        });
    };

    $scope.addAssignment = function() {
        $http.post(host + router.assignment, {
            name: $scope.add.assignmentName
        }).then(function() {
          $window.location.href = "#";
          $scope.refreshData();
          $route.reload();
        });
    };

    $scope.releaseAssignment = function() {
      $http.post(host + router.assignment + '/' + $scope.release.assignmentId + '/release', {
        lessonId: $scope.release.lessonId
      }).then(function(data) {
        $scope.release.links = data.data.links
      });
    };
  }])
  .controller("AssignmentDetailController", ["$scope", "$routeParams", "$http", "$route", function($scope, $routeParams, $http, $route) {

    $scope.assignmentId = $routeParams.assignment_id;
    $scope.optionList = [];

    $http.get(host + router.assignment + "/" + $scope.assignmentId + '?studentId=admin')
      .success(function(data) {
        console.log(data);
        $scope.assignment = data.assignment;
      });

    $scope.addOption = function() {
      $scope.optionList.push($scope.add.optionContent);
      $scope.add.optionContent = "";
    };

    $scope.addQuestion = function() {
      $http.post(host + router.question, {
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
      $http.delete(host + router.question + '/' + question_id)
        .success(function() {
          $route.reload();
        })
    };

  }])
  .controller("LessonDetailController", ["$scope", "$routeParams", "$http", '$route', '$window', function($scope, $routeParams, $http, $route, $window) {

    $scope.lessonId = $routeParams.lesson_id;
    $http.get(host + router.lesson + "/" + $scope.lessonId)
      .success(function (data) {
        $scope.lesson = data.lesson;
      });

    $scope.addStudent = function() {
      $http.post(host + router.student, {
        studentId: $scope.add.studentId,
        name: $scope.add.studentName,
        lessonId: $scope.lessonId
      }).then(function() {
        $route.reload();
      });
    };

    $scope.deleteStudent = function(student_id) {
      $http.delete(host + router.student + '/' + student_id)
        .success(function() {
          $route.reload();
        })
    };

    $scope.deleteLesson = function() {
      $http.delete(host + router.lesson + '/' + $scope.lessonId)
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

dashboardApp
  .directive('bsPopover', function() {
    return function(scope, element, attrs) {
      $(element).popover();
    };
});
