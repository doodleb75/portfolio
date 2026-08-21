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
        bg: "radial-gradient(circle at 75% 55%, #1e1b4b 0%, #0f172a 55%, #020617 100%)", // Deep Electric Indigo / Sapphire Blue
        colorHex: "#3b82f6",
        rimHex: "#60a5fa",
        bounceHex: "#93c5fd"
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

    const heroTimeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-hero', trigger: "#hero", start: "top 10%", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
    heroTimeline.to(capsuleObj.position, { x: heroX, y: heroY, z: -5.0 }, 0)
        .to(capsuleObj.rotation, { x: degToRad(25), y: degToRad(-35), z: degToRad(15) }, 0)
        .to(capsuleObj.scale, { x: currentScaleConfig.hero, y: currentScaleConfig.hero, z: currentScaleConfig.hero }, 0);
    splineTimelines.push(heroTimeline);

    if (document.getElementById('part1')) {
        const part1Timeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-part1', trigger: "#part1", start: "top 70%", end: "center bottom", scrub: 2, invalidateOnRefresh: true } });
        const part1Position = isMobileView ? { x: -0.8, y: 0.3, z: -4.0 } : { x: -2.2, y: 0.5, z: -4.0 };
        part1Timeline.to(capsuleObj.position, part1Position, 0)
            .to(capsuleObj.rotation, { x: degToRad(-45), y: degToRad(65), z: degToRad(-25) }, 0)
            .to(capsuleObj.scale, { x: currentScaleConfig.part1, y: currentScaleConfig.part1, z: currentScaleConfig.part1 }, 0);
        splineTimelines.push(part1Timeline);
    }

    if (document.getElementById('part2')) {
        const part2Timeline = gsap.timeline({ scrollTrigger: { id: "part2SplineScrollTrigger", trigger: "#part2", start: "top 85%", end: "top 30%", scrub: 2, invalidateOnRefresh: true } });
        const part2Position = isMobileView ? { x: 1.2, y: -0.5, z: -4.5 } : { x: 3.2, y: -0.8, z: -4.5 };
        part2Timeline.to(capsuleObj.position, part2Position, 0)
            .to(capsuleObj.rotation, { x: degToRad(60), y: degToRad(-55), z: degToRad(35) }, 0)
            .to(capsuleObj.scale, { x: currentScaleConfig.part2, y: currentScaleConfig.part2, z: currentScaleConfig.part2 }, 0);
        splineTimelines.push(part2Timeline);
    }

    if (document.getElementById('part3')) {
        const part3Timeline = gsap.timeline({ scrollTrigger: { id: 'splineScrollTrigger-part3', trigger: "#part3", start: "top 30%", end: "center bottom", scrub: 2, invalidateOnRefresh: true } });
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
    const sections = [{ id: "hero", shape: barShapesConfig.initial, color: "#FFD700" }, { id: "part1", shape: barShapesConfig.part1Enter, color: "#87CEEB" }, { id: "part2", shape: barShapesConfig.part2Enter, color: "#90EE90" }, { id: "part3", shape: barShapesConfig.part3Enter, color: "#FFB6C1" }];
    sections.forEach((section, index) => {
        const triggerElement = document.getElementById(section.id); if (!triggerElement) return;
        ScrollTrigger.create({
            id: `barMorphTrigger-${section.id}`, trigger: triggerElement, start: "top 10%", end: "bottom top", invalidateOnRefresh: true,
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
                gsap.set(split.chars, { autoAlpha: 0 });
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
                        gsap.set(split.words, { autoAlpha: 0 });
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
                        gsap.set(split.words, { autoAlpha: 0 });
                    }
                });
            }
        }
    });
    console.log("📝 [TEXT ENGINE] Successfully initialized all sub-titles and cards text states for animated entry.");
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
    } else if (partId === "part2") {
        // Part 2 Works title character reset
        if (subTitle && subTitle._gsapSplitText && subTitle._gsapSplitText.chars) {
            gsap.killTweensOf(subTitle._gsapSplitText.chars);
            gsap.set(subTitle._gsapSplitText.chars, { autoAlpha: 0 });
        }
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
    // Disabled to let playSectionTextAnimations handle part3 text scramble and reset consistently with part1/part2
    return;
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
    if (!list) return;

    // worksData가 아직 없으면 기본 6개 백업 프로젝트 데이터 사용
    let targetData = worksData;
    if (!targetData || targetData.length === 0) {
        targetData = [
            { id: "abc-mart-pos", title: "ABC 마트 차세대 POS 시스템 구축", client: "ABC 마트", overview: "PC POS, SCO(셀프 계산대), 모바일 지원 차세대 판매 시점 정보 관리 시스템" },
            { id: "lx-hausys-investment", title: "LX 하우시스 투자관리 시스템 구축", client: "LX 하우시스", overview: "ERP 연동 투자 효율성 증대 체계적 투자 계획/집행/분석 시스템" },
            { id: "ak-plaza-finance", title: "AK PLAZA 新 재무회계/결제 시스템 개발", client: "AK PLAZA", overview: "재무회계 도입, 스마트 영수증 및 네이버페이 연동 개발" },
            { id: "lx-hausys-zin", title: "LX 하우시스 판매기준정보 및 지인스페이스 고도화", client: "LX 하우시스", overview: "판매기준정보 시스템 구축 및 인테리어 주문 지인스페이스 고도화" },
            { id: "ak-plaza-vip", title: "AK PLAZA 新 VIP 회원 정책 적용 시스템 구축", client: "AK PLAZA", overview: "VIP 회원 정책 시스템 적용 및 차별화된 CRM 혜택 시스템" },
            { id: "shinsegae-inc-ev", title: "신세계아이앤씨 전기차 충전 솔루션 I/F 개발", client: "신세계아이앤씨", overview: "전기차 충전 솔루션 인터페이스 I/F 연동 개발" }
        ];
    }

    list.innerHTML = "";

    // Recently Work 5~6개 선택 (최신 6개 프로젝트)
    const recentProjects = targetData.slice(0, 6);

    // 무한 루프 캐러셀을 위해 앞/뒤로 3 세트 복제 (Infinite Loop Seamless Scroll)
    const displayList = [...recentProjects, ...recentProjects, ...recentProjects];

    displayList.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "work-item";
        li.dataset.index = index;
        
        // 프로젝트 아이템 이미지 주소 폴백 설정 (item.thumbnail, item.listImage, id 기반 고해상도 테크 이미지)
        const fallbackImages = {
            'abc-mart-pos': 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?q=80&w=800&auto=format&fit=crop',
            'lx-hausys-investment': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
            'ak-plaza-finance': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
            'lx-hausys-zin': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
            'ak-plaza-vip': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
            'shinsegae-inc-ev': 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop'
        };

        const thumbnailSrc = item.thumbnail || item.listImage || item.image || fallbackImages[item.id] || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop`;
        const clientName = item.client || "WINHUB PROJECT";
        const titleText = item.title || "차세대 시스템 구축";
        const overviewText = item.overview || item.description || "WINHUB의 차세대 기술이 적용된 비즈니스 혁신 프로젝트입니다.";

        li.innerHTML = `
            <div class="work-card-inner">
                <!-- Front: Full-size image & title badge -->
                <div class="work-card-front">
                    <img src="${thumbnailSrc}" alt="${titleText}" loading="lazy" />
                    <div class="front-title-badge">
                        <h3>${titleText}</h3>
                    </div>
                </div>
                <!-- Back: Rollover 180deg Flip Content -->
                <div class="work-card-back">
                    <div class="work-card-back-header">
                        <span class="client-tag">${clientName}</span>
                        <h3>${titleText}</h3>
                    </div>
                    <div class="work-card-back-body">
                        <p class="overview-text">${overviewText}</p>
                    </div>
                    <div class="work-card-back-footer">
                        <a href="page-test/work-detail.html?id=${item.id}" class="detail-link-btn">
                            상세보기 <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);
    });

    setupWorksCarouselControls();
}

