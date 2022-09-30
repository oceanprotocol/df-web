import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import dsv from '@rollup/plugin-dsv';
import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';
import html from "@rollup/plugin-html";

const configToReplace = {};
for (const [key, v] of Object.entries(config().parsed)) {
  configToReplace[`process.env.${key}`] = `'${v}'`;
}

const production = process.env.NODE_ENV==='production';
const randomHash = () => Math.random().toString(36).substr(2, 5);

const htmlOptions = {
  template: async ({ attributes, files, meta, publicPath, title }) => {
    const script = (files.js || [])
      .map(({ fileName }) => {
        return `<script defer src='${fileName}'></script>`;
      })
      .join("\n");

    const css = (files.css || [])
      .map(({ fileName }) => {
        return `<link rel='stylesheet' href='${fileName}'>`;
      })
      .join("\n");
    return`<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset='utf-8'>
					<meta name='viewport' content='width=device-width,initial-scale=1'>
					<link rel='icon' type='image/png' href='/logo-ocean-svg.svg'>
					<link rel='stylesheet' href='/global.css'>
					${css}
					<script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
					<script type="text/javascript" src="https://unpkg.com/web3modal"></script>
					<script type="text/javascript" src="https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js"></script>
					<script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider"></script>
					<script type="text/javascript" src="https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js"></script>
					${script}
				</head>
				<body>
				</body>
			</html>` ;
  },
};

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
			output: production ? `bundle.${randomHash()}.css` : 'bundle.css'
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
		html(htmlOptions),
		dsv(),

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
