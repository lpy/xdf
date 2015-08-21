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



var query = getQuery(window.location.href);
var studentId = query.s,
    assignmentId = query.a;

// function init(callback) {

//     $.get(
//       "/api/v1/assignment/<assignment_id>?studentId=".replace(/\<\w+\>/,assignmentId) + studentId ,
//       function(data) {
//         var assignment = {
//           name:"作业名",
//           questionNum: 10,
//           questionList: [
//             {
//               answer: 1,
//               answerContent: "答案解析",
//               assignmentId: "123",
//               audio: "",
//               content: "问题内容丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽",
//               optionList: [
//                 "ツをおいしく食べ",
//                 "ツをおいしく食べ",
//                 "ツをおいしく食べ",
//                 "ツをおいしく食べ"
//               ]
//             }
//           ]
//         };
//         localStorage.setItem("data",JSON.stringify(assignment));
//         callback();
//       },
//       function(error) {
//         alert("获取数据失败");
//       }
//       );
// }
var assignment = {
  name:"日语第一课作业",
  questionNum: 10,
  questionList: [
    {
      answer: 1,
      answerContent: "答案解析",
      assignmentId: "123",
      audio: "",
      content: "问题内容丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽",
      optionList: [
        "ツをおいしく食べ",
        "ツをおいしく食べ",
        "ツをおいしく食べ",
        "ツをおいしく食べ"
      ]
    },
    {
      answer: 3,
      answerContent: "答案解析",
      assignmentId: "123",
      audio: "",
      content: "问题内容丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽",
      optionList: [
        "ツをおいしく食べ",
        "ツをおいしく食べ",
        "ツをおいしく食べ",
        "ツをおいしく食べ"
      ]
    }
  ]
}; //作业数据
var answerSheet = assignment.questionList.map(function(){
  return -1;
}); //用户答题
localStorage.setItem("assignment",JSON.stringify(assignment));
localStorage.setItem("answerSheet",JSON.stringify(answerSheet));

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
//将匹配的路由渲染到 DOM 中
Router.run(routes, Router.HashLocation, function(Root){  
  React.render(<Root />, document.body);
});

// init(function(){
//   // 将匹配的路由渲染到 DOM 中
//   Router.run(routes, Router.HashLocation, function(Root){  
//     React.render(<Root />, document.body);
//   });
// });

module.exports = App;