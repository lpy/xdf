var React = require('react');
var ReactRouter = require('react-router');
var StateMixin = ReactRouter.State;  
var soundManager = require('./soundmanager/script/soundmanager2-jsmin.js').soundManager;
var React = require('react');
var $ = require('jquery');

var AnswerPlayer = React.createClass({
	sound: null,
	getInitialState: function() {
		return {
			duration: "0'0''" 
			// duration: "加载中" 
		};
	},
	parseDuration: function(secs) {
		
		//音频长度
		return  Math.floor(secs / 60) + "'" + Math.round(secs % 60) + "''";

	},
	loadSound: function(url) {
		// soundManager.setup({
		 
		//   url: './src/soundmanager/swf',
		//   onready: function() {

		//   	soundManager.createSound({
		//   	  id: 'mySound',
		//   	  url: url,
		//   	  // autoLoad: true,
		//   	  // onplay: function() {
		//   	  // 	alert("play")
		//   	  // }

		//   	});
		  	
		//   }.bind(this),
		//   ontimeout: function() {
		//     this.setState({
		//     	duration: '加载失败'
		//     });
		//   }.bind(this),
		//   preferFlash: true,
		//   useHTML5Audio: false,
		//   useFlashBlock: true
		// });

		// soundManager.setup({
		//   debugMode: true,
		//   preferFlash: false,
		//   useFlashBlock: true,
		//   url: './src/soundmanager/swf/',
		//   flashVersion: 9
		// });
		// soundManager.onready(function() {
		// 	  // soundManager.createSound() etc. may now be called
		// 	  var s = soundManager.createSound({
		// 	   id: 'mysound',
		// 	   url: url,
		// 	   type:('audio/mp3'||null)
		// 	  });
		// 	s.play();
		// });
		
		this.sound = soundManager.createSound({
			   // id: 'mysound',
			   url: url,
			   type:('audio/mp3'||null)
			  });

	},
	componentDidMount: function() {
		soundManager.setup({
		  debugMode: true,
		  preferFlash: false,
		  useFlashBlock: true,
		  url: './src/soundmanager/swf/',
		  flashVersion: 9
		});

		soundManager.onready(function() {
			  // soundManager.createSound() etc. may now be called
			this.sound = soundManager.createSound({
			   // id: 'mysound',
			   url: this.props.url,
			   type:('audio/mp3'||null)
			  });
			// console.log(this.sound);
		}.bind(this));
		// this.loadSound(this.props.url);
	},
	togglePlay: function(e) {
		e.preventDefault();
		var questionId = this.props.questionId;
		$.ajax({
			url: '/api/v1/question/<question_id>/audio'.replace(/\<\w+\>/,questionId),
			type: 'PUT',
			success:function() {
				console.log('audio count')
			}
		});
		// soundManager.getSoundById('mySound').play();
		// soundManager.togglePause('mySound');
		this.sound.togglePause();
	},
	componentWillReceiveProps: function(nextProps) {

		if(nextProps.url != this.props.url) {
			// React.findDOMNode(this.refs.audio).load();
			// if(soundManager.getSoundById('mySound') != null) {
			// 	soundManager.destroySound('mySound');
			// }
			this.sound.pause();
			this.sound.unload();
			this.loadSound(nextProps.url);
		}
	},

	render: function() {
		var url = this.props.url;
		return (
			<div className="answerPlayer">
				<a href={url} type="audio/mp3" onClick = {this.togglePlay}>
					<img src="images/answerPlayer.png" />
				</a>
				<span>{this.parseDuration(this.props.duration)}</span>
				{/*答案解析音频*/}
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
			correctness = "",
			questionId = question._id,
			duration = question.audioLength;
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
						<AnswerPlayer url={question.audio} questionId={questionId} duration={duration}/>
						<pre>{question.answerContent}</pre>
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