import React, { useState, useEffect, useRef } from 'react'
import { render, FramerMotion, useCaspar, useFont } from '@nxtedition/graphics-kit'
import { motion } from 'framer-motion'

import proximaNovaBlack from './fonts/ProximaNova_BLACK.woff'
import proximaNovaBold from './fonts/ProximaNova_BOLD.woff'
import proximaNova from './fonts/ProximaNova.woff'
import { strapsConfig } from './strapsConfig.js'
import overlayImage from './images/WIN2025_StrapOverlay.png'

const WINNewsStraps = () => {

	const loadedFonts = {
		fontProximaNovaBlack: useFont({ src: proximaNovaBlack }),
		fontProximaNovaBold: useFont({ src: proximaNovaBold }),
		fontProximaNovaRegular: useFont({ src: proximaNova })
	}

	// Get data sent from NXT and check if template is playing
	const { data, isPlaying } = useCaspar({
		trim: true,
		removeDelay: 1
	})

	// Monitor whether the strap should be visible
	const [strapVisible, setStrapVisible] = useState(false)
	const [textScalePrimary, setTextScalePrimary] = useState(1)
	const [textScaleSecondary, setTextScaleSecondary] = useState(1)

	// Ref to measure text width for autofit
	const primaryTextRef = useRef(null)
	const secondaryTextRef = useRef(null)

	// Extract text and settings from NXT data, with fallback defaults
	const primaryText = data?.primaryText || ''
	const secondaryText = data?.secondaryText || ''
	const strapType = data?.strapType || 'name super'
	const displayDuration = data?.displayDuration || null


	// Load the preset layout configuration based on strap type
	const preset = strapsConfig[strapType] || strapsConfig.strapSingleLine

	// Show/hide strap when NXT plays or stops the template
	useEffect(() => {

		if (isPlaying) {

			setStrapVisible(true)

			// Measure and scale primaryText
			if (primaryTextRef.current && primaryText) {
				const textWidth = primaryTextRef.current.offsetWidth
				setTextScalePrimary(Math.min(1, preset.maxWidthPrimary / textWidth))
			}

			// Measure and scale secondaryText
			if (secondaryTextRef.current && secondaryText) {
				const textWidth = secondaryTextRef.current.offsetWidth
				setTextScaleSecondary(Math.min(1, preset.maxWidthSecondary / textWidth))
			}

			// Auto-animate off after duration if one was specified
			if (displayDuration > 0) {
				const timer = setTimeout(() => {
					setStrapVisible(false)
				}, displayDuration * 1000)

				return () => clearTimeout(timer)
			}
		} else {

			// Animate off when NXT sends STOP command
			setStrapVisible(false)

		}

	}, [isPlaying, displayDuration, strapType, primaryText, secondaryText, preset.maxWidthPrimary, preset.maxWidthSecondary])



	// Calculate positions for the lines above and below the strap
	const topLineBottom = preset.primaryLowerThirdBackground.bottom + preset.primaryLowerThirdBackground.height
	const bottomLineBottom = preset.primaryLowerThirdBackground.bottom - preset.lineHeight

	// Map text data to textConfig
	const strapTextContent = {
		primaryText: primaryText,
		secondaryText: secondaryText
	}


	return (
		<FramerMotion>
			<div
				style={{
					width: '100vw',
					height: '100vh',
					position: 'absolute',
					top: 0,
					left: 0
				}}
			>

				{/* White line above strap */}
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{
						scaleX: strapVisible ? 1 : 0,
						transition: strapVisible ? {
							duration: preset.animWipeIn,
							delay: 0,
							ease: 'easeOut'
						} : {
							duration: preset.animWipeOut,
							delay: preset.animStagger * 2,
							ease: 'easeOut'
						}

					}}
					exit={{
						scaleX: 0,
						transition: {
							duration: preset.animWipeOut,
							delay: preset.animStagger * 2,
							ease: 'easeOut'
						}
					}}
					style={{
						position: 'absolute',
						bottom: `calc(${topLineBottom}px`,
						left: 0,
						width: '2200px',
						height: `${preset.lineHeight}px`,
						backgroundColor: 'rgba(255, 255, 255, 0.5)',
						transformOrigin: 'left'
					}}
				/>



				{/* Mask container */}
				<div
					style={{
						position: 'absolute',
						bottom: `${preset.primaryLowerThirdBackground.bottom}px`,
						left: 0,
						width: '100%',
						
						height: `${preset.primaryLowerThirdBackground.height}px`
					}}
				>

					{/* Primary strap with gradient mask for wipe */}
					<motion.div
						initial={{ maskPosition: '-2200px 0' }}
						animate={{
							maskPosition: strapVisible ? '0px 0' : '-2200px 0',
							transition: strapVisible ? {
								duration: preset.animWipeIn,
								delay: preset.animStagger,
								ease: 'easeOut'
							} : {
								duration: preset.animWipeOut,
								delay: preset.animStagger,
								ease: 'easeOut'
							}
						}}
						exit={{
							maskPosition: '-2200px 0',
							transition: {
								duration: preset.animWipeOut,
								delay: preset.animStagger,
								ease: 'easeOut'
							}
						}}
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							maskImage: 'linear-gradient(to right, black 1920px, transparent 2200px)',
							maskSize: '2200px 100%',
							maskRepeat: 'no-repeat'
						}}
					>
						{/* Strap gradient background */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								opacity: 0.95,
								width: '100%',
								height: '100%',

								backgroundImage: 'linear-gradient(to bottom, #ffffff, #e9e8e8)'
							}}
						/>

						{/* Overlay image - slides left slowly for subtle movement */}
						<motion.div
							initial={{ x: 0 }}
							animate={{
								x: strapVisible ? -100 : 0,
								transition: {
									duration: 10,
									delay: 0,
									ease: 'easeOut'
								}
							}}
							exit={{
								x: -200,

								transition: {
									duration: 1,
									ease: 'easeInOut'
								}
							}}
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								width: '100%',
								height: '100%',
								overflow: "hidden",
								backgroundImage: `url(${overlayImage})`,
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'left center',
								backgroundSize: 'auto 100%',
								mixBlendMode: 'screen'
							}}
						/>

						{/* Text elements
						 */}
						{preset.textConfig.map((textConfig, index) => {

							const theText = strapTextContent[textConfig.textType]
							if (!theText) return null

							// Get the font set in the config
							const selectedFont = loadedFonts[textConfig.fontFamily] || loadedFonts.fontProximaNovaRegular
							const fontFamily = selectedFont.style.fontFamily

							const textStyle = {
								position: 'absolute',
								fontSize: `${textConfig.fontSize}px`,
								fontFamily: fontFamily,
								fontWeight: textConfig.fontWeight,
								textAlign: textConfig.textAlign,
								whiteSpace: 'nowrap',
								overflow: "visible",
								paddingLeft: "3px",
								paddingRight: "3px"
							}

							// Position element based on text alignment
							if (textConfig.textAlign === 'center') {
								textStyle.left = '50%'
								textStyle.transform = 'translateX(-50%)'
							} else if (textConfig.textAlign === 'right') {
								textStyle.right = `${textConfig.x}px`
							} else {
								textStyle.left = `${textConfig.x}px`
							}

							// Position based on margin type
							if (textConfig.marginTop !== undefined) {
								textStyle.top = `${textConfig.marginTop}px`
							} else if (textConfig.marginBottom !== undefined) {
								textStyle.bottom = `${textConfig.marginBottom}px`
							}

							// Apply gradient or solid color
							if (textConfig.gradient) {
								textStyle.background = textConfig.gradient
								textStyle.backgroundClip = 'text'
								textStyle.color = 'transparent'

							} else {
								textStyle.color = textConfig.color
							}

							return (
								<motion.div
									key={`${strapType}-${textConfig.textType}`}
									ref={textConfig.textType === 'primaryText' ? primaryTextRef :
										textConfig.textType === 'secondaryText' ? secondaryTextRef :
											null}
									style={{
										...textStyle,
										transform: textConfig.textType === 'primaryText'
											? `${textStyle.transform || ''} scaleX(${textScalePrimary})`.trim()
											: textConfig.textType === 'secondaryText'
												? `${textStyle.transform || ''} scaleX(${textScaleSecondary})`.trim()
												: textStyle.transform,
										transformOrigin: textConfig.textAlign === 'center' ? 'center'
											: textConfig.textAlign === 'right' ? 'right'
												: 'left'
									}}
								>
									{theText}
								</motion.div>
							)
						})}
					</motion.div>
				</div>

				{/* Red line under strap - animates last on entry, first on exit */}
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{
						scaleX: strapVisible ? 1 : 0,
						transition: strapVisible ? {
							duration: preset.animWipeIn,
							delay: preset.animStagger * 2,
							ease: 'easeOut'
						} : {
							duration: preset.animWipeOut,
							delay: 0,
							ease: 'easeOut'
						}
					}}
					exit={{
						scaleX: 0,
						transition: {
							duration: preset.animWipeOut,
							delay: 0,
							ease: 'easeOut'
						}
					}}
					style={{
						position: 'absolute',
						bottom: `${bottomLineBottom}px`,
						left: 0,
						width: '2200px',
						height: `${preset.lineHeight}px`,
						backgroundColor: '#dc0000',
						transformOrigin: 'left'
					}}
				/>
			</div>
		</FramerMotion>
	)
}

render(WINNewsStraps)