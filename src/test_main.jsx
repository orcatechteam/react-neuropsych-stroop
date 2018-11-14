import React from 'react';
import ReactDOM from 'react-dom';

import Stroop from './stroop';

var words = ['green', 'red', 'blue', 'orange'];
var colors = ['009900', '990000', '000099', 'EE7600'];


const combos = [
	{ word: 0, color: 0 },
	{ word: 1, color: 1 },
	{ word: 2, color: 2 },
	{ word: 3, color: 3 },
	{ word: 0, color: 1 },
	{ word: 2, color: 3 },
	{ word: 3, color: 2 },
	{ word: 1, color: 0 },
];

class StroopTestApp extends React.Component {
	handleComplete = ({ events, start, stop, timeLimit, timeLimitReached }) => {
		console.info('Event data: ', events);
		console.info('Duration: %s of %s seconds', (stop - start) / 1000, timeLimit / 1000);
		console.info('Time Limit Reached: %s', timeLimitReached);
	};

	handleError = data => {};
	handleSuccess = data => {};

	render() {
		return (
			<div>
				<Stroop
					colors={colors}
					combos={combos}
					onComplete={this.handleComplete}
					onError={this.handleError}
					onSuccess={this.handleSuccess}
					words={words}
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<StroopTestApp />,
	document.getElementById('root')
);
