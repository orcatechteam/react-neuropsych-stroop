const path = require('path');
const webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname),
	entry: {
		'react-neuropsych-stroop': path.join(__dirname, 'src/stroop.jsx'),
		'test/main': path.join(__dirname, 'src/test_main.jsx'),
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'dist'),
		library: '[name]',
		libraryTarget: 'umd',
	},
	resolve: {
		modules: ['node_modules', 'src'],
		extensions: ['.js', '.jsx'],
		symlinks: false,
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			include: /src/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	}
};
