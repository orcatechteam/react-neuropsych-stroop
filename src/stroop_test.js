import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Stroop from './stroop';

var words = ['green', 'red', 'blue', 'orange'];
var colors = ['009900', '990000', '000099', 'EE7600'];

/*
// Keep in case we want to implement actions with keyboard
var keyCodes = {
	103: 0,
	114: 1,
	98: 2,
	112: 3,
	111: 4, // lowercase
	71: 0,
	82: 1,
	66: 2,
	80: 3,
	79: 4, // uppercase
	32: -1, // space
};
*/

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

class StroopTest extends React.Component {
	handleOnComplete = ({ errors, successes, begin, finish, timeLimitReached }) => {
		console.info('Errors: %s, Successes: %s', errors.length, successes.length);
		console.info('Elapsed time: %s seconds', (finish - begin) / 1000);
	};

	handleOnError = data => {};
	handleOnSuccess = data => {};

	render() {
		return (
			<div className="stroop-wrapper">
				<Stroop
					colors={colors}
					combos={combos}
					onComplete={this.handleOnComplete}
					onError={this.handleOnError}
					onSuccess={this.handleOnSuccess}
					words={words}
				/>
			</div>
		);
	}
}

const wrapper = mount(<StroopTest />);

describe('<Stroop />', () => {
	it('should render', () => {
		expect(wrapper).to.have.lengthOf(1);
	});

	it('should have four buttons', () => {
		expect(wrapper.find('button')).to.have.lengthOf(4);
	});

	it(`directions should say ${words[1]} after clicking the ${words[0]} button`, () => {
		const greenBtn = wrapper.find('button').first();
		// const redBtn = wrapper.find('button').at(1);
		expect(wrapper.find('.jss9').text()).to.equal(words[0]);
		greenBtn.simulate('click');
		expect(wrapper.find('.jss9').text()).to.equal(words[1]);
	});
});
