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
	handleComplete = ({ errors, successes, begin, finish, timeLimitReached }) => {
		console.info('Errors: %s, Successes: %s', errors.length, successes.length);
		console.info('Elapsed time: %s seconds', (finish - begin) / 1000);
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

ReactDOM.render(<StroopTestApp />, document.getElementById('root'));