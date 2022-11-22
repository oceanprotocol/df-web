import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import dsv from '@rollup/plugin-dsv';
import {config} from 'dotenv';
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace';
import html from "@rollup/plugin-html";

const configToReplace = {};

const production = process.env.NODE_ENV==='production';
const randomHash = () => Math.random().toString(36).substr(2, 5);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const output = !production ? {
	file: 'public/build/bundle.js'
} : {
		dir: 'public/build',
		entryFileNames: 'bundle.[hash].js',
		assetFileNames: '[name].[hash].[ext]'
	};

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		...output
	},
	plugins: [
		replace({
			include: ["src/**/*.ts", "src/**/*.svelte", "src/**/*.js"],
			preventAssignment: true,
			values: {
				...configToReplace
			}
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ 
			output:'bundle.css'
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		json({
			compact: true
		}),
		dsv(),
		copy({
			targets: [
				{ src: 'public/build/index.html', dest: 'public' }
			],
			hook: 'writeBundle'
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		commonjs()
	],
	watch: {
		clearScreen: false
	}
};
