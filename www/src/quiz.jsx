var React = require('react');
var ReactRouter = require('react-router');
var StateMixin = ReactRouter.State;  
var $ = require('jquery');
var getQuery = require('./getQuery.js');

var Selection = React.createClass({
	chooseThis: function() {
		this.props.answerQuestion(this.props.i);
	},
	render: function() {
		return (
			<li onClick = {this.chooseThis} className = {this.props.i==this.props.chosen?"active":""}>
				<div className="letter">{['A','B','C','D'][this.props.i]}</div>
				{this.props.option}
			</li>
		);
	}

});

var Quiz = React.createClass({
	mixins: [StateMixin],
	getInitialState: function() {
		var asm = JSON.parse(localStorage.getItem('assignment')),
			answerSheet =  JSON.parse(localStorage.getItem('answerSheet')),
			qIndex = parseInt(this.getParams().index);
		return {
			assignment: asm,
			chosen: answerSheet[qIndex] //用户的作答
		};
	},
	handIn: function() {
		window.location.href = "#/result/" + 78; //redirect to the result page
		//handin the answersheet and show the score
		var query = getQuery(window.location.href);
		var studentId = query.s,
		    assignmentId = query.a;
		$.ajax({
			url: "/api/v1/assignment/<assignment_id>?studentId=".replace(/\<\w+\>/,assignmentId) + studentId ,
			type: "post",
			data: {
				studentId: studentId,
				answerList: JSON.parse(localStorage.getItem('answerSheet'))
			},
			function(res) {
				window.location.href = "#/result/" + res.data.score; //redirect to the result page
			},
			function(error) {
				alert('获取结果失败,请重试')
			}
		})

	},
	answerQuestion: function(selection) {
		var answerSheet = JSON.parse(localStorage.getItem('answerSheet')),
			qIndex = parseInt(this.getParams().index);
		answerSheet[qIndex] = selection;
		localStorage.setItem('answerSheet',JSON.stringify(answerSheet));
		// this.setState({
		// 	chosen: selection
		// });
		this.forceUpdate();
	},
	render: function() {
		console.log("render")
		var index = parseInt(this.getParams().index),
			actionBarContent = [],
			questionNum = this.state.assignment.questionList.length, //问题总数
			question = this.state.assignment.questionList[index],
			answerSheet = JSON.parse(localStorage.getItem('answerSheet')),
			chosen = answerSheet[index],
			self = this;
		if(index !== 0 && index !== questionNum -1 ){
			actionBarContent.push(
				<a href={"#/quiz/" + ( index - 1 )}>
					<img src="images/pre.png" className="pre"/>
				</a>
				);
			actionBarContent.push(
				<a href={"#/quiz/" + ( index + 1)}>
					<img src="images/next.png" className="next"/>
				</a>
				);


		}else if(index === 0 ) {
			actionBarContent.push(
				<a href={"#/quiz/" + ( index + 1)}>
					<img src="images/next.png" className="next"/>
				</a>
				);
		}else if(index === questionNum - 1 ) {
			actionBarContent .push(
				<img src="images/handIn.png" className="handInBtn" onClick={this.handIn}/>
				);
		}
		return (
			<div className="quizPage">
				<nav className="appBar">
					<div className="appBarBtn">
					</div>
					<div className="appBarIndicator">
						<span>{index + 1}/{questionNum}</span>
					</div>
					<div className="appBarTitle">
						<h3>{this.state.assignment.name}</h3>
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
									return (
										<Selection answerQuestion={self.answerQuestion}
											i = {i}
											option={option}
											chosen ={chosen}/>
										);
								})
							}
						</ul>
					</div>
				</div>
				<div className="actionBar">
					{actionBarContent}
				</div>
			</div>
		);
	}

});

module.exports = Quiz;