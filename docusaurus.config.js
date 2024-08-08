// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'SkillDo',
	tagline: 'Dinosaurs are cool',
	favicon: 'img/logo-skilldo.png',
	url: 'https://sikido.vn',
	baseUrl: '',
	organizationName: 'facebook', // Usually your GitHub org/user name.
	projectName: 'SkillDo', // Usually your repo name.
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	i18n: {
		defaultLocale: 'vi',
		locales: ['vi'],
	},
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					routeBasePath: '/',
					sidebarPath: './sidebars.js',
					editUrl: 'https://github.com/huutrongdev93/cms-docs',
					lastVersion: 'current',
					versions: {
						current: {
							label: '7.0.0',
							path: '7.0.0',
						},
					},
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			}),
		],
	],
	plugins: [
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'devtool', // omitted => default instance
				path: 'devtool',
				routeBasePath: 'devtool',
				sidebarPath: './sidebars-devtool.js',
				lastVersion: 'current',
				versions: {
					current: {
						label: '1.0.0',
						path: '1.0.0',
					},
				},
			},
		],
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'ecommerce',
				path: 'ecommerce',
				routeBasePath: 'ecommerce',
				sidebarPath: './sidebars-ecommerce.js',
				lastVersion: 'current',
				versions: {
					current: {
						label: '1.0.0',
						path: '1.0.0',
					},
				},
			},
		],
	],
	themeConfig:
	/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			colorMode: {
				defaultMode: 'dark',
			},
			// Replace with your project's social card
			image: 'img/docusaurus-social-card.jpg',
			navbar: {
				hideOnScroll: true,
				title: 'SKILLDO',
				logo: {
					alt: 'My Site Logo',
					src: 'img/logo-skilldo.png',
				},
				items: [
					{
						type: 'docSidebar',
						position: 'left',
						sidebarId: 'doc',
						label: 'Documentation',
					},
					{
						type: 'docSidebar',
						position: 'left',
						sidebarId: 'devtool',
						docsPluginId: 'devtool',
						label: 'DevTool',
					},
					{
						type: 'docSidebar',
						position: 'left',
						sidebarId: 'ecommerce',
						docsPluginId: 'ecommerce',
						label: 'E-commerce',
					},
					/*{
						type: 'docSidebar',
						position: 'left',
						sidebarId: 'api',
						label: 'API',
					},
					{
						to: 'blog',
						label: 'Blog',
						position: 'left'
					},*/
					{
						type: 'docsVersionDropdown',
						position: 'right',
						dropdownItemsAfter: [
							{ to: 'https://developers.sikido.vn/docs/cms/v6-0-0', label: 'v6', target: '_blank' },
							{ to: 'https://developers.sikido.vn/docs/cms/v5-0-0', label: 'v5', target: '_blank' },
							{ to: 'https://developers.sikido.vn/docs/cms/v4-0-0', label: 'v4', target: '_blank' },
							{ to: 'https://developers.sikido.vn/docs/cms/v3-0-0', label: 'v3', target: '_blank' },
						],
						dropdownActiveClassDisabled: true,
					},
					{
						href: 'https://github.com/huutrongdev93/cms-docs',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			prism: {
				theme: prismThemes.github,
				darkTheme: prismThemes.dracula,
				additionalLanguages: ['php'],
			},
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 5,
			},
		}),
	staticDirectories: ['static'],
}
export default config;