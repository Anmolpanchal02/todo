import React, { useEffect, useRef } from 'react'

const Background = () => {
    const headerRef = useRef(null)
    const mainTitleRef = useRef(null)
    const containerRef = useRef(null)
    const letterRefs = useRef([])

    useEffect(() => {
        // Create GSAP timeline for smooth sequential animations
        const tl = {
            to: (target, duration, props) => {
                return new Promise(resolve => {
                    const element = target.current || target
                    const startTime = Date.now()
                    const startProps = {}
                    
                    // Get initial values
                    Object.keys(props).forEach(key => {
                        if (key === 'opacity') {
                            startProps[key] = parseFloat(getComputedStyle(element).opacity) || 0
                        } else if (key === 'y') {
                            startProps[key] = parseFloat(element.style.transform?.match(/translateY\(([^)]+)\)/)?.[1]) || 0
                        } else if (key === 'x') {
                            startProps[key] = parseFloat(element.style.transform?.match(/translateX\(([^)]+)\)/)?.[1]) || 0
                        } else if (key === 'scale') {
                            startProps[key] = parseFloat(element.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1
                        } else if (key === 'rotation') {
                            startProps[key] = parseFloat(element.style.transform?.match(/rotate\(([^)]+)deg\)/)?.[1]) || 0
                        }
                    })
                    
                    const animate = () => {
                        const elapsed = Date.now() - startTime
                        const progress = Math.min(elapsed / (duration * 1000), 1)
                        
                        // Easing function (ease-out)
                        const easeOut = 1 - Math.pow(1 - progress, 3)
                        
                        // Apply transformations
                        let transform = ''
                        
                        Object.keys(props).forEach(key => {
                            const startVal = startProps[key]
                            const endVal = props[key]
                            const currentVal = startVal + (endVal - startVal) * easeOut
                            
                            if (key === 'opacity') {
                                element.style.opacity = currentVal
                            } else if (key === 'y') {
                                transform += `translateY(${currentVal}px) `
                            } else if (key === 'x') {
                                transform += `translateX(${currentVal}px) `
                            } else if (key === 'scale') {
                                transform += `scale(${currentVal}) `
                            } else if (key === 'rotation') {
                                transform += `rotate(${currentVal}deg) `
                            }
                        })
                        
                        // Apply combined transform
                        if (transform) {
                            // Preserve existing transforms
                            const existingTransforms = element.style.transform || ''
                            const preservedTransforms = existingTransforms
                                .replace(/translateY\([^)]+\)/g, '')
                                .replace(/translateX\([^)]+\)/g, '')
                                .replace(/scale\([^)]+\)/g, '')
                                .replace(/rotate\([^)]+deg\)/g, '')
                                .trim()
                            
                            element.style.transform = (preservedTransforms + ' ' + transform).trim()
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        } else {
                            resolve()
                        }
                    }
                    
                    requestAnimationFrame(animate)
                })
            },
            
            set: (target, props) => {
                const element = target.current || target
                Object.keys(props).forEach(key => {
                    if (key === 'opacity') {
                        element.style.opacity = props[key]
                    } else if (key === 'y') {
                        element.style.transform = `translateY(${props[key]}px) ` + (element.style.transform || '').replace(/translateY\([^)]+\)/g, '')
                    } else if (key === 'x') {
                        element.style.transform = `translateX(${props[key]}px) ` + (element.style.transform || '').replace(/translateX\([^)]+\)/g, '')
                    } else if (key === 'scale') {
                        element.style.transform = `scale(${props[key]}) ` + (element.style.transform || '').replace(/scale\([^)]+\)/g, '')
                    }
                })
            }
        }

        // Animation sequence
        const animateElements = async () => {
            // Set initial states
            tl.set(containerRef, { opacity: 0 })
            tl.set(headerRef, { opacity: 0, y: -50 })
            tl.set(mainTitleRef, { opacity: 0, y: 100, scale: 0.8 })
            
            // Animate container fade in
            await tl.to(containerRef, 0.5, { opacity: 1 })
            
            // Animate header with bounce effect
            await tl.to(headerRef, 0.8, { opacity: 1, y: 0 })
            
            // Animate main title container
            await tl.to(mainTitleRef, 0.5, { opacity: 1, y: 0, scale: 1 })
            
            // Get all letter spans
            const letters = mainTitleRef.current.querySelectorAll('span')
            
            // Animate each letter falling from top with bounce
            const animateLetters = async () => {
                for (let i = 0; i < letters.length; i++) {
                    const letter = letters[i]
                    
                    // Set initial position (high above, invisible)
                    letter.style.transform = 'translateY(-500px)'
                    letter.style.opacity = '1'
                    
                    // Animate letter falling with bounce
                    await tl.to(letter, 0.8, { 
                        y: 20 // Slight overshoot
                    })
                    
                    // Bounce back up
                    await tl.to(letter, 0.3, { 
                        y: -10
                    })
                    
                    // Settle to final position
                    await tl.to(letter, 0.2, { 
                        y: 0
                    })
                    
                    // Small delay between letters
                    await new Promise(resolve => setTimeout(resolve, 150))
                }
            }
            
            // Start letter animation
            await animateLetters()
            
            // After all letters are done, fade out colorful letters and show black text
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Fade out colorful letters
            const fadeOutLetters = async () => {
                const letters = mainTitleRef.current.querySelectorAll('span')
                for (let letter of letters) {
                    tl.to(letter, 0.3, { opacity: 0 })
                }
                await new Promise(resolve => setTimeout(resolve, 300))
            }
            
            await fadeOutLetters()
            
            // Show final black text
            mainTitleRef.current.innerHTML = 'Docs.'
            mainTitleRef.current.style.color = '#18181b'
            mainTitleRef.current.style.textShadow = '0 0 20px rgba(0,0,0,0.1)'
            
            await tl.to(mainTitleRef, 0.5, { opacity: 1 })
            
            // Add subtle floating animation to final text
            const floatAnimation = () => {
                tl.to(mainTitleRef, 3, { y: -10 }).then(() => {
                    tl.to(mainTitleRef, 3, { y: 10 }).then(() => {
                        floatAnimation()
                    })
                })
            }
            
            // Start floating animation after a delay
            setTimeout(floatAnimation, 1000)
        }

        // Start animation after component mounts
        animateElements()
    }, [])

    return (
        <>
            <div 
                ref={containerRef}
                className='fixed z-[2] w-full h-screen'
                style={{ opacity: 0 }}
            >
                <div 
                    ref={headerRef}
                    className='absolute top-[5%] w-full py-10 flex justify-center text-zinc-600 text-xl font-semibold transition-all duration-300 hover:text-zinc-800 hover:scale-105'
                    style={{ opacity: 0, transform: 'translateY(-50px)' }}
                >
                    Documents.
                </div>
                <h1 
                    ref={mainTitleRef}
                    className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-[13vw] sm:text-[10vw] md:text-[8vw] leading-none tracking-tighter font-semibold cursor-default select-none'
                    style={{ 
                        opacity: 0, 
                        transform: 'translateX(-50%) translateY(-50%) translateY(100px) scale(0.8)',
                        textShadow: '0 0 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <span 
                        className="inline-block transition-all duration-500 hover:scale-110"
                        style={{ 
                            color: '#ff6b6b', 
                            transform: 'translateX(-200px)', 
                            opacity: 0,
                            textShadow: '0 0 30px rgba(255,107,107,0.5)'
                        }}
                    >
                        D
                    </span>
                    <span 
                        className="inline-block transition-all duration-500 hover:scale-110"
                        style={{ 
                            color: '#4ecdc4', 
                            transform: 'translateX(200px)', 
                            opacity: 0,
                            textShadow: '0 0 30px rgba(78,205,196,0.5)'
                        }}
                    >
                        o
                    </span>
                    <span 
                        className="inline-block transition-all duration-500 hover:scale-110"
                        style={{ 
                            color: '#45b7d1', 
                            transform: 'translateX(-200px)', 
                            opacity: 0,
                            textShadow: '0 0 30px rgba(69,183,209,0.5)'
                        }}
                    >
                        c
                    </span>
                    <span 
                        className="inline-block transition-all duration-500 hover:scale-110"
                        style={{ 
                            color: '#96ceb4', 
                            transform: 'translateX(200px)', 
                            opacity: 0,
                            textShadow: '0 0 30px rgba(150,206,180,0.5)'
                        }}
                    >
                        s
                    </span>
                    <span 
                        className="inline-block transition-all duration-500 hover:scale-110"
                        style={{ 
                            color: '#feca57', 
                            transform: 'translateX(-200px)', 
                            opacity: 0,
                            textShadow: '0 0 30px rgba(254,202,87,0.5)'
                        }}
                    >
                        .
                    </span>
                </h1>
            </div>
        </>
    )
}

export default Background