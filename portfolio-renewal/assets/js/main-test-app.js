// assets/js/main-test-app.js

import * as THREE_MOD from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
window.THREE = THREE_MOD;
window.GLTFLoader = GLTFLoader;

import { Draggable } from "https://esm.sh/gsap/Draggable";
import { MorphSVGPlugin } from "https://esm.sh/gsap/MorphSVGPlugin";

import { worksData, loadWorksData } from './works-data.js';

class VanillaSplitText {
    constructor(element, options = {}) {
        this.element = element;
        
        // Cache the absolute original state on the first split to prevent cumulative corruption from resize/retriggering
        if (!element.hasAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.textContent.trim());
            element.setAttribute('data-original-html', element.innerHTML);
        }
        
        this.originalText = element.getAttribute('data-original-text');
        this.originalHTML = element.getAttribute('data-original-html');
        
        this.type = options.type || "chars";
        this.words = [];
        this.chars = [];
        this.init();
    }

    init() {
        if (this.type === "chars") {
            const text = this.originalText;
            this.element.innerHTML = "";
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement("span");
                span.textContent = text[i];
                span.style.display = "inline-block";
                if (text[i] === " ") {
                    span.style.whiteSpace = "pre";
                }
                this.element.appendChild(span);
                this.chars.push(span);
            }
        } else if (this.type === "words") {
            const wordsArray = this.originalText.split(/(\s+)/);
            this.element.innerHTML = "";
            wordsArray.forEach((part) => {
                if (part.trim() === "") {
                    const textNode = document.createTextNode(part);
                    this.element.appendChild(textNode);
                } else {
                    const span = document.createElement("span");
                    span.textContent = part;
                    span.style.display = "inline-block";
                    this.element.appendChild(span);
                    this.words.push(span);
                }
            });
        }
    }

    revert() {
        this.element.innerHTML = this.originalHTML;
    }
}
window.SplitText = VanillaSplitText;

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(Draggable, MorphSVGPlugin);
}

// Imports from common-test-utils
import {
    setupScrollRestoration,
    degToRad,
    responsiveScale,
    responsiveX,
    responsiveY,
    runLoaderSequence, 
    hideLoaderOnError,
    buildUrl,
    InteractiveBackgroundSphere,
    loadGLTFScene,
    killAllScrollTriggers,
    loadCommonUI
} from './common-test-utils.js';

// --- Global Variables ---
let mainSplineApp = null;
let capsuleObj = null, splineTimelines = [];
let splitComName, splitSubTitles = [], splitHeadlineChars = [];
let mainPageBackgroundSphere = null;
let initialSetupDone = false;
let headlineCharsAnim = null;
let heroHeadlineTriggerEnabled = false;

const SCROLL_PREVENTION_OPTIONS = { passive: false };
let isScrollCurrentlyDisabled = false;
let wasNormalizeScrollActive = false;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });
}

const getScaleConfig = (isDesktopView) => ({ hero: isDesktopView ? 2.5 : 1.8, part1: isDesktopView ? 3.2 : 2.2, part2: isDesktopView ? 3.0 : 2.0, part3: isDesktopView ? 3.6 : 2.5 });
const barShapesConfig = { initial: "M0 5 L0 5 L0 5 L0 5 Z", part1Enter: "M0,5 Q15,0 30,4 Q50,7 70,4 Q85,0 100,5 V5 Q85,10 70,6 Q50,3 30,6 Q15,10 0,5 Z", part2Enter: "M0,5 C20,-5 40,15 50,5 C60,-5 80,15 100,5 V5 C80,0 60,10 50,5 C40,0 20,10 0,5 Z", part3Enter: "M0,5 Q20,10 40,5 Q60,0 80,5 Q100,10 100,5 V5 Q80,0 60,5 Q40,10 20,5 Q0,0 0,5 Z", full: "M0,0 H100 V10 H0 Z" };

const sectionAtmospheres = {
    hero: {
        bg: "radial-gradient(circle at 75% 35%, #2e1065 0%, #170b30 50%, #06020c 100%)", // Rich Neon Violet/Purple
        colorHex: "#c084fc",
        rimHex: "#d8b4fe",
        bounceHex: "#f3e8ff"
    },
    part1: {
        bg: "radial-gradient(circle at 25% 45%, #082f49 0%, #0f172a 55%, #020617 100%)", // Technical Cyber Cyan/Blue
        colorHex: "#0ea5e9",
        rimHex: "#38bdf8",
        bounceHex: "#7dd3fc"
    },
    part2: {
        bg: "radial-gradient(circle at 75% 55%, #064e3b 0%, #022c22 55%, #020617 100%)", // Premium Emerald Green
        colorHex: "#10b981",
        rimHex: "#34d399",
        bounceHex: "#6ee7b7"
    },
    part3: {
        bg: "radial-gradient(circle at 30% 50%, #500724 0%, #310416 55%, #090514 100%)", // Deep Wine Magenta/Red
        colorHex: "#ec4899",
        rimHex: "#f43f5e",
        bounceHex: "#fb7185"
    }
};

function preventScroll(event) { if (isScrollCurrentlyDisabled) event.preventDefault(); }
function preventKeyboardScroll(event) {
    if (isScrollCurrentlyDisabled && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.code)) {
        event.preventDefault();
    }
}
function disableScrollInteraction() {
    if (isScrollCurrentlyDisabled) return;
    isScrollCurrentlyDisabled = true;
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', preventScroll, SCROLL_PREVENTION_OPTIONS);
    window.addEventListener('touchmove', preventScroll, SCROLL_PREVENTION_OPTIONS);
    window.addEventListener('keydown', preventKeyboardScroll, SCROLL_PREVENTION_OPTIONS);
    if (typeof ScrollTrigger !== 'undefined') {
        const currentNormalizeConfig = ScrollTrigger.normalizeScroll();
        wasNormalizeScrollActive = !!currentNormalizeConfig;
        if (wasNormalizeScrollActive) ScrollTrigger.normalizeScroll(false);
        ScrollTrigger.disable(false, true);
    }
}
function enableScrollInteraction() {
    if (!isScrollCurrentlyDisabled) return;
    isScrollCurrentlyDisabled = false;
    document.body.style.overflow = 'auto';
    window.removeEventListener('wheel', preventScroll, SCROLL_PREVENTION_OPTIONS);
    window.removeEventListener('touchmove', preventScroll, SCROLL_PREVENTION_OPTIONS);
    window.removeEventListener('keydown', preventKeyboardScroll, SCROLL_PREVENTION_OPTIONS);
    if (typeof ScrollTrigger !== 'undefined') {
        // Disabled normalizeScroll to remove scroll drag/resistance on trackpads & wheels
        // ScrollTrigger.normalizeScroll(true);
        ScrollTrigger.enable();
    }
}

