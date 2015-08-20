var React = require('react');
require("../less/common.less");
var Welcome = require('./welcome.jsx');
var Quiz = require('./quiz.jsx');
var Result = require('./result.jsx');
var Explanation = require('./explanation.jsx');
var Router = require('react-router');   
var Route = Router.Route;  
var RouteHandler = Router.RouteHandler;  
var Link = Router.Link;  
var DefaultRoute = Router.DefaultRoute;
var StateMixin = Router.State;  

localStorage.setItem("data",JSON.stringify({a:123}));

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
    <Route name="result" path="/result" handler={Result}/>
    <Route name="explanation" path="/explanation/:index" handler={Explanation}/>
    <DefaultRoute handler={Welcome} />
  </Route>
);
// 将匹配的路由渲染到 DOM 中
Router.run(routes, Router.HashLocation, function(Root){  
  React.render(<Root />, document.body);
});
// React.render(<App/>,document.body);
module.exports = App;