function setupWorksCarouselControls() {
    const container = document.querySelector("#part2 .works-list-container");
    const list = document.querySelector("#part2 .works-list");
    const prevBtn = document.querySelector("#part2 .prev-btn");
    const nextBtn = document.querySelector("#part2 .next-btn");
    if (!container || !list) return;

    let isScrolling = false;

    // 카드 한 개의 너비 + 간격 계산
    const getCardWidth = () => {
        const item = list.querySelector(".work-item");
        if (!item) return 320;
        const style = window.getComputedStyle(list);
        const gap = parseFloat(style.gap) || 24;
        return item.offsetWidth + gap;
    };

    // 무한 루프 위치 초기화 (중앙 블록으로 스크롤 세팅)
    const initInfinitePosition = () => {
        const cardWidth = getCardWidth();
        const singleSetWidth = cardWidth * 6; // 6개 아이템
        container.scrollLeft = singleSetWidth;
    };

    // 무한 루프 범위 경계 자동 재배치 (Seamless Loop Check)
    const checkInfiniteLoopBounds = () => {
        const cardWidth = getCardWidth();
        const singleSetWidth = cardWidth * 6;

        if (container.scrollLeft <= 10) {
            container.scrollLeft += singleSetWidth;
        } else if (container.scrollLeft >= singleSetWidth * 2 - 10) {
            container.scrollLeft -= singleSetWidth;
        }
    };

    setTimeout(initInfinitePosition, 100);

    // 1) 마우스 휠 세로 스크롤 -> 가로 스크롤 변환 & 한 카드씩 스냅 이동
    container.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            if (isScrolling) return;

            const cardWidth = getCardWidth();
            const direction = e.deltaY > 0 ? 1 : -1;
            
            isScrolling = true;
            container.scrollBy({
                left: direction * cardWidth,
                behavior: "smooth"
            });

            setTimeout(() => {
                checkInfiniteLoopBounds();
                isScrolling = false;
            }, 380);
        }
    }, { passive: false });

    // 스크롤 멈췄을 때 무한 루프 경계 체크
    let scrollEndTimer;
    container.addEventListener("scroll", () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(checkInfiniteLoopBounds, 150);
    });

    // 2) 이전 / 다음 반투명 보조 버튼 클릭 이벤트
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.preventDefault();
            const cardWidth = getCardWidth();
            container.scrollBy({ left: -cardWidth, behavior: "smooth" });
            setTimeout(checkInfiniteLoopBounds, 400);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            const cardWidth = getCardWidth();
            container.scrollBy({ left: cardWidth, behavior: "smooth" });
            setTimeout(checkInfiniteLoopBounds, 400);
        };
    }
}