function updateFogColor(colorHex, rimHex, bounceHex) {
    if (mainSplineApp && typeof THREE !== 'undefined') {
        if (mainSplineApp.rimLight && rimHex) {
            const rimC = new THREE.Color(rimHex);
            gsap.to(mainSplineApp.rimLight.color, { r: rimC.r, g: rimC.g, b: rimC.b, duration: 0.9, ease: "sine.inOut" });
        }
        if (mainSplineApp.spotBounceLight && rimHex) {
            const spotC = new THREE.Color(rimHex);
            gsap.to(mainSplineApp.spotBounceLight.color, { r: spotC.r, g: spotC.g, b: spotC.b, duration: 0.9, ease: "sine.inOut" });
        }
        if (mainSplineApp.rightSpotUniforms && colorHex) {
            const spotColorC = new THREE.Color(colorHex);
            gsap.to(mainSplineApp.rightSpotUniforms.uRightSpotColor.value, { r: spotColorC.r, g: spotColorC.g, b: spotColorC.b, duration: 0.9, ease: "sine.inOut" });
        }
    }
    if (mainPageBackgroundSphere && typeof THREE !== 'undefined') {
        mainPageBackgroundSphere.updateColors({
            wireframeColor: new THREE.Color(colorHex),
            pointsColor: new THREE.Color(colorHex)
        });
    }
}

function transitionSectionAtmosphere(sectionKey) {
    const atmos = sectionAtmospheres[sectionKey];
    if (!atmos) return;
    gsap.to(document.body, { background: atmos.bg, duration: 0.9, ease: "sine.inOut" });
    updateFogColor(atmos.colorHex, atmos.rimHex, atmos.bounceHex);
}

function setupMainPageBackgroundChangeAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    transitionSectionAtmosphere('hero');
    ['part1', 'part2', 'part3'].forEach(partId => {
        const sectionElement = document.getElementById(partId);
        if (sectionElement) {
            ScrollTrigger.create({
                id: `mainPageBackgroundChangeTrigger-${partId}`,
                trigger: sectionElement,
                start: "top center+=20%",
                end: "bottom center-=20%",
                invalidateOnRefresh: true,
                onEnter: () => transitionSectionAtmosphere(partId),
                onEnterBack: () => transitionSectionAtmosphere(partId),
                onLeaveBack: () => {
                    const prevColorKey = partId === 'part1' ? 'hero' : (partId === 'part2' ? 'part1' : 'part2');
                    transitionSectionAtmosphere(prevColorKey);
                }
            });
        }
    });
}

function setupSplineScrollAnimations(capsuleObj, cableObj, isDesktopView) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    splineTimelines.forEach(tl => tl.kill()); splineTimelines = []; 
    const currentScaleConfig = getScaleConfig(isDesktopView);
    const isMobileView = !isDesktopView;

    const heroX = isMobileView ? 0.0 : 1.2;
    const heroY = isMobileView ? -0.2 : 0.0;

    gsap.set(capsuleObj.position, { x: heroX, y: heroY, z: -5.0 });
    gsap.set(capsuleObj.rotation, { x: degToRad(25), y: degToRad(-35), z: degToRad(15) });
    gsap.set(capsuleObj.scale, { x: currentScaleConfig.hero, y: currentScaleConfig.hero, z: currentScaleConfig.hero });

    const heroTimeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-hero', trigger: "#hero", start: "top 10%", end: "bottom bottom", scrub: true, invalidateOnRefresh: true }});
    heroTimeline.to(capsuleObj.position, { x: heroX, y: heroY, z: -5.0 }, 0)
        .to(capsuleObj.rotation, { x: degToRad(25), y: degToRad(-35), z: degToRad(15) }, 0)
        .to(capsuleObj.scale, { x: currentScaleConfig.hero, y: currentScaleConfig.hero, z: currentScaleConfig.hero }, 0);
    splineTimelines.push(heroTimeline);

    if (document.getElementById('part1')) {
        const part1Timeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-part1', trigger: "#part1", start: "top 70%", end: "center bottom", scrub: 2, invalidateOnRefresh: true }});
        const part1Position = isMobileView ? { x: -0.8, y: 0.3, z: -4.0 } : { x: -2.2, y: 0.5, z: -4.0 };
        part1Timeline.to(capsuleObj.position, part1Position, 0)
            .to(capsuleObj.rotation, { x: degToRad(-45), y: degToRad(65), z: degToRad(-25) }, 0)
            .to(capsuleObj.scale, { x: currentScaleConfig.part1, y: currentScaleConfig.part1, z: currentScaleConfig.part1 }, 0);
        splineTimelines.push(part1Timeline);
    }

    if (document.getElementById('part2')) {
        const part2Timeline = gsap.timeline({ scrollTrigger: { id: "part2SplineScrollTrigger", trigger: "#part2", start: "top 85%", end: "top 30%", scrub: 2, invalidateOnRefresh: true }});
        const part2Position = isMobileView ? { x: 1.2, y: -0.5, z: -4.5 } : { x: 3.2, y: -0.8, z: -4.5 };
        part2Timeline.to(capsuleObj.position, part2Position, 0)
            .to(capsuleObj.rotation, { x: degToRad(60), y: degToRad(-55), z: degToRad(35) }, 0)
            .to(capsuleObj.scale, { x: currentScaleConfig.part2, y: currentScaleConfig.part2, z: currentScaleConfig.part2 }, 0);
        splineTimelines.push(part2Timeline);
    }

    if (document.getElementById('part3')) {
        const part3Timeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-part3', trigger: "#part3", start: "top 30%", end: "center bottom", scrub: 2, invalidateOnRefresh: true }});
        const part3Position = isMobileView ? { x: -1.0, y: -0.4, z: -3.0 } : { x: -2.2, y: -0.3, z: -3.0 };
        part3Timeline.to(capsuleObj.position, part3Position, 0)
            .to(capsuleObj.rotation, { x: degToRad(-30), y: degToRad(90), z: degToRad(20) }, 0)
            .to(capsuleObj.scale, { x: currentScaleConfig.part3, y: currentScaleConfig.part3, z: currentScaleConfig.part3 }, 0);
        splineTimelines.push(part3Timeline);
    }
}

