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
	tryAgain: function() {

		var resetAnswerSheet = answers.map(function(ans) {
			return -1;
		});
		localStorage.setItem("answerSheet",JSON.stringify(resetAnswerSheet));

		var end,
			url = window.location.href;
		if(url.indexOf('#') != -1) {
			end = url.indexOf('#');
		}else {
			end = url.length;
		} //without hash
		var queryStr = url.substring(url.lastIndexOf('?') + 1, end);
		//redirect
		window.location.href = '#/quiz/0' + queryStr;
	},
	render: function() {
		var emotionImg = "",
			score = parseInt(this.getParams().score);
		if(score == 100) {
			emotionImg = "images/perfect.png";
		}else if(score >= 80 && score < 100 ) {
			emotionImg = "images/good.png";
		}else if(score >= 60 && score < 80 ) {
			emotionImg = "images/notbad.png";
		}else {
			emotionImg = "images/bad.png";
		}
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
							<img src={emotionImg}/>
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

					<img src="images/tryAgain.png" className="tryAgain" onClick={this.tryAgain}/>

				</div>
			</div>
		);
	}

});

module.exports = Result;