function setupWorksHorizontalScroll() {
    // 3D Flip & Horizontal Carousel 사용에 따라 기존 GSAP Pinning 축소 대체
}

function setupWorkItemAnimations() {
    // 3D Flip Card 캐러셀 애니메이션 제어
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
                const windowHeight = window.innerHeight;

                // 1) PART 1 (WINHUB ADVANTAGE) 스크롤 영역 내부 검사
                const part1 = document.getElementById("part1");
                if (part1) {
                    const p1Top = part1.getBoundingClientRect().top + window.scrollY;
                    const p1Height = part1.offsetHeight;
                    const p1Bottom = p1Top + p1Height;

                    // 1번 섹션에 실제로 진입해 있는 경우에만 (Hero 영역에 있을 때는 간섭 금지!)
                    if (currentScroll >= p1Top + 30 && currentScroll <= p1Bottom - windowHeight + 40) {
                        // 최하단 마지막 카드 영역까지 도달했을 때 아래로 스크롤하면 PART 2로 스냅
                        if (self.direction > 0 && (currentScroll + windowHeight) >= (p1Bottom - 20)) {
                            return sectionRatios[2];
                        }
                        // 1번 섹션 상단 근처에서 위로 스크롤하면 HERO로 스냅
                        if (self.direction < 0 && currentScroll <= p1Top + 50) {
                            return sectionRatios[0];
                        }
                        // 그 외 1번 섹션 내부 감상 중에는 자유 스크롤 유지
                        return progress;
                    }
                }

                // 2) PART 2 (WORKS) 가로 스크롤 핀 공간 우회
                const part2 = document.getElementById("part2");
                if (part2) {
                    const rect = part2.getBoundingClientRect();
                    const part2Top = rect.top + window.scrollY;
                    const part2Bottom = rect.bottom + window.scrollY;

                    if (currentScroll >= part2Top + 10 && currentScroll <= part2Bottom - windowHeight - 10) {
                        return progress;
                    }
                }

                const direction = self.direction; // 1 = down, -1 = up
                const lastIdx = sectionRatios.length - 1;
                const part3TopRatio = sectionRatios[lastIdx];

                // 푸터 영역 자유 스크롤 보장
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
                    if (progress > part3TopRatio + 0.05) {
                        targetIndex = lastIdx;
                    } else {
                        targetIndex = closestIndex - 1;
                    }
                }

                return sectionRatios[targetIndex];
            },
            duration: { min: 0.18, max: 0.35 },
            delay: 0.06,
            ease: "power2.out",
            onStart: (self) => {
                // Pause 3D rotation during page transition animations
                if (mainSplineApp && typeof mainSplineApp.setRotating === 'function') {
                    mainSplineApp.setRotating(false);
                }

                // 이동할 스냅 위치와 현재 스크롤 위치를 비교하여 실제 '다른 섹션'으로 넘어가 스냅될 때만 텍스트 초기화!
                const maxScroll = ScrollTrigger.maxScroll(window);
                if (maxScroll > 0) {
                    const currentRatio = window.scrollY / maxScroll;
                    const targetRatio = self.tween ? self.tween.vars.snap : currentRatio;

                    const secSelectors = ["#hero", "#part1", "#part2", "#part3"];
                    const secRatios = secSelectors.map(s => {
                        const el = document.querySelector(s);
                        return el ? (el.getBoundingClientRect().top + window.scrollY) / maxScroll : 0;
                    });

                    // 현재 위치 섹션
                    let currIdx = 0;
                    for (let i = secSelectors.length - 1; i >= 0; i--) {
                        if (currentRatio >= secRatios[i] - 0.03) { currIdx = i; break; }
                    }
                    // 타겟 위치 섹션
                    let targetIdx = 0;
                    for (let i = secSelectors.length - 1; i >= 0; i--) {
                        if (targetRatio >= secRatios[i] - 0.03) { targetIdx = i; break; }
                    }

                    // 스냅 아웃(Snap Out)이 시작되는 그 순간(onStart)에 현재 벗어나는 섹션과 진입할 타겟 섹션의 텍스트를 즉시 opacity: 0 초기화!
                    if (currIdx !== targetIdx) {
                        resetSectionTextVisibility("part1");
                        resetSectionTextVisibility("part2");
                        resetSectionTextVisibility("part3");
                        if (targetIdx === 0 && window.restartHeroRightSloganLoop) {
                            window.restartHeroRightSloganLoop();
                        }
                    }
                }
            },
            onComplete: (self) => {
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

                let newlyEnteredSecIdx = 0;
                if (progress < rPart1 - 0.04) newlyEnteredSecIdx = 0;
                else if (progress >= rPart1 - 0.04 && progress < rPart2 - 0.04) newlyEnteredSecIdx = 1;
                else if (progress >= rPart2 - 0.04 && progress < rPart3 - 0.04) newlyEnteredSecIdx = 2;
                else if (progress >= rPart3 - 0.04) newlyEnteredSecIdx = 3;

                // 실제로 '다른 섹션'으로 진입 안착했을 때만 애니메이션 실행! (같은 섹션 내 스크롤에서는 절대 애니메이션 금지!)
                if (window._currentActiveSecIdx !== newlyEnteredSecIdx) {
                    window._currentActiveSecIdx = newlyEnteredSecIdx;
                    if (newlyEnteredSecIdx === 0 && window.restartHeroRightSloganLoop) {
                        window.restartHeroRightSloganLoop();
                    } else if (newlyEnteredSecIdx === 1) {
                        playSectionTextAnimations("part1");
                    } else if (newlyEnteredSecIdx === 2) {
                        playSectionTextAnimations("part2");
                    } else if (newlyEnteredSecIdx === 3) {
                        playSectionTextAnimations("part3");
                    }
                }
            }
        }
    });

    // 각 섹션 영역을 뷰포트에서 벗어나는 (Leave / LeaveBack) 순간 텍스트를 즉시 opacity: 0 으로 은닉 리셋!
    sections.forEach((secSelector, index) => {
        const partId = secSelector.replace("#", "");
        ScrollTrigger.create({
            id: `section-leave-reset-${partId}`,
            trigger: secSelector,
            start: "top bottom",
            end: "bottom top",
            onLeave: () => {
                if (index === 0) {
                    if (window.resetHeroRightSloganLoopOnLeave) window.resetHeroRightSloganLoopOnLeave();
                } else {
                    resetSectionTextVisibility(partId);
                }
            },
            onLeaveBack: () => {
                if (index === 0) {
                    if (window.resetHeroRightSloganLoopOnLeave) window.resetHeroRightSloganLoopOnLeave();
                } else {
                    resetSectionTextVisibility(partId);
                }
            }
        });
    });

    console.log("📍 [SMART SECTION SNAP] Initialized snapping with long-section inner scroll handling.");
}

