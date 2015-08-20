var React = require('react');

var Result = React.createClass({

	getDefaultProps: function() {

		return {
			answers: [true,false,true,true,true,false,true,true,true,false]
		};

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
							<span id="score">90</span>
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
							this.props.answers.map(function(ans,index){
								return (
									<a href={"#/explanation/" + index}>
										<div className="qustionNum"><div>{index + 1}</div></div> 
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