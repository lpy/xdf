var React = require('react');

var Welcome = React.createClass({

	render: function() {
		return (
			<div className="welcomePage">
				<div className="welcome">
					<img src="images/title.png"></img>
					<h2>(第一课作业)</h2>
				</div>
				
				<a href="#/quiz/0"><img className="quizBtn" src="images/quizBtn.png" /></a>
				<img src="images/logo.png" className="logo"></img>
			</div>
		);
	}

});

module.exports = Welcome;