function setupScrollIconAnimation() {
    const scrollIcon = document.querySelector(".scroll-icon");
    if (scrollIcon) gsap.to(scrollIcon, { autoAlpha: 1, duration: 0.8, delay: 0.5 });
}

function startRightSloganLoopAnimation() {
    const sloganBlock = document.querySelector(".hero-right-slogan");
    const steamingEl = document.querySelector(".slogan-steaming");
    const subEl = document.querySelector(".slogan-sub");

    if (!sloganBlock || !steamingEl || !subEl) return;

    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let currentCycleTl = null;
    let currentDelayedCall = null;

    function runCycle() {
        if (currentCycleTl) {
            currentCycleTl.kill();
            currentCycleTl = null;
        }
        if (currentDelayedCall) {
            currentDelayedCall.kill();
            currentDelayedCall = null;
        }

        steamingEl.style.filter = "none";
        subEl.style.filter = "none";
        gsap.set([steamingEl, subEl], { autoAlpha: 0, y: 0, x: 0 });
        gsap.set(sloganBlock, { autoAlpha: 1 });

        const cycleTl = gsap.timeline({
            onComplete: () => {
                currentDelayedCall = gsap.delayedCall(3.5, runCycle);
            }
        });
        currentCycleTl = cycleTl;

        try {
            const steamingSplit = new SplitText(steamingEl, { type: "chars" });
            const subSplit = new SplitText(subEl, { type: "chars" });

            if (steamingSplit.chars && subSplit.chars) {
                const steamingChars = steamingSplit.chars;
                const subChars = subSplit.chars;

                gsap.set(sloganBlock, { autoAlpha: 1 });
                gsap.set([steamingEl, subEl], { autoAlpha: 1 });
                gsap.set([...steamingChars, ...subChars], { autoAlpha: 0 });

                // Calculate screen center X offset for dynamic slide-in from screen center
                const centerTargetX = window.innerWidth / 2;

                steamingChars.forEach((charEl, idx) => {
                    const originalChar = charEl.textContent;
                    if (originalChar.trim() !== '') {
                        const rect = charEl.getBoundingClientRect();
                        const charCenterX = rect.left + rect.width / 2;
                        // Slide-in distance starting from center of screen
                        const slideX = (centerTargetX - charCenterX) - (idx * 5);

                        cycleTl.fromTo(charEl, {
                            x: slideX,
                            autoAlpha: 0,
                            filter: "blur(12px)"
                        }, {
                            x: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: 0.85,
                            ease: "power3.out",
                            scrambleText: {
                                text: originalChar,
                                chars: scrambleChars,
                                speed: 2.5,
                                revealDelay: 0.06,
                                tweenLength: false
                            }
                        }, idx * 0.04);
                    } else {
                        gsap.set(charEl, { autoAlpha: 1, x: 0 });
                    }
                });

                const subStartOffset = steamingChars.length * 0.04 + 0.1;
                subChars.forEach((charEl, idx) => {
                    const originalChar = charEl.textContent;
                    if (originalChar.trim() !== '') {
                        const rect = charEl.getBoundingClientRect();
                        const charCenterX = rect.left + rect.width / 2;
                        const slideX = (centerTargetX - charCenterX) - (idx * 4);

                        cycleTl.fromTo(charEl, {
                            x: slideX,
                            autoAlpha: 0,
                            filter: "blur(10px)"
                        }, {
                            x: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: 0.75,
                            ease: "power3.out",
                            scrambleText: {
                                text: originalChar,
                                chars: scrambleChars,
                                speed: 2.5,
                                revealDelay: 0.06,
                                tweenLength: false
                            }
                        }, subStartOffset + idx * 0.03);
                    } else {
                        gsap.set(charEl, { autoAlpha: 1, x: 0 });
                    }
                });
            }
        } catch (e) {
            console.error("SplitText error on slogan loop:", e);
            cycleTl.to(steamingEl, { autoAlpha: 1, duration: 0.6 }, 0)
                .to(subEl, { autoAlpha: 1, duration: 0.6 }, 0.2);
        }

        // 텍스트가 완성된 후 화면에 더 오래 머무르도록 유지 시간 지정 (4.5초)
        cycleTl.to({}, { duration: 4.5 });

        // 3) Smoke vapor rise & dissipate (왼쪽 마우스 오버처럼 캔버스 안개 연기 파티클이 실제로 피어오르며 텍스트 기화 소멸)
        const allChars = sloganBlock.querySelectorAll(".slogan-steaming span, .slogan-steaming div, .slogan-sub span, .slogan-sub div");
        if (allChars && allChars.length > 0) {
            const charArray = Array.from(allChars).filter(c => c.textContent.trim() !== '');
            const shuffled = [...charArray].sort(() => Math.random() - 0.5);

            const smokeStartTime = cycleTl.duration();
            shuffled.forEach((charEl, i) => {
                charEl.style.display = 'inline-block';
                charEl.style.transformOrigin = 'center bottom';

                cycleTl.to(charEl, {
                    y: -45 - Math.random() * 25,
                    x: (Math.random() - 0.5) * 20,
                    scaleY: 1.5,
                    scaleX: 1.2,
                    filter: "blur(14px) brightness(1.8)",
                    opacity: 0,
                    duration: 0.8 + Math.random() * 0.2,
                    ease: "power2.out",
                    onStart: function() {
                        // STEAMING(빨간색 글자)은 강렬한 레드 화염 연기 파티클로, 서브 텍스트는 화이트/블루 연기 파티클로 기화!
                        if (window.spawnSloganEndingSmokePuffs) {
                            const rect = charEl.getBoundingClientRect();
                            const isRedSteaming = charEl.closest('.slogan-steaming') !== null;
                            window.spawnSloganEndingSmokePuffs(rect.left, rect.top + window.scrollY, rect.width, rect.height, isRedSteaming);
                        }
                    }
                }, smokeStartTime + i * 0.025);
            });
        } else {
            cycleTl.to([steamingEl, subEl], {
                y: -50,
                filter: "blur(18px) brightness(1.8)",
                opacity: 0,
                duration: 0.9,
                ease: "power2.out"
            });
        }
    }

    window.resetHeroRightSloganLoopOnLeave = function() {
        if (currentCycleTl) {
            currentCycleTl.kill();
            currentCycleTl = null;
        }
        if (currentDelayedCall) {
            currentDelayedCall.kill();
            currentDelayedCall = null;
        }
        gsap.killTweensOf([steamingEl, subEl]);
        const allChars = sloganBlock.querySelectorAll(".slogan-steaming span, .slogan-steaming div, .slogan-sub span, .slogan-sub div");
        if (allChars) {
            gsap.killTweensOf(allChars);
            gsap.set(allChars, { autoAlpha: 0 });
        }
        gsap.set([steamingEl, subEl], { autoAlpha: 0 });
    };

    window.restartHeroRightSloganLoop = function() {
        window.resetHeroRightSloganLoopOnLeave();
        runCycle();
    };

    currentDelayedCall = gsap.delayedCall(2.0, runCycle);
}

