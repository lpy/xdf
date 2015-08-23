var React = require('react');
var ReactRouter = require('react-router');
var StateMixin = ReactRouter.State;  

var React = require('react');

var AnswerPlayer = React.createClass({
	
	getInitialState: function() {
		return {
			// duration: "0'0''" 
			duration: "加载中" 
		};
	},
	setDuration: function() {
		
		//显示音频长度
		var secs = React.findDOMNode(this.refs.audio).duration,
			duration = Math.floor(secs / 60) + "'" + Math.round(secs % 60) + "''";
			alert("音频长度是:"+secs);
		this.setState({
			duration: duration
		});
	},
	componentDidMount: function() {
		React.findDOMNode(this.refs.audio).oncanplaythrough = this.setDuration.bind(this);
		React.findDOMNode(this.refs.audio).load();
	},
	togglePlay: function() {

		var audio = React.findDOMNode(this.refs.audio);
		console.log(audio.paused);
		audio.paused? audio.play():audio.pause();
	},
	componentWillReceiveProps: function(nextProps) {
		// console.log('pause')
		// this.forceUpdate();
		// React.findDOMNode(this.refs.audio).oncanplay = this.setDuration.bind(this);
		var audio = React.findDOMNode(this.refs.audio).pause();

		
	},
	componentDidUpdate: function(prevProps, prevState) {
		// console.log(prevProps.url,this.props.url)
		if(prevProps.url != this.props.url) {
			React.findDOMNode(this.refs.audio).load();
		}
	},
	render: function() {
		var url = this.props.url;
		return (
			<div className="answerPlayer">
				<img src="images/answerPlayer.png" onClick = {this.togglePlay}/>
				<span>{this.state.duration}</span>
				{/*答案解析音频*/}
				<audio controls="controls" height="100" width="100" ref="audio" preload="auto">
				  <source src={url} type="audio/mp3" />
				  <source src={url} type="audio/ogg" />
				  <source src={url} type="audio/wav" />
				<embed height="100" width="100" src={url} />
				</audio>
			</div>
		);
	}

});

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
			answerSheet = JSON.parse(localStorage.getItem('answerSheet')),
			correctness = "";
		if(answerSheet[index] == question.answer) {
			correctness = "恭喜你答对了";
		}
		else if(answerSheet[index] == -1) {
			correctness = "正确答案是" + ['A','B','C','D'][question.answer] + "你没有作答";
		}else {
			correctness = "正确答案是" + ['A','B','C','D'][question.answer] + "你选择了" + ['A','B','C','D'][answerSheet[index]];
		}
		return (
			<div>
				<nav className="appBar">
					<div className="appBarBtn">
						<a href={"#/result/" + localStorage.getItem('score') } >
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
						<p className="correctness">{correctness}</p>
						<p>答案解析</p>
						<AnswerPlayer url={question.audio}/>
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