function setupBarAnimations() {
    if (typeof gsap === 'undefined' || typeof MorphSVGPlugin === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const barElement = document.getElementById("barElementPath"); if (!barElement) return; gsap.set(barElement, { morphSVG: barShapesConfig.initial });
    const sections = [ { id: "hero", shape: barShapesConfig.initial, color: "#FFD700" }, { id: "part1", shape: barShapesConfig.part1Enter, color: "#87CEEB" }, { id: "part2", shape: barShapesConfig.part2Enter, color: "#90EE90" }, { id: "part3", shape: barShapesConfig.part3Enter, color: "#FFB6C1" } ];
    sections.forEach((section, index) => { const triggerElement = document.getElementById(section.id); if (!triggerElement) return;
        ScrollTrigger.create({ id: `barMorphTrigger-${section.id}`, trigger: triggerElement, start: "top 10%", end: "bottom top", invalidateOnRefresh: true,
            onEnter: () => gsap.to(barElement, { morphSVG: section.shape, duration: 0.7, ease: "sine.inOut", attr: { fill: section.color } }),
            onEnterBack: () => gsap.to(barElement, { morphSVG: section.shape, duration: 0.7, ease: "sine.inOut", attr: { fill: section.color } })
        });
    });
}

function setupAdvantageCardAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const advantageCards = document.querySelectorAll("#part1 .advantage-card");
    const integratedValueCard = document.querySelector("#part1 .integrated-value-card");
    if (advantageCards.length === 0 && !integratedValueCard) return;

    if (advantageCards.length > 0) {
        gsap.set(advantageCards, { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            id: 'advantageCardsTrigger',
            trigger: "#part1 .advantage-cards-grid",
            start: "top 75%",
            toggleActions: "play none none reverse",
            onEnter: () => gsap.to(advantageCards, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(advantageCards, { autoAlpha: 0, y: 50, duration: 0.4, ease: "power1.in" })
        });
    }
    if (integratedValueCard) {
        gsap.set(integratedValueCard, { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            id: 'integratedValueCardTrigger',
            trigger: integratedValueCard,
            start: "top 80%",
            toggleActions: "play none none reverse",
            onEnter: () => gsap.to(integratedValueCard, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(integratedValueCard, { autoAlpha: 0, y: 50, duration: 0.4, ease: "power1.in" })
        });
    }
}

function setupSectionTitleAnimations() {
    // ScrollTrigger-free design. Managed sequentially by setupSectionSnapScroll.
}

function setupContentTextScrambleAnimations() {
    // Managed sequentially by playSectionTextAnimations.
}

function initializeTextVisibility() {
    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') return;
    
    // Check if the current screen width is desktop-class
    const isDesktop = window.innerWidth >= 768;
    const sections = ["part1", "part2", "part3"];
    
    sections.forEach((partId) => {
        const part = document.getElementById(partId);
        if (!part) return;
        
        // 1. sub-title setup
        const subTitle = part.querySelector(".sub-title");
        if (subTitle) {
            if (subTitle._gsapSplitText) {
                subTitle._gsapSplitText.revert();
            }
            const split = new VanillaSplitText(subTitle, { type: "chars" });
            subTitle._gsapSplitText = split;
            if (split.chars) {
                // Desktop hides text initially for snap entry shuffles; Mobile stays fully visible immediately
                gsap.set(split.chars, { autoAlpha: isDesktop ? 0 : 1 });
            }
        }
        
        // 2. body text setup
        if (partId === "part1") {
            const part1Cards = part.querySelectorAll(".advantage-card, .integrated-value-card");
            gsap.set(part1Cards, { autoAlpha: 1, y: 0 }); // Force containers visible
            part1Cards.forEach((card) => {
                const textElements = card.querySelectorAll("h2, p");
                textElements.forEach((el) => {
                    if (el._gsapSplitText) el._gsapSplitText.revert();
                    const split = new VanillaSplitText(el, { type: "words" });
                    el._gsapSplitText = split;
                    if (split.words) {
                        gsap.set(split.words, { autoAlpha: isDesktop ? 0 : 1 });
                    }
                });
            });
        } else if (partId === "part3") {
            const outroContent = part.querySelector(".outro-content");
            if (outroContent) {
                gsap.set(outroContent, { autoAlpha: 1, y: 0 }); // Force container visible
                const textElements = outroContent.querySelectorAll("h2, p");
                textElements.forEach((el) => {
                    if (el._gsapSplitText) el._gsapSplitText.revert();
                    const split = new VanillaSplitText(el, { type: "words" });
                    el._gsapSplitText = split;
                    if (split.words) {
                        gsap.set(split.words, { autoAlpha: isDesktop ? 0 : 1 });
                    }
                });
            }
        }
    });
    console.log("📝 [TEXT ENGINE] Successfully initialized all sub-titles and cards text states (Desktop Hide/Mobile Show).");
}

function playSectionTextAnimations(partId) {
    const part = document.getElementById(partId);
    if (!part) return;
    
    const subTitle = part.querySelector(".sub-title");
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Step 1: sub-title scramble fade-in (chars)
    if (subTitle && subTitle._gsapSplitText && subTitle._gsapSplitText.chars) {
        // Lock subtitle container height immediately to prevent vertical reflow jitter
        subTitle.style.height = subTitle.offsetHeight + "px";

        const chars = subTitle._gsapSplitText.chars;
        gsap.killTweensOf(chars);
        gsap.set(chars, { autoAlpha: 0 });
        
        const charStagger = 0.04;
        const charDuration = 0.5;
        
        let completedCount = 0;
        const animatableChars = chars.filter(c => c.textContent.trim() !== '');
        const totalCount = animatableChars.length;
        
        chars.forEach((charEl, idx) => {
            const originalChar = charEl.textContent;
            if (originalChar.trim() !== '') {
                // Show opacity in place
                gsap.to(charEl, {
                    autoAlpha: 1,
                    duration: charDuration,
                    delay: idx * charStagger,
                    overwrite: true
                });
                
                // Scramble text
                const obj = { progress: 0 };
                gsap.to(obj, {
                    progress: 1.0,
                    duration: charDuration * 0.9,
                    delay: idx * charStagger,
                    ease: "none",
                    onUpdate: () => {
                        if (obj.progress < 0.92) {
                            charEl.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        } else {
                            charEl.textContent = originalChar;
                        }
                    },
                    onComplete: () => {
                        charEl.textContent = originalChar;
                        completedCount++;
                        
                        // B) Once the title completes its shuffle, fire the body content animation immediately!
                        if (completedCount === totalCount) {
                            subTitle.style.height = ""; // Release height lock
                            triggerBodyContentScramble(partId);
                        }
                    },
                    overwrite: true
                });
            } else {
                gsap.set(charEl, { autoAlpha: 1 });
            }
        });
        
        if (totalCount === 0) {
            subTitle.style.height = "";
            triggerBodyContentScramble(partId);
        }
    } else {
        triggerBodyContentScramble(partId);
    }
}

function triggerBodyContentScramble(partId) {
    const part = document.getElementById(partId);
    if (!part) return;
    
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789';
    
    if (partId === "part1") {
        const part1Cards = part.querySelectorAll(".advantage-card, .integrated-value-card");
        part1Cards.forEach((card, cIdx) => {
            const allWords = [];
            const textElements = card.querySelectorAll("h2, p");
            
            // Lock height of all text container elements individually to prevent cumulative height shifting
            textElements.forEach(el => {
                el.style.height = el.offsetHeight + "px";
                if (el._gsapSplitText && el._gsapSplitText.words) {
                    allWords.push(...el._gsapSplitText.words);
                }
            });
            
            if (allWords.length === 0) {
                textElements.forEach(el => { el.style.height = ""; });
                return;
            }
            
            // Calculate total animation duration to safely release height lock
            const totalDuration = (allWords.length - 1) * 0.03 + cIdx * 0.12 + 0.45;
            gsap.delayedCall(totalDuration, () => {
                textElements.forEach(el => {
                    el.style.height = "";
                });
            });
            
            gsap.killTweensOf(allWords);
            gsap.set(allWords, { autoAlpha: 0 });
            
            allWords.forEach((wordEl, idx) => {
                const txt = wordEl.textContent;
                
                // Show word opacity
                gsap.to(wordEl, {
                    autoAlpha: 1,
                    duration: 0.2,
                    delay: idx * 0.03 + cIdx * 0.12,
                    overwrite: true
                });
                
                // Scramble word text
                const obj = { progress: 0 };
                gsap.to(obj, {
                    progress: 1.0,
                    duration: 0.4,
                    delay: idx * 0.03 + cIdx * 0.12,
                    ease: "none",
                    onUpdate: () => {
                        const length = txt.length;
                        const revealCount = Math.floor(obj.progress * length);
                        let result = "";
                        for (let i = 0; i < length; i++) {
                            if (i < revealCount) {
                                result += txt[i];
                            } else {
                                result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                            }
                        }
                        wordEl.textContent = result;
                    },
                    onComplete: () => {
                        wordEl.textContent = txt;
                    },
                    overwrite: true
                });
            });
        });
    } else if (partId === "part3") {
        const outroContent = part.querySelector(".outro-content");
        if (outroContent) {
            const allWords = [];
            const textElements = outroContent.querySelectorAll("h2, p");
            
            // Lock heights to preventoutro vertical jittering
            textElements.forEach(el => {
                el.style.height = el.offsetHeight + "px";
                if (el._gsapSplitText && el._gsapSplitText.words) {
                    allWords.push(...el._gsapSplitText.words);
                }
            });
            
            if (allWords.length === 0) {
                textElements.forEach(el => { el.style.height = ""; });
                return;
            }
            
            const totalDuration = (allWords.length - 1) * 0.015 + 0.45;
            gsap.delayedCall(totalDuration, () => {
                textElements.forEach(el => {
                    el.style.height = "";
                });
            });
            
            gsap.killTweensOf(allWords);
            gsap.set(allWords, { autoAlpha: 0 });
            
            allWords.forEach((wordEl, idx) => {
                const txt = wordEl.textContent;
                
                gsap.to(wordEl, {
                    autoAlpha: 1,
                    duration: 0.2,
                    delay: idx * 0.015,
                    overwrite: true
                });
                
                const obj = { progress: 0 };
                gsap.to(obj, {
                    progress: 1.0,
                    duration: 0.4,
                    delay: idx * 0.015,
                    ease: "none",
                    onUpdate: () => {
                        const length = txt.length;
                        const revealCount = Math.floor(obj.progress * length);
                        let result = "";
                        for (let i = 0; i < length; i++) {
                            if (i < revealCount) {
                                result += txt[i];
                            } else {
                                result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                            }
                        }
                        wordEl.textContent = result;
                    },
                    onComplete: () => {
                        wordEl.textContent = txt;
                    },
                    overwrite: true
                });
            });
        }
    }
}

function resetSectionTextVisibility(partId) {
    const part = document.getElementById(partId);
    if (!part) return;
    
    const subTitle = part.querySelector(".sub-title");
    if (subTitle && subTitle._gsapSplitText && subTitle._gsapSplitText.chars) {
        gsap.killTweensOf(subTitle._gsapSplitText.chars);
        gsap.set(subTitle._gsapSplitText.chars, { autoAlpha: 0 });
    }
    
    if (partId === "part1") {
        const part1Cards = part.querySelectorAll(".advantage-card, .integrated-value-card");
        part1Cards.forEach((card) => {
            const textElements = card.querySelectorAll("h2, p");
            textElements.forEach((el) => {
                if (el._gsapSplitText && el._gsapSplitText.words) {
                    gsap.killTweensOf(el._gsapSplitText.words);
                    gsap.set(el._gsapSplitText.words, { autoAlpha: 0 });
                }
            });
        });
    } else if (partId === "part3") {
        const outroContent = part.querySelector(".outro-content");
        if (outroContent) {
            const textElements = outroContent.querySelectorAll("h2, p");
            textElements.forEach((el) => {
                if (el._gsapSplitText && el._gsapSplitText.words) {
                    gsap.killTweensOf(el._gsapSplitText.words);
                    gsap.set(el._gsapSplitText.words, { autoAlpha: 0 });
                }
            });
        }
    }
}

function setupOutroContentAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const outroContent = document.querySelector("#part3 .outro-content");
    if (!outroContent) return;
    gsap.set(outroContent, { autoAlpha: 0, y: 60 });
    ScrollTrigger.create({
        id: 'outroContentTrigger',
        trigger: outroContent,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => gsap.to(outroContent, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(outroContent, { autoAlpha: 0, y: 60, duration: 0.4, ease: "power1.in" })
    });
}

function setupHeaderLogoScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const headerLogo = document.querySelector("#header-placeholder .com-name-logo");
    if (!headerLogo) return;
    ScrollTrigger.create({
        id: 'headerLogoScrollTrigger',
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        onLeave: () => gsap.to(headerLogo, { autoAlpha: 1, duration: 0.4 }),
        onEnterBack: () => gsap.to(headerLogo, { autoAlpha: 0, duration: 0.4 })
    });
}

function populateWorksList() {
    const list = document.querySelector("#part2 .works-list");
    if (!list || !worksData) return;
    list.innerHTML = "";
    worksData.slice(0, 6).forEach((item) => {
        const li = document.createElement("li");
        li.className = "work-item";
        li.innerHTML = `
            <a href="page/work-detail.html?id=${item.id}">
                <div class="work-item-thumbnail">
                    <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
                </div>
                <div class="work-item-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </a>
        `;
        list.appendChild(li);
    });
}

function setupWorksHorizontalScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const pinTargetElement = document.querySelector("#part2 .part2-info");
    const list = document.querySelector("#part2 .works-list");
    if (!pinTargetElement || !list) return;

    const getXAmount = () => -(list.scrollWidth - pinTargetElement.offsetWidth + 40);
    const getEndAmount = () => "+=" + (list.scrollWidth - pinTargetElement.offsetWidth);

    gsap.to(list, {
        x: getXAmount,
        ease: "none",
        scrollTrigger: {
            id: 'worksHorizontalScrollTrigger',
            trigger: pinTargetElement,
            pin: pinTargetElement,
            pinType: 'transform',
            start: "center center",
            pinSpacing: true,
            end: getEndAmount,
            scrub: 1.2,
            invalidateOnRefresh: true
        }
    });
}

function setupWorkItemAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const workItems = gsap.utils.toArray("#part2 .work-item");
    const horizontalScrollTrigger = ScrollTrigger.getById('worksHorizontalScrollTrigger');
    if (!horizontalScrollTrigger || workItems.length === 0) return;

    workItems.forEach((item, index) => {
        gsap.set(item, { autoAlpha: 0, y: 75, scale: 0.8, rotationZ: -10 });
        ScrollTrigger.create({
            id: `work-item-anim-${index}`,
            trigger: item,
            containerAnimation: horizontalScrollTrigger.animation,
            start: "left 95%",
            toggleActions: "restart pause resume reverse",
            onEnter: self => gsap.to(self.trigger, { autoAlpha: 1, y: 0, scale: 1, rotationZ: 0, duration: 0.6, ease: "back.out(1.4)", overwrite: true }),
            onLeaveBack: self => gsap.to(self.trigger, { autoAlpha: 0, y: 75, scale: 0.8, rotationZ: -10, duration: 0.4, ease: "power1.in", overwrite: true })
        });
    });
}

function setupScrollToTopButton() {
    const btn = document.getElementById("scrollToTopBtn");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) gsap.to(btn, { autoAlpha: 1, duration: 0.3 });
        else gsap.to(btn, { autoAlpha: 0, duration: 0.3 });
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupHeroTextScrollMotionBlurAnimation() {
    if (typeof ScrollTrigger === 'undefined') return;
    const heroSection = document.getElementById('hero');
    const heroLines = document.querySelectorAll('.com-name-ani, .headline > div');
    if (!heroSection || !heroLines || heroLines.length === 0) return;

    heroLines.forEach(lineEl => {
        lineEl.style.willChange = 'transform, opacity, filter';
        gsap.set(lineEl, { opacity: 1, filter: "blur(0px)", y: 0, scaleY: 1 });
    });

    // Dedicated GSAP timeline for fast responsive Motion Blur Fade Out / Fade In Stagger
    const tl = gsap.timeline({
        scrollTrigger: {
            id: "hero-text-motion-blur",
            trigger: heroSection,
            start: "top top",
            end: "+=350px", // Completes within first 350px of scroll!
            scrub: 0.4,     // Ultra responsive scrub
            invalidateOnRefresh: true
        }
    });

    heroLines.forEach((lineEl, idx) => {
        tl.to(lineEl, {
            y: -160,
            scaleY: 2.6,
            filter: "blur(22px)",
            opacity: 0, // Fades out 100% to zero!
            ease: "power2.inOut"
        }, idx * 0.1);
    });

    console.log("🎬 [MOTION BLUR FADE STAGGER] Initialized Hero Text Motion Blur Fade-Out & Fade-In Scroll Transition");
}

