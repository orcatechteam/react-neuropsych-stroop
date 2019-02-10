import React from 'react';
import ReactDOM from 'react-dom';

import Stroop from './stroop';

var words = ['green', 'red', 'blue'];
var colors = ['009900', '990000', '000099'];

const combos = [
	{ word: 0, color: 0 },
	{ word: 1, color: 1 },
	{ word: 2, color: 2 },
];

class StroopTestSample extends React.Component {
	handleComplete = ({ events, start, stop, timeLimit, timeLimitReached }) => {
		console.info('Event data: ', events);
		console.info('Duration: %s of %s seconds', (stop - start) / 1000, timeLimit / 1000);
		console.info('Time Limit Reached: %s', timeLimitReached);
	};

	handleError = data => {};
	handleSuccess = data => {};

	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h2>Sample</h2>
				<div>Sample instructions...</div>
				<div style={{ border: '4px solid dodgerblue', marginTop: '10px' }}>
					<Stroop
						colors={colors}
						combos={combos}
						onComplete={this.handleComplete}
						onError={this.handleError}
						onSuccess={this.handleSuccess}
						retry
						timeLimit={0}
						words={words}
					/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<StroopTestSample />,
	document.getElementById('root')
);
