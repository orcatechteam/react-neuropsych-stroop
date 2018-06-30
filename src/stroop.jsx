import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	'@global body': {
		margin: 0,
		padding: 0,
	},
	stroopContainer: {
		textAlign: 'center',
	},
	stroopButtons: {
		textAlign: 'center',
		padding: '.5em',
		margin: '0 auto',
	},
	stroopButton: {
		padding: '1em 0',
		width: "35vw",
		maxWidth: "9em",
		fontSize: '1rem',
		margin: '.5em',
		border: '1px solid #666',
		borderRadius: '5px',
		background: '#FFF',
		color: '#000',
	},
	stroopButtonDisabled: {
		borderColor: theme.palette.action.disabled,
		background: theme.palette.action.disabledBackground,
		color: theme.palette.text.disabled,
	},
	stroopText: theme.typography.title,
	popUpContainer: {
		textAlign: 'center',
	},
	popUpContent: {
		background: '#FFF',
		fontFamily: 'sans-serif',
		fontSize: '1rem',
		border: '1px solid #666',
		borderRadius: '5px',
		padding: '1em 15px',
		margin: '0 auto',
		display: 'inline-block',
	},
	popUpError: {
		color: theme.palette.error.main,
	},
	directions: {
		textAlign: 'center',
		fontSize: '1.5em',
	},
});

class Stroop extends React.Component {
	static propTypes = {
		buttonsPerRow: PropTypes.number.isRequired,
		classes: PropTypes.object.isRequired,
		colors: PropTypes.arrayOf(PropTypes.string).isRequired,
		combos: PropTypes.arrayOf(PropTypes.shape({
			word: PropTypes.number.isRequired,
			color: PropTypes.number.isRequired
		})).isRequired,
		completionMessage: PropTypes.string.isRequired,
		incorrectMessage: PropTypes.string.isRequired,
		onComplete: PropTypes.func.isRequired,
		onError: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired,
		timeLimit: PropTypes.number.isRequired,
		words: PropTypes.arrayOf(PropTypes.string).isRequired,
	};

	static defaultProps = {
		buttonsPerRow: 2,
		completionMessage: 'Completed! Please press next.',
		incorrectMessage: 'Incorrect, please try again',
		timeLimit: 45000,
	};

	state = {
		begin: undefined,
		displayError: false,
		displayComplete: false,
		errors: [],
		finish: undefined,
		progress: 0,
		start: undefined,
		successes: [],
		timeLimitReached: false,
	};

	componentDidMount() {
		this.startTimer();
	}

	startTimer = () => {
		if (this.props.timeLimit > 0) {
			setTimeout(this.handleTimeLimitReached, this.props.timeLimit);
		}
		this.setState({ begin: Date.now() });
	};

	handleTimeLimitReached = () => {
		this.setState({ timeLimitReached: true });
		this.handleCompletion();
	};

	handleClick = i => {
		return e => {
			const { colors, combos } = this.props;
			const { progress } = this.state;
			const nextProgress = progress + 1;

			if (progress < 0 || progress >= combos.length) {
				return;
			}

			this.setState({ displayError: false });

			const selectedColorIdx = e.target.value;
			const selectedColor = colors[selectedColorIdx];

			const word = this.props.words[combos[this.state.progress].word];
			const color = this.props.colors[combos[this.state.progress].color];
			const data = {
				stamp: new Date(),
				index: progress,
				word: word.toUpperCase(),
				color: color.toUpperCase(),
				start: this.state.start,
				selectedColor: selectedColor.toUpperCase(),
			};

			if (data.color !== data.selectedColor) {
				this.handleError(data);
				return;
			}

			this.handleSuccess(data);

			if (nextProgress >= combos.length) {
				this.handleCompletion();
				return;
			}

			this.setState({
				progress: nextProgress,
				start: new Date(),
			});
		};
	};

	handleError = data => {
		this.setState({
			errors: [...this.state.errors, data],
			displayError: true,
		});
		this.props.onError(data);
	};

	handleSuccess = data => {
		this.setState({ successes: [...this.state.successes, data] });
		this.props.onSuccess(data);
	};

	handleCompletion = () => {
		if (this.state.displayComplete) {
			return;
		}
		const { errors, successes, begin, timeLimitReached } = this.state;
		const completionData = {
			begin,
			finish: Date.now(),
			errors,
			successes,
			timeLimitReached,
		};
		this.props.onComplete(completionData);
		this.setState({
			displayError: false,
			displayComplete: true,
			finish: completionData.finish,
		});
	};

	renderPopUpError = () => {
		if (this.state.displayError) {
			return (
				<div className={this.props.classes.popUpContainer}>
					<div
						className={classnames(this.props.classes.popUpContent, this.props.classes.popUpError)}
					>
						{this.props.incorrectMessage}
					</div>
				</div>
			);
		}
	};

	renderPopUpComplete = () => {
		if (this.state.displayComplete) {
			return (
				<div className={this.props.classes.popUpContainer}>
					<div className={this.props.classes.popUpContent}>{this.props.completionMessage}</div>
				</div>
			);
		}
	};

	renderButtonRows = () => {
		const colorButtons = this.props.colors.map((color, i) => (
			<td key={`${this.props.words[i]}-${i}`}>
				<button
					className={classnames(this.props.classes.stroopButton, {
						[this.props.classes.stroopButtonDisabled]: this.state.displayComplete,
					})}
					disabled={this.state.displayComplete}
					onClick={this.handleClick(i)}
					value={i}
				>
					{this.props.words[i].toUpperCase()}
				</button>
			</td>
		));
		let buttonRows = [];
		for (let j = 0; j < colorButtons.length; j += this.props.buttonsPerRow) {
			let buttonRow = <tr key={j}>{colorButtons.slice(j, j + this.props.buttonsPerRow)}</tr>;
			buttonRows.push(buttonRow);
		}
		return buttonRows;
	};

	renderText = () => {
		let color = this.props.colors[this.props.combos[this.state.progress].color];
		let word = this.props.words[this.props.combos[this.state.progress].word];

		if (this.state.progress === -1) {
			// render instructions
			return null;
		}

		return (
			<div
				className={this.props.classes.stroopText}
				style={{ color: '#' + color }}
			>
				{word}
			</div>
		);
	};

	render() {
		return (
			<React.Fragment>
				<div className={this.props.classes.directions}>{this.renderText()}</div>
				<div className={this.props.classes.stroopContainer}>
					<table className={this.props.classes.stroopButtons}>
						<tbody>{this.renderButtonRows()}</tbody>
					</table>
					{this.renderPopUpError()}
					{this.renderPopUpComplete()}
				</div>
			</React.Fragment>
		);
	}
}

export default withStyles(styles)(Stroop);
