var React = require('react');
var $ = require('jquery');
require("../less/common.less");
var Welcome = require('./welcome.jsx');
var Quiz = require('./quiz.jsx');
var Result = require('./result.jsx');
var Explanation = require('./explanation.jsx');
var Router = require('react-router');   
var getQuery = require('./getQuery.js');
var Route = Router.Route;  
var RouteHandler = Router.RouteHandler;  
var Link = Router.Link;  
var DefaultRoute = Router.DefaultRoute;
var StateMixin = Router.State;  
var apiHost = require('./config.js').apiHost;
var soundManager = require('./soundmanager/script/soundmanager2-jsmin.js').soundManager;//test

React.initializeTouchEvents(true);

// var canplay = [];
// var cannotplay = [];
// var testList = ["audio/mp3","audio/m4a","audio/acc","audio/wav","audio/ogg"];


// soundManager.setup({
 
//   url: './soundmanager/swf',
//   onready: function() {
//     testList.forEach(function(type){
//       if(soundManager.canPlayMIME(type)) {
//         canplay.push(type);
//       }else {
//         cannotplay.push(type);
//       }

//     });
//     alert('能播放'+canplay.join(',')+";不能播放"+cannotplay.join(",")) ;

    
//   }
// });


var App = React.createClass({

	render: function() {
		return (
			<RouteHandler />
		);
	}

});
// 定义页面上的路由
var routes = (  
  <Route handler={App}>
    <Route name="welcome" handler={Welcome} />
    <Route name="quiz" path="/quiz/:index" handler={Quiz} />
    <Route name="result" path="/result/:score" handler={Result}/>
    <Route name="explanation" path="/explanation/:index" handler={Explanation}/>
    <DefaultRoute handler={Welcome} />
  </Route>
);

// var assignment = {
//   name:"日语第一课作业很长很长很长长很",
//   questionNum: 10,
//   questionList: [
//     {
//       answer: 1,
//       answerContent: "答案解析",
//       assignmentId: "123",
//       audio: "shinian.mp3",
//       content: "问题内容丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽",
//       optionList: [
//         "ツをおいしく食べ",
//         "ツをおいしく食べ",
//         "ツをおいしく食べ",
//         "ツをおいしく食べ"
//       ]
//     },
//     {
//       answer: 3,
//       answerContent: "答案解析",
//       assignmentId: "123",
//       audio: "test.mp3",
//       content: "问题内容丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽",
//       optionList: [
//         "ツをおいしく食べ",
//         "ツをおいしく食べ",
//         "ツをおいしく食べ",
//         "ツをおいしく食べ"
//       ]
//     }
//   ]
// }; //作业数据
// var answerSheet = assignment.questionList.map(function(){
//   return -1;
// }); //用户答题
// localStorage.setItem("assignment",JSON.stringify(assignment));
// localStorage.setItem("answerSheet",JSON.stringify(answerSheet));
// localStorage.setItem("score",'12');
// // 将匹配的路由渲染到 DOM 中
// Router.run(routes, Router.HashLocation, function(Root){  
//   React.render(<Root />, document.body);
// });

var query = getQuery(window.location.href);
var studentId = query.s,
    assignmentId = query.a;

localStorage.setItem("assignment","");
localStorage.setItem("answerSheet","");
localStorage.setItem("score",""); //清空本地存储

function init(callback) {
    console.log('init');
    $.ajax({
      url: apiHost + "/api/v1/assignment/<assignment_id>?studentId=".replace(/\<\w+\>/,assignmentId) + studentId ,
      success: function(data) {
        console.log(data);
        var assignment = data.assignment;//作业数据
        var answerSheet = assignment.questionList.map(function(){
          return -1;
        }); //用户答题
        localStorage.setItem("assignment",JSON.stringify(assignment));
        localStorage.setItem("answerSheet",JSON.stringify(answerSheet));
        callback();
      }
    })

}

init(function(){

  // 将匹配的路由渲染到 DOM 中
  Router.run(routes, Router.HashLocation, function(Root){  
    React.render(<Root />, document.body);
  });
});

module.exports = App;