function onMasterIntroComplete() {
    enableScrollInteraction();
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
    setupCustomCyberCursor();
    startRightSloganLoopAnimation();
}

function setupAllScrollTriggers(isDesktopView) {
    const elementsToClear = ["#part2 .part2-info"];
    elementsToClear.forEach(selector => { const el = document.querySelector(selector); if (el) gsap.set(el, { clearProps: "all" }); });
    gsap.set(document.body, { clearProps: "backgroundColor" });

    setupMainPageBackgroundChangeAnimations();
    populateWorksList();
    if (mainSplineApp && capsuleObj) setupSplineScrollAnimations(capsuleObj, null, isDesktopView);
    setupBarAnimations();
    setupSectionTitleAnimations();
    setupContentTextScrambleAnimations();
    setupHeaderLogoScrollAnimation();
    setupWorksHorizontalScroll();
    setupWorkItemAnimations();
    setupHeroTextScrollMotionBlurAnimation();
    setupSectionSnapScroll();
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
        "(min-width: 768px)": function () {
            killAllScrollTriggers();
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            setupAllScrollTriggers(true);
            return function () { killAllScrollTriggers(); splineTimelines.forEach(tl => tl.kill()); splineTimelines = []; };
        },
        "(max-width: 767px)": function () {
            killAllScrollTriggers();
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            setupAllScrollTriggers(false);
            return function () { killAllScrollTriggers(); splineTimelines.forEach(tl => tl.kill()); splineTimelines = []; };
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

    // Initial setup for hero elements
    const sloganBlock = document.querySelector(".hero-right-slogan");
    if (sloganBlock) gsap.set(sloganBlock, { autoAlpha: 0 });

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

    let sparkParticles = [];

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

      // Helper to spawn fiery sparks and dynamic smoke trails for the right slogan leading edge
    window.spawnSloganFireSparks = function(x, y) {
        // Fiery sparks (bright orange/yellow core with high speed)
        for (let i = 0; i < 4; i++) {
            sparkParticles.push({
                x: x + (Math.random() - 0.5) * 15,
                y: y + (Math.random() - 0.5) * 15,
                vx: -(2.5 + Math.random() * 4.0), // Shoot backwards to create tail
                vy: (Math.random() - 0.5) * 3.0 - 0.8,
                size: 3.5 + Math.random() * 4.5,
                alpha: 1.0,
                color: Math.random() > 0.3 ? '#ffcc00' : '#ff4400',
                type: 'spark',
                life: 1.0,
                decay: 0.03 + Math.random() * 0.04
            });
        }
        // Heavy smoke tail (dark gray/black volumetric puff)
        for (let i = 0; i < 2; i++) {
            sparkParticles.push({
                x: x - Math.random() * 10,
                y: y + (Math.random() - 0.5) * 12,
                vx: -(1.0 + Math.random() * 2.0),
                vy: -(0.5 + Math.random() * 1.2), // Rises up organically
                size: 14.0 + Math.random() * 10.0,
                maxSize: 35.0 + Math.random() * 20.0,
                alpha: 0.6 + Math.random() * 0.2,
                type: 'smoke',
                life: 1.0,
                decay: 0.012 + Math.random() * 0.015
            });
        }
    };

    // Helper to spawn real Volumetric Canvas Smoke Puffs when slogan text dissipates
    window.spawnSloganEndingSmokePuffs = function(left, top, width, height, isRed = false) {
        for (let i = 0; i < 7; i++) {
            sparkParticles.push({
                x: left + Math.random() * (width || 20),
                y: top + Math.random() * (height || 20),
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(1.5 + Math.random() * 2.2),
                size: 16.0 + Math.random() * 18.0,
                maxSize: 45.0 + Math.random() * 25.0,
                alpha: 0.8 + Math.random() * 0.2,
                type: isRed ? 'red-smoke' : 'white-smoke',
                life: 1.0,
                decay: 0.01 + Math.random() * 0.015
            });
        }
    };

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
        const numPuffs = 18;
        const particles = [];
        for (let i = 0; i < numPuffs; i++) {
            particles.push({
                x: c.rectLeft + Math.random() * (c.rectWidth || 30),
                y: c.rectTop + Math.random() * (c.rectHeight || 40),
                vx: (Math.random() - 0.5) * 1.0,
                vy: -(1.2 + Math.random() * 1.8),
                size: 16.0 + Math.random() * 18.0,
                maxSize: 40.0 + Math.random() * 30.0,
                alpha: 0.6 + Math.random() * 0.3,
                fadeSpeed: 0.003 + Math.random() * 0.005, // Slower fade out for lasting smoke fog
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
        const isHeroVisible = heroSection ? (currentScroll < window.innerHeight - 50) : true;
        // Render global fire sparks & smoke trail particles
        if (sparkParticles.length > 0) {
            for (let i = sparkParticles.length - 1; i >= 0; i--) {
                const p = sparkParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.alpha = Math.max(0, p.life);

                if (p.life <= 0) {
                    sparkParticles.splice(i, 1);
                    continue;
                }

                ctx.save();
                if (p.type === 'spark') {
                    // Bright Fiery Glow Spark
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = p.color;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.type === 'smoke') {
                    // Dark Thick Smoke Trail (Matching 2nd Reference Image)
                    if (p.size < p.maxSize) p.size += 0.4;
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                    grad.addColorStop(0, `rgba(30, 25, 45, ${(p.alpha * 0.55).toFixed(2)})`);
                    grad.addColorStop(0.5, `rgba(50, 40, 70, ${(p.alpha * 0.35).toFixed(2)})`);
                    grad.addColorStop(1, 'rgba(15, 10, 25, 0)');

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.type === 'white-smoke') {
                    // White & Neon Light-Blue Volumetric Smoke Dissipate (Exact match to left text hover effect!)
                    if (p.size < p.maxSize) p.size += 0.45;
                    const drawY = p.y - currentScroll;
                    const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${(p.alpha * 0.65).toFixed(2)})`);
                    grad.addColorStop(0.5, `rgba(186, 230, 253, ${(p.alpha * 0.35).toFixed(2)})`);
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.type === 'red-smoke') {
                    // Fiery Crimson Red Volumetric Smoke Dissipate for STEAMING text
                    if (p.size < p.maxSize) p.size += 0.45;
                    const drawY = p.y - currentScroll;
                    const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size);
                    grad.addColorStop(0, `rgba(255, 35, 75, ${(p.alpha * 0.85).toFixed(2)})`);
                    grad.addColorStop(0.4, `rgba(220, 20, 60, ${(p.alpha * 0.5).toFixed(2)})`);
                    grad.addColorStop(0.8, `rgba(120, 10, 35, ${(p.alpha * 0.2).toFixed(2)})`);
                    grad.addColorStop(1, 'rgba(255, 0, 0, 0)');

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

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
                    if (p.size < p.maxSize) p.size += 0.35;
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

function setupCustomCyberCursor() {
    const cursorContainer = document.getElementById('custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!cursorContainer || !dot || !ring) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    let dotX = targetX, dotY = targetY;
    let ringX = targetX, ringY = targetY;

    let prevMouseX = targetX, prevMouseY = targetY;
    let currentVelocity = 0;
    let cursorActive = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;

        if (!cursorActive) {
            cursorActive = true;
            dotX = targetX;
            dotY = targetY;
            ringX = targetX;
            ringY = targetY;
            cursorContainer.style.display = 'block';
            gsap.to(cursorContainer, { autoAlpha: 1, duration: 0.2 });
        }

        const vx = targetX - prevMouseX;
        const vy = targetY - prevMouseY;
        currentVelocity = Math.hypot(vx, vy);

        prevMouseX = targetX;
        prevMouseY = targetY;
    });

    let isHoveringLink = false;
    window.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (target && (target.closest('a') || target.closest('button') || target.closest('.clickable') || target.closest('input') || target.closest('[onclick]'))) {
            isHoveringLink = true;
        } else {
            isHoveringLink = false;
        }
    });

    function updateCursor() {
        requestAnimationFrame(updateCursor);

        // Center red ball moves smoothly with constant linear interpolation (equal speed tracking)
        dotX += (targetX - dotX) * 0.4;
        dotY += (targetY - dotY) * 0.4;

        // Outer white outline ring follows with physics lag & velocity acceleration
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;

        // Decay velocity for smooth blur dissipation
        currentVelocity *= 0.92;

        // Calculate velocity-based blur, scale, and ball expansion
        const blurAmount = Math.min(currentVelocity * 0.65, 24);
        const ringScale = isHoveringLink ? 1.6 : (1 + Math.min(currentVelocity * 0.015, 0.85));
        const dotScale = isHoveringLink ? 0.4 : (1 + Math.min(currentVelocity * 0.012, 0.6));

        dot.style.opacity = isHoveringLink ? '0.3' : '1';
        ring.style.borderColor = isHoveringLink ? 'rgba(192, 132, 252, 0.9)' : 'rgba(255, 255, 255, 0.85)';

        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ring.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
    }

    updateCursor();
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