function setupSectionSnapScroll() {
    if (typeof ScrollTrigger === 'undefined') return;

    const existingSnap = ScrollTrigger.getById("fullpage-section-snap");
    if (existingSnap) existingSnap.kill();

    const sections = ["#hero", "#part1", "#part2", "#part3"];

    ScrollTrigger.create({
        id: "fullpage-section-snap",
        snap: {
            snapTo: (progress, self) => {
                const maxScroll = ScrollTrigger.maxScroll(window);
                if (maxScroll <= 0) return progress;

                const sectionRatios = [];
                sections.forEach(secSelector => {
                    const el = document.querySelector(secSelector);
                    if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY;
                        sectionRatios.push(top / maxScroll);
                    }
                });

                const currentScroll = window.scrollY;
                const part2 = document.getElementById("part2");
                
                // 가로 스크롤이 작동 중인 핀 공간 우회
                if (part2) {
                    const rect = part2.getBoundingClientRect();
                    const part2Top = rect.top + window.scrollY;
                    const part2Bottom = rect.bottom + window.scrollY;
                    
                    if (currentScroll >= part2Top + 10 && currentScroll <= part2Bottom - window.innerHeight - 10) {
                        return progress;
                    }
                }

                const direction = self.direction; // 1 = down, -1 = up
                const lastIdx = sectionRatios.length - 1;
                const part3TopRatio = sectionRatios[lastIdx];

                // 만약 part3 시작 위치보다 아래로 휠을 굴려 내려간 상태라면 스냅을 제외하여 푸터 영역 자유 스크롤 보장!
                if (progress > part3TopRatio + 0.015 && direction >= 0) {
                    return progress;
                }

                // closest index
                let closestIndex = 0;
                let minDiff = Infinity;
                sectionRatios.forEach((ratio, idx) => {
                    const diff = Math.abs(ratio - progress);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = idx;
                    }
                });

                let targetIndex = closestIndex;
                if (direction > 0 && closestIndex < lastIdx) {
                    targetIndex = closestIndex + 1;
                } else if (direction < 0 && closestIndex > 0) {
                    // Mobile & Small window snap-back protection:
                    // If scroll is deep inside footer area (progress > part3TopRatio + 0.05) and user attempts to scroll up,
                    // snap them back to part3 Top (lastIdx) first instead of violently jumping to part2 start (index 2).
                    if (progress > part3TopRatio + 0.05) {
                        targetIndex = lastIdx; // Stepwise snap back to Outro Top
                    } else {
                        targetIndex = closestIndex - 1;
                    }
                }

                return sectionRatios[targetIndex];
            },
            duration: { min: 0.18, max: 0.35 },
            delay: 0.06,
            ease: "power2.out",
            onStart: () => {
                // Pause 3D rotation during page transition animations
                if (mainSplineApp && typeof mainSplineApp.setRotating === 'function') {
                    mainSplineApp.setRotating(false);
                }
                // 스냅 이동 시작 즉시 이전/이후 섹션 텍스트들 조용히 은닉 처리
                resetSectionTextVisibility("part1");
                resetSectionTextVisibility("part2");
                resetSectionTextVisibility("part3");
            },
            onComplete: () => {
                // Resume slow 3D rotation after page transition completes
                if (mainSplineApp && typeof mainSplineApp.setRotating === 'function') {
                    mainSplineApp.setRotating(true);
                }
                
                const maxScroll = ScrollTrigger.maxScroll(window);
                if (maxScroll <= 0) return;
                const progress = window.scrollY / maxScroll;
                
                const sectionRatios = [];
                sections.forEach(secSelector => {
                    const el = document.querySelector(secSelector);
                    if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY;
                        sectionRatios.push(top / maxScroll);
                    }
                });

                const rPart1 = sectionRatios[1];
                const rPart2 = sectionRatios[2];
                const rPart3 = sectionRatios[3];
                
                if (Math.abs(progress - rPart1) < 0.04) {
                    playSectionTextAnimations("part1");
                } else if (progress >= rPart2 - 0.02 && progress < rPart3 - 0.02) {
                    playSectionTextAnimations("part2");
                } else if (progress >= rPart3 - 0.02) {
                    playSectionTextAnimations("part3");
                }
            }
        }
    });

    console.log("📍 [FAST SECTION SNAP] Initialized sensitive velocity-free ratio snapping with bottom lock.");
}

