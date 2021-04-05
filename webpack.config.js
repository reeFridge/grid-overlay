const path = require('path');
const cp = require('copy-webpack-plugin');
const cssExtract = require('mini-css-extract-plugin');
const html = require('html-webpack-plugin');

module.exports = {
	entry: {
		content: './src/content/main.js',
		background: './src/background/main.js',
		devtools: './src/devtools/main.js',
		devpanel: './src/devtools/panel/main.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new html({
			chunks : ['devpanel'],
			template: './src/devtools/panel/index.html',
			filename: './devpanel.html',
			title: 'modular-grid devtools panel',
		}),
		new html({
			chunks : ['devtools'],
			template: './src/devtools/index.html',
			filename: './devtools.html',
			title: 'modular-grid devtools root',
		}),
		new cssExtract(),
		new cp({
			patterns: [
				{ from: './src/manifest.json', to: 'manifest.json' },
				{ from: './src/img', to: 'img' },
				{ from: './src/_locales', to: '_locales' },
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					cssExtract.loader,
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
		],
	},
};
