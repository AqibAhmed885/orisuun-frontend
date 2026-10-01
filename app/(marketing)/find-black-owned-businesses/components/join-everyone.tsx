"use client"
import React from 'react'
// import LottieAnimation from '@/components/ui/LottieAnimation'

export default function JoinEveryone() {
	const headerRef = React.useRef<HTMLHeadingElement | null>(null)
	const [popEveryone, setPopEveryone] = React.useState(false)

	// Helper to run the pop animation multiple times with a delay between pulses
	const ANIM_DURATION = 520 // keep in sync with CSS animation duration
	const animatePop = (count = 2, delayMs = 400) => {
		let runs = 0
		const run = () => {
			if (runs >= count) return
			setPopEveryone(true)
			// hide after animation duration
			setTimeout(() => {
				setPopEveryone(false)
				runs += 1
				if (runs < count) setTimeout(run, delayMs)
			}, ANIM_DURATION)
		}
		run()
	}

	React.useEffect(() => {
		const el = headerRef.current
		if (!el) return
		const obs = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Blink twice with 400ms delay between pulses
					animatePop(2, 400)
					// only run once; unobserve so it doesn't re-trigger repeatedly
					obs.unobserve(entry.target)
				}
			})
		}, { threshold: 0.5 })
		obs.observe(el)
		return () => obs.disconnect()
	}, [])

	return (
		<section className="max-w-6xl mx-auto leading-none px-6 py-4" aria-label="Orisuun membership pricing">
			<h2 ref={headerRef} className="text-4xl lg:text-7xl font-semibold text-blue-strong mb-12 px-12 text-center" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>
				Built So <span className={`everyone inline-block ${popEveryone ? 'pop' : ''}`} onAnimationEnd={() => setPopEveryone(false)}>Everyone</span> Can Join</h2>

			<div className="flex flex-col lg:flex-row justify-between gap-8">
				{/* Left: pricing */}
				<div className="flex flex-col md:w-1/3 w-full text-center  items-center  lg:pl-6">
					<p className="text-[50px] text-slate-600" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>Spend</p>
					<div className="flex items-end relative ">
						<h3 className="text-[60px] font-medium text-[#5B657B] leading-none" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>Just <span className="text-[36px] text-[#2357C6] font-[600]" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>$14</span></h3>

						{/* Price Lottie (draws the arrow) */}
						{/* <div className="mt-2">
							<LottieAnimation
								src="/find/lottie/pulse.json"
								width={100}
								height={100}
								loop={false}
								autoplay={true}
								className="absolute -bottom-7 -right-[52px] rotate-180 pointer-events-none"
							/>
						</div> */}



					</div>
					<div className="text-[40px]  text-[#5B657B]" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>once for the <br /> whole</div>
					<div className="md:text-[60px] text-[40px] font-[600]  text-omblue-500" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>YEAR</div>
				</div>				{/* Middle: decorative path + AND */}
				<div className="flex justify-center md:w-1/3 w-full items-center">

					<svg width="220" height="230" viewBox="0 0 230 231" fill="none" xmlns="http://www.w3.org/2000/svg" className='mt-16 hidden md:block'>
						<path d="M101.563 39L112.712 8.69143H116.993L128.184 39H124.03L120.808 29.7591H108.727L105.463 39H101.563ZM113.432 16.4911L109.829 26.6646H119.748L116.272 16.4911L114.916 12.2098H114.831C114.294 13.9053 113.828 15.3325 113.432 16.4911ZM103.027 90V59.6914H107.054L120.873 80.7591L123.078 84.6589H123.162V59.6914H126.723V90H122.823L108.919 68.89L106.673 65.1173H106.588V90H103.027ZM103.234 141V110.691H114.256C118.692 110.691 122.041 112.062 124.302 114.803C126.563 117.544 127.693 121.261 127.693 125.952C127.693 130.615 126.52 134.288 124.175 136.973C121.829 139.658 118.424 141 113.959 141H103.234ZM107.049 137.651H113.832C120.473 137.651 123.793 133.751 123.793 125.952C123.793 117.982 120.572 113.998 114.128 113.998H107.049V137.651Z" fill="#2357C6" fill-opacity="0.49" />
						<path d="M108.504 227.895L108.694 225.018H108.694L108.504 227.895ZM114.031 227.944L113.894 225.065H113.894L114.031 227.944ZM228.921 55.0384C230.047 53.9126 230.047 52.0874 228.921 50.9616L210.576 32.6159C209.45 31.4901 207.624 31.4901 206.499 32.6159C205.373 33.7417 205.373 35.5669 206.499 36.6927L222.806 53L206.499 69.3073C205.373 70.4331 205.373 72.2583 206.499 73.3841C207.624 74.5099 209.45 74.5099 210.576 73.3841L228.921 55.0384ZM2.88281 50.1173C1.29072 50.1173 6.65188e-05 51.4079 6.65188e-05 53C6.65188e-05 54.5921 1.29072 55.8827 2.88281 55.8827V53V50.1173ZM108.504 227.895L108.314 230.771C110.263 230.9 112.212 230.917 114.169 230.824L114.031 227.944L113.894 225.065C112.155 225.148 110.424 225.132 108.694 225.018L108.504 227.895ZM169.934 136.638H172.816V77.9838H169.934H167.051V136.638H169.934ZM194.917 53V55.8827H226.883V53V50.1173H194.917V53ZM2.88281 53V55.8827H31.0516V53V50.1173H2.88281V53ZM56.0354 77.9838H53.1526V139.683H56.0354H58.9181V77.9838H56.0354ZM31.0516 53V55.8827C43.2576 55.8827 53.1526 65.7777 53.1526 77.9838H56.0354H58.9181C58.9181 62.5935 46.4418 50.1173 31.0516 50.1173V53ZM169.934 77.9838H172.816C172.816 65.7777 182.711 55.8827 194.917 55.8827V53V50.1173C179.527 50.1173 167.051 62.5935 167.051 77.9838H169.934ZM114.031 227.944L114.169 230.824C135.594 229.801 150.331 216.06 159.581 197.932C168.81 179.845 172.816 157.015 172.816 136.638H169.934H167.051C167.051 156.39 163.147 178.256 154.445 195.311C145.765 212.325 132.55 224.174 113.894 225.065L114.031 227.944ZM108.504 227.895L108.694 225.018C90.9288 223.845 78.5532 212.346 70.4956 195.961C62.4175 179.534 58.9181 158.584 58.9181 139.683H56.0354H53.1526C53.1526 159.162 56.7396 181.053 65.3219 198.505C73.9248 215.999 87.7837 229.415 108.314 230.771L108.504 227.895Z" fill="#2357C6" />
					</svg>


					<svg width="180" height="220" viewBox="0 0 130 198" fill="none" xmlns="http://www.w3.org/2000/svg" className='block md:hidden '>
						<path d="M41.151 80.8219L48.8144 61.5377L51.5645 61.6087L58.2509 81.2629L55.5825 81.1941L53.6661 75.2048L45.9058 75.0046L43.6561 80.8865L41.151 80.8219ZM49.148 66.5598L46.665 73.0352L53.0367 73.1995L50.9724 66.6069L50.172 63.8343L50.1175 63.8329C49.7445 64.9131 49.4214 65.8221 49.148 66.5598ZM60.3595 81.3173L60.8616 61.8484L63.4484 61.9151L71.9761 75.677L73.3274 78.2186L73.3818 78.22L73.7955 62.182L76.0827 62.241L75.5806 81.7099L73.0755 81.6453L64.4941 67.8548L63.1134 65.3942L63.059 65.3928L62.6467 81.3763L60.3595 81.3173ZM79.2391 81.8042L79.7412 62.3353L86.8208 62.5179C89.6708 62.5914 91.7992 63.5273 93.206 65.3256C94.6128 67.1239 95.2774 69.5297 95.1997 72.543C95.1224 75.5383 94.3082 77.8787 92.7571 79.5643C91.2059 81.25 88.9962 82.0559 86.1281 81.9819L79.2391 81.8042ZM81.7452 79.7163L86.1019 79.8287C90.3678 79.9387 92.5654 77.4886 92.6946 72.4784C92.8266 67.3593 90.8232 64.7464 86.6843 64.6397L82.1371 64.5224L81.7452 79.7163Z" fill="#2357C6" fill-opacity="0.49" />
						<path d="M1.87791 72.5955L3.72877 72.6699L1.87791 72.5955ZM1.93748 76.1465L3.78485 76.0104L3.78485 76.0104L1.93748 76.1465ZM114.908 147.082C115.65 147.787 116.822 147.757 117.527 147.015L129.007 134.926C129.712 134.185 129.681 133.012 128.94 132.308C128.198 131.603 127.025 131.633 126.321 132.375L116.116 143.12L105.371 132.916C104.629 132.211 103.456 132.241 102.752 132.983C102.047 133.725 102.078 134.897 102.82 135.602L114.908 147.082ZM114.324 1.80381C114.298 0.781114 113.448 -0.026561 112.425 -0.000185929C111.402 0.0261891 110.595 0.876626 110.621 1.89932L112.473 1.85156L114.324 1.80381ZM1.87791 72.5955L0.0270386 72.5212C-0.0233255 73.7747 -0.00230806 75.0273 0.0901179 76.2825L1.93748 76.1465L3.78485 76.0104C3.70269 74.8948 3.68408 73.7827 3.72877 72.6699L1.87791 72.5955ZM61.5144 110.543L61.5622 112.395L99.2393 111.423L99.1916 109.572L99.1438 107.72L61.4667 108.691L61.5144 110.543ZM115.654 125.206L113.802 125.254L114.332 145.787L116.183 145.739L118.035 145.691L117.506 125.158L115.654 125.206ZM112.473 1.85156L110.621 1.89932L111.088 19.9937L112.939 19.9459L114.791 19.8982L114.324 1.80381L112.473 1.85156ZM97.3047 36.4083L97.257 34.5565L57.624 35.5787L57.6717 37.4304L57.7195 39.2822L97.3525 38.26L97.3047 36.4083ZM112.939 19.9459L111.088 19.9937C111.29 27.8343 105.098 34.3543 97.257 34.5565L97.3047 36.4083L97.3525 38.26C107.238 38.0051 115.046 29.7842 114.791 19.8982L112.939 19.9459ZM99.1916 109.572L99.2393 111.423C107.08 111.221 113.6 117.413 113.802 125.254L115.654 125.206L117.506 125.158C117.251 115.272 109.03 107.465 99.1438 107.72L99.1916 109.572ZM1.93748 76.1465L0.0901177 76.2825C1.10231 90.0286 10.1725 99.2673 21.9708 104.909C33.7421 110.537 48.473 112.733 61.5622 112.395L61.5144 110.543L61.4667 108.691C48.7793 109.019 34.6684 106.874 23.5689 101.566C12.4962 96.2719 4.66621 87.9798 3.78485 76.0104L1.93748 76.1465ZM1.87791 72.5955L3.72877 72.6699C4.18801 61.2387 11.3696 53.0986 21.761 47.6514C32.1789 42.1902 45.5786 39.5953 57.7195 39.2822L57.6717 37.4304L57.624 35.5787C45.1114 35.9014 31.1091 38.5681 20.041 44.3701C8.94629 50.186 0.55774 59.3106 0.0270386 72.5212L1.87791 72.5955Z" fill="#2357C6" />
					</svg>

				</div>

				{/* Right: save it back text + CTA */}
				<div className="flex flex-col md:w-1/2 w-full lg:pr-6 ">
					<p className="text-[48px] text-slate-600" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>Save it back</p>
					<div className="text-[36px] text-right text-slate-500" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>Several times over</div>
					<div className="text-[48px] text-center font-medium text-slate-700" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>All Year Long</div>
					<div className="text-[36px] text-center font-medium text-slate-700" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>with our  </div>

					<div className="mt-2 relative text-[38px] ">
						<h1 className="flex flex-col text-[#2357C6] font-bold  px-4 " style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>
							{/* <div className="mt-2">
								<LottieAnimation
									src="/find/lottie/pulse.json"
									width={110}
									height={110}
									loop={false}
									autoplay={true}
									className="absolute -top-7 -left-10 pointer-events-none"
								/>
							</div> */}
							Supporter&apos;s
							<span className='text-right' >Discount Portal</span> </h1>
					</div>
				</div>
			</div>

			<style jsx>{`
				@media (min-width: 1024px){
					section { padding-top: 6rem; padding-bottom: 6rem }
				}

			/* Everyone pop animation (smoother, shorter pulses) */
			.everyone { display: inline-block; transform-origin: center; }
			/* duration: 520ms, ease-out with slight overshoot and settle */
			.everyone.pop { animation: pop 520ms cubic-bezier(.22,.9,.33,1); }
			@keyframes pop {
				0% { transform: scale(1); }
				35% { transform: scale(1.28); }
				60% { transform: scale(1.06); }
					100% { transform: scale(1); }
				}
			`}</style>
		</section>
	)
}