function setupScrollIconAnimation() {
    const scrollIcon = document.querySelector(".scroll-icon");
    if (scrollIcon) gsap.to(scrollIcon, { autoAlpha: 1, duration: 0.8, delay: 0.5 });
}

function onMasterIntroComplete() {
    enableScrollInteraction();
    // Commented out background wireframe sphere per user request so Capsule 3D object is the main background:
    /*
    if (typeof window.THREE !== 'undefined') {
        mainPageBackgroundSphere = new InteractiveBackgroundSphere('threejs-background-container', { sphereOffsetX: .1, sphereOffsetY: 0 });
        if (mainPageBackgroundSphere.valid && mainPageBackgroundSphere.init) mainPageBackgroundSphere.init().introAnimate();
    }
    */
    if (!initialSetupDone) {
        setupResponsiveScrollTriggers();
        initialSetupDone = true;
    } else {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(true);
    }
    heroHeadlineTriggerEnabled = true;
    const menuIcon = document.querySelector(".menu-icon");
    if (menuIcon) gsap.to(menuIcon, { duration: 0.8, autoAlpha: 1, ease: "power2.out", delay: 0.1 });
    const scrollIcon = document.querySelector(".scroll-icon");
    if (scrollIcon) gsap.to(scrollIcon, { duration: 0.8, autoAlpha: 1, ease: "power2.out", delay: 0.3 });
    window.scrollTo(0, 0);
    setupParticleTextExplodeInteraction();
}

function setupAllScrollTriggers(isDesktopView) {
    const elementsToClear = ["#part2 .part2-info", "#part2 .works-list", "#part2 .works-list-container"];
    elementsToClear.forEach(selector => { const el = document.querySelector(selector); if (el) gsap.set(el, { clearProps: "all" }); });
    gsap.set(document.body, { clearProps: "backgroundColor" });
    
    setupMainPageBackgroundChangeAnimations();
    if (mainSplineApp && capsuleObj) setupSplineScrollAnimations(capsuleObj, null, isDesktopView);
    setupBarAnimations();
    setupSectionTitleAnimations();
    setupContentTextScrambleAnimations();
    setupHeaderLogoScrollAnimation();
    setupWorksHorizontalScroll();
    setupWorkItemAnimations();
    setupHeroTextScrollMotionBlurAnimation();
    if (isDesktopView) {
        setupSectionSnapScroll();
    }
    setupScrollToTopButton();
    setupScrollIconAnimation();
    initializeTextVisibility();
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    }
    if (initialSetupDone) heroHeadlineTriggerEnabled = true;
}

