var React = require('react');
var Router = require('react-router');   
var StateMixin = Router.State;  

var Result = React.createClass({

	mixins: [StateMixin],

	getInitialState: function() {
		var answerSheet = JSON.parse(localStorage.getItem('answerSheet')),
			questionList = JSON.parse(localStorage.getItem('assignment')).questionList;
		
		return {
			answers: answerSheet.map(function(ans,i){
				return ans === questionList[i].answer;
			}) //正确情况
		};
	},
	// getDefaultProps: function() {

	// 	return {
	// 		answers: [true,false,true,true,true,false,true,true,true,false]
	// 	};

	// },
	componentDidMount: function() {
		
	},
	render: function() {

		return (
			<div className="resultPage">
				<nav className="appBar">
					<div className="appBarBtn">
					</div>
					<div className="appBarIndicator">
						
					</div>
					<div className="appBarTitle">
						<h3>日语第一课作业</h3>
					</div>
				</nav>
				<div className="content">
					<div className="scoreBox">
						<div className="scoreCircle">
							<span id="score">{parseInt(this.getParams().score)}</span>
							<span id="total">/100</span>
						</div>
						<div className="emotion">
							<img  src="images/perfect.png"/>
						</div>
						<div className="shareBtn">
							<img  src="images/shareBtn.png"/>
						</div>
					</div>
					<div className="answerSheet">
						<p>答题卡</p>
						<p className="emerald">查看答案解析请点题号哦～</p>
						{
							this.state.answers.map(function(ans,index){
								return (
									<a href={"#/explanation/" + index}>
										<div className={ans?"questionNum":"questionNum wrong"}>
											<div>{index + 1}</div>
										</div> 
									</a>
									);
							})
						}
					</div>
				</div>
				<div className="actionBar">

					<img src="images/tryAgain.png" className="tryAgain" />

				</div>
			</div>
		);
	}

});

module.exports = Result;