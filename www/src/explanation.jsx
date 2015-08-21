var React = require('react');
var ReactRouter = require('react-router');
var StateMixin = ReactRouter.State;  

var Explanation = React.createClass({
	
	mixins: [StateMixin],
	getInitialState: function() {
		return {
			assignment: JSON.parse(localStorage.getItem('assignment'))
		};
	},
	render: function() {
		var index = parseInt(this.getParams().index),
			assignment = this.state.assignment,
			questionNum = this.state.assignment.questionList.length, //问题总数
			question = assignment.questionList[index],
			answerSheet = JSON.parse(localStorage.getItem('answerSheet'));
		return (
			<div>
				<nav className="appBar">
					<div className="appBarBtn">
						<a href="#/result">
							<img src="images/return.png"></img>
						</a>
					</div>
					<div className="appBarIndicator">
						<span>{index + 1}/{questionNum}</span>
					</div>
					<div className="appBarTitle">
						<h3>{assignment.name}</h3>
					</div>
				</nav>
				<div className="content">
					<div className="questionBox">

						<p className="question">
							<span className="serial">{index + 1}.</span>
							{question.content}
						</p>
						<ul className="selections">
							{
								question.optionList.map(function(option,i){
									if(i === question.answer) {
										return (
											<li>
												<div className="letter correct">{['A','B','C','D'][i]}</div>
												{option}
											</li>
											);
									}else if(i === answerSheet[index] && i !== question.answer) {
										return (
											<li>
												<div className="letter wrong">{['A','B','C','D'][i]}</div>
												{option}
											</li>
											);
									}else {
										return (
											<li>
												<div className="letter">{['A','B','C','D'][i]}</div>
												{option}
											</li>
											);
									}
									
								})
							}
						</ul>

					</div>
					<div className="answerExplanation">
						<p className="correctness">恭喜你答对啦</p>
						<p>答案解析</p>
						<div className="answerPlayer">
							<img src="images/answerPlayer.png"/>
							<span>13''</span>
							{/*答案解析音频*/}
							<audio controls="controls" height="100" width="100">
							  <source src={question.audio} type="audio/mp3" />
							  <source src={question.audio} type="audio/ogg" />
							<embed height="100" width="100" src={question.audio} />
							</audio>
						</div>
						<p>{question.answerContent}</p>
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
						index!==questionNum-1?
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