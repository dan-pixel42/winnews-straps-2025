// Configuration for WIN lower third layouts
const baseConfiguration = {
	primaryLowerThirdBackground: {
		bottom: 68,
		height: 130
	},
	lineHeight: 8,
	animWipeIn: 0.8,
	animWipeOut: 0.6,
	animStagger: 0.05,
	maxWidthPrimary: 1200,
	maxWidthSecondary: 1200
}

export const strapsConfig = {
	'name super': {
		description: "Two Lines – primary text on top, then secondary smaller text underneath",
		...baseConfiguration,
		textConfig: [
			{ 
				textType: 'primaryText',
				marginTop: -3,
				fontFamily: 'fontProximaNovaBlack',
				fontSize: 80, 
				gradient: 'linear-gradient(to bottom, #0873ca, #0d2d92)', 
				textAlign: 'left',
				x: 290
			},
			{ 
				textType: 'secondaryText',
				fontFamily: 'fontProximaNovaBold',
				marginBottom: 6,
				fontSize: 38, 
				color: '#576687', 
				textAlign: 'left',
				x: 292
			}
		]
	},
	'single line': {
		description: "Single line – primary in vertical centre of strap",
		...baseConfiguration,
		textConfig: [
			{ 
				textType: 'primaryText',
				fontFamily: 'fontProximaNovaBlack',
				marginBottom: 5,
				fontSize: 96, 
				gradient: 'linear-gradient(to bottom, #0873ca, #0d2d92)', 
				textAlign: 'left',
				x: 290
			}
		]
	},
	'breaking news': {
		description: "Single line – primary in vertical centre of strap",
		...baseConfiguration,
		textConfig: [
			{ 
				textType: 'primaryText',
				fontFamily: 'fontProximaNovaBlack',
				marginBottom: 5,
				fontSize: 96, 
				gradient: 'linear-gradient(to bottom, #ca0808ff, #920d0dff)', 
				textAlign: 'center'
			}
		]
	}
}