function setupResponsiveScrollTriggers() {
    if (typeof ScrollTrigger === 'undefined') return;
    let splineResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(splineResizeTimeout);
        splineResizeTimeout = setTimeout(() => {
            if (mainSplineApp && capsuleObj) {
                const isDesktop = window.innerWidth >= 768;
                setupSplineScrollAnimations(capsuleObj, null, isDesktop);
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh(true);
                }
            }
        }, 150);
    });

    ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
            killAllScrollTriggers();
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            setupAllScrollTriggers(true);
            return function() { killAllScrollTriggers(); splineTimelines.forEach(tl => tl.kill()); splineTimelines = []; };
        },
        "(max-width: 767px)": function() {
            killAllScrollTriggers();
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            setupAllScrollTriggers(false);
            return function() { killAllScrollTriggers(); splineTimelines.forEach(tl => tl.kill()); splineTimelines = []; };
        }
    });
}

async function runMainPageSequence() {
    setupScrollRestoration();
    console.log("🎬 [MAIN TEST APP] Starting test page sequence...");
    
    // Load common UI and works data
    await loadCommonUI();
    await loadWorksData();
    populateWorksList();
    
    disableScrollInteraction();

    try {
        const gltfPath = buildUrl('/assets/models/capsule_creo_d/scene-draco.gltf');
        mainSplineApp = await loadGLTFScene("canvas3d", gltfPath);
        if (mainSplineApp) {
            const canvas = document.getElementById("canvas3d");
            if (canvas) gsap.set(canvas, { opacity: 0 }); // Hide canvas initially during top bar loader
            capsuleObj = mainSplineApp.findObjectByName("Winhub");
            if (capsuleObj) capsuleObj.visible = true;
        }
    } catch (error) {
        console.error("❌ MAIN-TEST-APP: Error loading Capsule Creo D GLTF model:", error);
    }

    // Step 1: Execute Top 6px Progress Bar Loading Sequence
    await runLoaderSequence();

    // Start 3D drawing animation sequence immediately after loader finishes
    if (mainSplineApp && typeof mainSplineApp.startDrawingAnimation === 'function') {
        const canvas = document.getElementById("canvas3d");
        if (canvas) gsap.to(canvas, { opacity: 1, duration: 0.35, ease: "power2.out" });
        console.log("🎬 [MAIN TEST APP] Starting 3D Drawing Outline animation sequence...");
        await mainSplineApp.startDrawingAnimation();
    }

    // Step 2: HERO Text Animations (Starts after loader finishes!)
    const comNameElement = document.querySelector(".com-name-ani");
    const heroTextBlock = document.querySelector('.hero-text-block');
    const headlineDivs = document.querySelectorAll(".headline div");

    if (comNameElement && heroTextBlock) {
        if (comNameElement.parentNode !== heroTextBlock) {
            heroTextBlock.prepend(comNameElement);
        }
        
        // Initial setup for WINHUB
        gsap.set(comNameElement, {
            position: 'relative',
            autoAlpha: 1
        });
    }

    gsap.set(".headline", { autoAlpha: 1 });
    gsap.set(headlineDivs, { autoAlpha: 1 });

    const heroTimeline = gsap.timeline({ onComplete: onMasterIntroComplete });
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // A) WINHUB Animation: Drops cleanly from top of browser viewport (y: -250px -> 0px) with BOUNCE landing and rich cipher scramble
    let winhubTotalDuration = 0.8;
    if (comNameElement) {
        try {
            const comNameSplit = new SplitText(comNameElement, { type: "chars" });
            if (comNameSplit.chars && comNameSplit.chars.length > 0) {
                const charStagger = 0.08;
                const charDuration = 0.95;
                comNameSplit.chars.forEach((charEl, idx) => {
                    const originalChar = charEl.textContent;
                    if (originalChar.trim() !== '') {
                        gsap.set(charEl, { autoAlpha: 0, y: -250, x: 0 }); // Descends from top edge of browser
                        heroTimeline.to(charEl, {
                            autoAlpha: 1,
                            y: 0,
                            x: 0,
                            duration: charDuration,
                            ease: "bounce.out", // Bouncy landing into position
                            scrambleText: {
                                text: originalChar,
                                chars: scrambleChars,
                                speed: 2.5,          // Rich, long random code cipher shuffle!
                                revealDelay: 0.18,
                                tweenLength: false
                            }
                        }, idx * charStagger);
                    } else {
                        gsap.set(charEl, { autoAlpha: 1, y: 0, x: 0 });
                    }
                });
                winhubTotalDuration = comNameSplit.chars.length * charStagger + charDuration;
            }
        } catch (e) {
            console.error("SplitText error on WINHUB:", e);
            heroTimeline.fromTo(comNameElement, { y: -250, x: 0, autoAlpha: 0 }, { y: 0, x: 0, autoAlpha: 1, duration: 0.95, ease: "bounce.out" }, 0);
        }
    }

    // B) Headline Texts Animation: 100% continuous seamless character stream across lines (ZERO line pause!)
    if (headlineDivs.length > 0) {
        let currentLineStartTime = winhubTotalDuration + 0.05; // Immediate seamless transition after WINHUB
        const headlineCharStagger = 0.08;
        const headlineCharDuration = 0.95;

        headlineDivs.forEach((divElement) => {
            try {
                const lineSplit = new SplitText(divElement, { type: "chars" });
                if (lineSplit.chars && lineSplit.chars.length > 0) {
                    let validCharsInLine = 0;
                    lineSplit.chars.forEach((charEl) => {
                        const targetChar = charEl.textContent;
                        if (targetChar.trim() !== '') {
                            gsap.set(charEl, { autoAlpha: 0, x: 140, y: 0 });
                            heroTimeline.to(charEl, {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                duration: headlineCharDuration,
                                ease: "power3.out",
                                scrambleText: {
                                    text: targetChar,
                                    chars: scrambleChars,
                                    speed: 2.5,       // Rich long random code cipher shuffle!
                                    revealDelay: 0.18,
                                    tweenLength: false
                                }
                            }, currentLineStartTime + validCharsInLine * headlineCharStagger);
                            validCharsInLine++;
                        } else {
                            gsap.set(charEl, { autoAlpha: 1, x: 0, y: 0 });
                        }
                    });
                    
                    // Continuous line flow: Line N+1 starts immediately at next char stagger interval!
                    currentLineStartTime += validCharsInLine * headlineCharStagger;
                }
            } catch (e) {
                console.error("SplitText error on headline divs:", e);
                heroTimeline.fromTo(divElement, { x: 150, y: 0, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out" }, currentLineStartTime);
                currentLineStartTime += 0.5;
            }
        });
    }
}

function setupParticleTextExplodeInteraction() {
    const canvas = document.getElementById('particle-text-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Support both div and span elements created by SplitText library (cross-version safety)
    const chars = document.querySelectorAll('.com-name-ani div, .com-name-ani span, .headline div div, .headline div span');
    if (!chars || chars.length === 0) return;

    const charData = [];
    chars.forEach((charEl) => {
        if (!charEl.textContent || charEl.textContent.trim() === '') return;

        charEl.style.display = 'inline-block';
        charEl.style.willChange = 'transform, filter, opacity';
        charEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease-out, opacity 0.45s ease-out';
        charEl.style.transformOrigin = 'center bottom';
        charEl.style.opacity = '1';
        charEl.style.filter = 'blur(0px)';
        charEl.style.transform = 'translate3d(0, 0, 0)';

        charData.push({
            el: charEl,
            text: charEl.textContent.trim(),
            homeX: 0,
            homeY: 0,
            rectLeft: 0,
            rectTop: 0,
            rectWidth: 0,
            rectHeight: 0,
            isHovered: false,
            particles: []
        });
    });

    // Compute absolute home coordinates relative to the Document layout space
    function updateStaticCoordinates() {
        // No longer caching static coordinates globally. Bounding rect is checked in real-time.
    }

    updateStaticCoordinates();

    window.addEventListener('resize', () => {
        resizeCanvas();
        updateStaticCoordinates();
    });

    let mouseX = -9999;
    let mouseY = -9999;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    console.log("💨 [ORGANIC TEXT SMOKE DISSOLVE] Initialized Jitter-Free Text-Smoke Vapor Engine");

    const enterRadius = 80;
    const exitRadius = 115;

    function spawnSmokeFogPuffs(c) {
        const numPuffs = 16;
        const particles = [];
        for (let i = 0; i < numPuffs; i++) {
            particles.push({
                x: c.rectLeft + Math.random() * (c.rectWidth || 30),
                y: c.rectTop + Math.random() * (c.rectHeight || 40),
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(1.8 + Math.random() * 2.5),
                size: 14.0 + Math.random() * 16.0,
                maxSize: 35.0 + Math.random() * 25.0,
                alpha: 0.5 + Math.random() * 0.3,
                fadeSpeed: 0.01 + Math.random() * 0.015,
                phase: Math.random() * Math.PI * 2
            });
        }
        return particles;
    }

    let timestamp = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        timestamp += 16;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentScroll = window.scrollY;
        const heroSection = document.getElementById("hero");
        // Only trigger hover when hero section is actually visible inside viewport
        const isHeroVisible = heroSection ? (currentScroll < window.innerHeight - 50) : true;

        charData.forEach((c) => {
            // Force hover release and bypass calculations if hero section is scrolled out
            if (!isHeroVisible) {
                if (c.isHovered) {
                    c.isHovered = false;
                    c.el.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
                    c.el.style.filter = 'blur(0px) brightness(1.0)';
                    c.el.style.opacity = '1';
                    c.particles = [];
                }
                return;
            }

            // Real-time bounding rect in viewport (client) space
            const rect = c.el.getBoundingClientRect();
            const currentElX = rect.left + rect.width / 2;
            let currentElY = rect.top + rect.height / 2;

            // If visually translated up by 45px, offset back to get the original visual center
            if (c.isHovered) {
                currentElY += 45;
            }

            // Calculate distance in client space (no scroll or animation layout shift bias!)
            const dist = Math.hypot(currentElX - mouseX, currentElY - mouseY);

            if (!c.isHovered && dist < enterRadius) {
                c.isHovered = true;
                c.el.style.transform = 'translate3d(0, -45px, 0) scaleY(1.4) scaleX(1.15)';
                c.el.style.filter = 'blur(14px) brightness(1.6)';
                c.el.style.opacity = '0';
                
                // Keep particles relative to document layout for correct scroll tracking
                c.rectLeft = rect.left;
                c.rectTop = rect.top + currentScroll;
                c.rectWidth = rect.width;
                c.rectHeight = rect.height;
                
                c.particles = spawnSmokeFogPuffs(c);
            } else if (c.isHovered && dist > exitRadius) {
                c.isHovered = false;
                c.el.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
                c.el.style.filter = 'blur(0px) brightness(1.0)';
                c.el.style.opacity = '1';
            }

            if (c.particles && c.particles.length > 0) {
                for (let i = c.particles.length - 1; i >= 0; i--) {
                    const p = c.particles[i];

                    p.y += p.vy;
                    p.x += p.vx + Math.sin(timestamp * 0.003 + p.phase) * 0.8;
                    if (p.size < p.maxSize) p.size += 0.45;
                    p.alpha -= p.fadeSpeed;

                    if (p.alpha <= 0) {
                        c.particles.splice(i, 1);
                        continue;
                    }

                    // Convert absolute document coordinates back to fixed viewport space for canvas rendering
                    const drawY = p.y - currentScroll;

                    ctx.save();
                    const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${(p.alpha * 0.45).toFixed(2)})`);
                    grad.addColorStop(0.5, `rgba(186, 230, 253, ${(p.alpha * 0.25).toFixed(2)})`);
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        });
    }

    renderFrame();
}

document.addEventListener("DOMContentLoaded", () => {
    runMainPageSequence().catch(error => {
        console.error("Error in runMainPageSequence:", error);
        hideLoaderOnError();
        enableScrollInteraction();
    });
});

window.addEventListener('beforeunload', () => {
    if (mainSplineApp && typeof mainSplineApp.cleanup === 'function') {
        mainSplineApp.cleanup();
    }
});
