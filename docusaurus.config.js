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
	baseUrl: '/docs/cms/v7/',
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
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			}),
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
						sidebarId: 'api',
						label: 'API',
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
}
export default config;