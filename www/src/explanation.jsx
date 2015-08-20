var React = require('react');
var ReactRouter = require('react-router');
var StateMixin = ReactRouter.State;  

var Explanation = React.createClass({
	
	mixins: [StateMixin],
	render: function() {
		var index = parseInt(this.getParams().index);
		return (
			<div>
				<nav className="appBar">
					<div className="appBarBtn">
						<a href="#/result">
							<img src="images/return.png"></img>
						</a>
					</div>
					<div className="appBarIndicator">
						<span>{index + 1}/10</span>
					</div>
					<div className="appBarTitle">
						<h3>日语第一课作业</h3>
					</div>
				</nav>
				<div className="content">
					<div className="questionBox">

						<p className="question">
							<span className="serial">{index + 1}.</span>
							丸ごとキャベツをおいしく食べられる炊飯器クッキング。材料も少ないので、手軽に挑戦できそう。キャベツの甘みが出たスープも魅力的
						</p>
						<ul className="selections">
							<li>
								<div className="letter">A</div>
								とキャベツ
							</li>
							<li>
								<div className="letter">B</div>
								とキャベツ
							</li>
							<li>
								<div className="letter">C</div>
								とキャベツ
							</li>
							<li className="active">
								<div className="letter ">D</div>
								とキャベツ
							</li>
						</ul>
					</div>
					<div className="answerExplanation">
						<p className="correctness">恭喜你答对啦</p>
						<p>答案解析</p>
						<div className="answerPlayer">
							<img src="images/answerPlayer.png"/>
							<span>13''</span>
						</div>
						<p>blablablablablalablablablablalablablablablalablablablabla</p>
					</div>
				</div>
				<div className="actionBar">
					{

						index!==0?
						<a href={"#/explanation/" + ( index - 1 )}>
							<img src="images/pre.png" className="pre"/>
						</a>
						:
						""
					}	
					{
						index!==9?
						<a href={"#/explanation/" + ( index + 1)}>
							<img src="images/next.png" className="next"/>
						</a>
						:
						""
					}
				</div>
			</div>
		);
	}

});

module.exports = Explanation;