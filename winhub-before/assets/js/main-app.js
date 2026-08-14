// main-app.js

// -----------------------------------------
// main-app.js
// Description: Script for the main page (index.html).
// Imports: SplineRuntime, THREE, GSAP, common-utils.js
// -----------------------------------------

// Spline Runtime
import { Application as SplineRuntimeApp } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';

// THREE.js
import * as THREE_MOD from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
window.THREE = THREE_MOD; // Expose THREE to the global scope

// GSAP Plugins
import { Draggable } from "https://esm.sh/gsap/Draggable";
import { SplitText } from "https://esm.sh/gsap/SplitText";
import { MorphSVGPlugin } from "https://esm.sh/gsap/MorphSVGPlugin";

// Register GSAP plugins
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(Draggable, SplitText, MorphSVGPlugin);
}

// Imports from common-utils
import {
    setupScrollRestoration,
    degToRad,
    responsiveScale,
    responsiveX,
    responsiveY,
    startLoaderBarAnimation,
    hideLoader,
    InteractiveBackgroundSphere,
    setupMenu,
    setupMenuLinkEffects,
    loadSplineScene,
    killAllScrollTriggers,
    killScrollTriggersByPattern
} from './common-utils.js';

// --- Global Variables for Main Page ---
let mainSplineApp = null;
let winhub = null, cable = null, splineTimelines = [];
let splitComName, splitSubTitles = [], splitHeadlineChars = [];
let mainPageBackgroundSphere = null;
let initialSetupDone = false; // matchMedia 초기 설정 완료 플래그

// GSAP ScrollTrigger Configuration for auto-refresh events
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });
}

const getScaleConfig = (isDesktopView) => {
    return {
        hero: isDesktopView ? 140 : 500,
        part1: isDesktopView ? 200 : 500,
        part2: isDesktopView ? 200 : 500,
        part3: isDesktopView ? 200 : 500
    };
};

const barShapesConfig = {
    initial: "M0 5 L0 5 L0 5 L0 5 Z",
    part1Enter: "M0,5 Q15,0 30,4 Q50,7 70,4 Q85,0 100,5 V5 Q85,10 70,6 Q50,3 30,6 Q15,10 0,5 Z",
    part2Enter: "M0,5 C20,-5 40,15 50,5 C60,-5 80,15 100,5 V5 C80,0 60,10 50,5 C40,0 20,10 0,5 Z",
    part3Enter: "M0,5 Q20,10 40,5 Q60,0 80,5 Q100,10 100,5 V5 Q80,0 60,5 Q40,10 20,5 Q0,0 0,5 Z",
    full: "M0,0 H100 V10 H0 Z"
};

const getTargetWinhubX = () => responsiveX(65);
const WINHUB_INTRO_END_Y = 0;
const WINHUB_INTRO_END_Z = 0;

const partBackgroundColors = {
    hero: "#410b7a",
    part1: "#0b2c7a",
    part2: "#0b7a48",
    part3: "#7a063c"
};

function setupSubTitleAnimation() {
    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP, SplitText, or ScrollTrigger not available for subtitle animation.");
        return;
    }
    const subTitleElements = document.querySelectorAll(".sub-title");
    if (subTitleElements.length === 0) {
        return;
    }

    splitSubTitles.forEach(splitInstance => splitInstance?.revert());
    splitSubTitles = [];

    subTitleElements.forEach((element, index) => {
        const isOutroTitle = element.closest('#part3');
        const textContentForId = element.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const triggerIdSuffix = textContentForId || `untitled-${index}`;
        const triggerId = isOutroTitle ? `subTitleAppearTrigger-outro-${index}` : `subTitleAppearTrigger-${triggerIdSuffix}-${index}`;
        let splitInstance;

        try {
            splitInstance = new SplitText(element, { type: "chars" });
            splitSubTitles.push(splitInstance);
            
            gsap.set(element, { autoAlpha: 1 }); 


            if (isOutroTitle) { 
                console.log(`Part 3 Subtitle (${triggerId}): SplitText created. Chars found:`, splitInstance.chars ? splitInstance.chars.length : 0, "Element content:", element.innerText);

                if (splitInstance.chars && splitInstance.chars.length > 0) {
                    const part3Info = element.closest('.part3-info');
                    if (part3Info) {
                        gsap.set(part3Info, { autoAlpha: 1 }); 
                    }
                    
                    ScrollTrigger.create({
                        id: triggerId,
                        trigger: element,
                        start: "top 75%", 
                        toggleActions: "play none none reverse",
                        invalidateOnRefresh: true,
                        markers: false, 
                        onEnter: () => {
                            console.log(`Part 3 Subtitle (${triggerId}): onEnter triggered. Animating chars.`);
                            gsap.fromTo(splitInstance.chars, 
                                { opacity: 0, y: -60 }, 
                                { 
                                    opacity: 1, 
                                    y: 0, 
                                    color: '', 
                                    duration: 0.6, 
                                    ease: "bounce.out", 
                                    stagger: 0.08, 
                                    overwrite: true 
                                }
                            );
                        },
                        onLeaveBack: () => { 
                            gsap.to(splitInstance.chars, { opacity: 0, y: -60, duration: 0.3, ease: "power1.in", stagger: { each: 0.04, from: "start" } });
                        },
                        onToggle: (self) => { 
                            console.log(`Part 3 Subtitle (${triggerId}): onToggle, isActive: ${self.isActive}, direction: ${self.direction}`);
                        }
                    });
                } else {
                    console.error(`Part 3 Subtitle (${triggerId}): SplitText found no characters. Element set to visible.`);
                    gsap.set(element, { autoAlpha: 1, y: 0 }); 
                }
            } else { 
                ScrollTrigger.create({
                    id: triggerId,
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "restart reverse restart reverse", 
                    invalidateOnRefresh: true,
                    onEnter: () => gsap.fromTo(splitInstance.chars, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out", stagger: 0.08, overwrite: true }),
                    onLeave: () => gsap.to(splitInstance.chars, { opacity: 0, y: 70, duration: 0.3, ease: "power1.in", stagger: { each: 0.04, from: "end" }, overwrite: true }),
                    onEnterBack: () => gsap.fromTo(splitInstance.chars, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out", stagger: 0.08, overwrite: true }),
                    onLeaveBack: () => gsap.to(splitInstance.chars, { opacity: 0, y: -60, duration: 0.3, ease: "power1.in", stagger: { each: 0.04, from: "start" }, overwrite: true })
                });
            }
        } catch (e) {
            console.error(`Error with SplitText/ScrollTrigger for .sub-title (${triggerId}):`, element, e);
            gsap.set(element, { autoAlpha: 1, y: 0 }); 
        }
    });
}

function setupWorksHorizontalScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }
    const pinTargetElement = document.querySelector("#part2 .part2-info");
    const list = document.querySelector("#part2 .works-list");
    if (!pinTargetElement || !list) {
        return;
    }

    let worksTitleTriggerId = "subTitleAppearTrigger-works-0";
    const worksSubTitleElement = document.querySelector("#part2 .sub-title");
    if (worksSubTitleElement) {
        const textContentForId = worksSubTitleElement.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const stInstance = ScrollTrigger.getAll().find(st => st.vars.trigger === worksSubTitleElement && st.vars.id.startsWith(`subTitleAppearTrigger-${textContentForId}`));
        if (stInstance) {
            worksTitleTriggerId = stInstance.vars.id;
        } else {
             console.warn("Could not find specific ScrollTrigger ID for #part2 .sub-title. Using default for horizontal scroll linkage.");
        }
    }

    gsap.to(list, {
        x: () => -(list.scrollWidth - pinTargetElement.offsetWidth + 40),
        ease: "none",
        scrollTrigger: {
            id: 'worksHorizontalScrollTrigger',
            trigger: pinTargetElement,
            pin: pinTargetElement,
            start: "center center",
            pinSpacing: true,
            end: () => "+=" + (list.scrollWidth - pinTargetElement.offsetWidth),
            anticipatePin: 1,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onEnter: () => {
                const worksTitleST = ScrollTrigger.getById(worksTitleTriggerId);
                if (worksTitleST && worksTitleST.enabled) {
                    worksTitleST.disable(false);
                }
            },
            onLeave: () => {
                const worksTitleST = ScrollTrigger.getById(worksTitleTriggerId);
                if (worksTitleST && !worksTitleST.enabled) {
                    worksTitleST.enable(false);
                }
            },
            onEnterBack: () => {
                const worksTitleST = ScrollTrigger.getById(worksTitleTriggerId);
                if (worksTitleST && worksTitleST.enabled) {
                    worksTitleST.disable(false);
                }
            },
            onLeaveBack: () => {
                const worksTitleST = ScrollTrigger.getById(worksTitleTriggerId);
                if (worksTitleST && !worksTitleST.enabled) {
                    worksTitleST.enable(false);
                }
            }
        }
    });
}

function setupComNameScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }
    const comNameElement = document.querySelector(".com-name-ani");
    if (!comNameElement) {
        return;
    }
    ScrollTrigger.create({
        id: 'comNameSizeTrigger', trigger: "#hero", start: "70% top",
        invalidateOnRefresh: true,
        onLeave: () => {
            gsap.to(comNameElement, {
                position: "fixed", 
                top: "1.25rem",
                left: "1.25rem",
                duration: 0.4, ease: "power1.out", overwrite: 'auto'
            });
            comNameElement.classList.add('scrolled');
        },
        onEnterBack: () => {
            const isMobileView = window.innerWidth <= 767;
            gsap.to(comNameElement, {
                position: "absolute", 
                top: isMobileView ? "-75px" : "-150px",      
                left: isMobileView ? "20px" : "60px",       
                duration: 0.4, ease: "power1.out", overwrite: 'auto'
            });
            comNameElement.classList.remove('scrolled');
        }
    });
}

function setupMainPageBackgroundChangeAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.set(document.body, { backgroundColor: partBackgroundColors.hero });
    ['part1', 'part2', 'part3'].forEach(partId => {
        const sectionElement = document.getElementById(partId);
        const targetColor = partBackgroundColors[partId];
        if (sectionElement && targetColor) {
            ScrollTrigger.create({
                id: `mainPageBackgroundChangeTrigger-${partId}`, trigger: sectionElement,
                start: "top center+=20%", end: "bottom center-=20%",
                invalidateOnRefresh: true,
                onEnter: () => gsap.to(document.body, { backgroundColor: targetColor, duration: 0.8, ease: "sine.inOut" }),
                onEnterBack: () => gsap.to(document.body, { backgroundColor: targetColor, duration: 0.8, ease: "sine.inOut" }),
                onLeaveBack: () => {
                    const prevColorKey = partId === 'part1' ? 'hero' : (partId === 'part2' ? 'part1' : 'part2');
                    gsap.to(document.body, { backgroundColor: partBackgroundColors[prevColorKey], duration: 0.8, ease: "sine.inOut" });
                }
            });
        }
    });
}

function setupSplineScrollAnimations(winhubObj, cableObj, isDesktopView) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded for Spline animations.");
        return;
    }

    splineTimelines.forEach(tl => tl.kill());
    splineTimelines = [];
    const currentScaleConfig = getScaleConfig(isDesktopView);

    const heroTimeline = gsap.timeline({ scrollTrigger: {
        id: 'splineScrollTrigger-hero', trigger: "#hero", start: "top 10%", end: "bottom bottom", scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => cableObj && (cableObj.visible = false),
        onLeaveBack: () => cableObj && (cableObj.visible = false),
        onRefresh: () => { if (ScrollTrigger.isInViewport("#hero") && (!document.querySelector("#part1") || !ScrollTrigger.isInViewport("#part1"))) cableObj && (cableObj.visible = false); }
    }});
    heroTimeline.to(winhubObj.position, { x: getTargetWinhubX(), y: WINHUB_INTRO_END_Y, z: WINHUB_INTRO_END_Z }, 0)
                .to(winhubObj.rotation, { x: degToRad(0), y: degToRad(90), z: degToRad(0) }, 0)
                .to(winhubObj.scale, { x: responsiveScale(currentScaleConfig.hero), y: responsiveScale(currentScaleConfig.hero), z: responsiveScale(currentScaleConfig.hero) }, 0);
    splineTimelines.push(heroTimeline);

    if (document.getElementById('part1')) {
        const part1Timeline = gsap.timeline({ scrollTrigger: {
            id: 'splineScrollTrigger-part1', trigger: "#part1", start: "top 70%", end: "center bottom", scrub: 2,
            invalidateOnRefresh: true,
            onEnter: () => cableObj && (cableObj.visible = true), onEnterBack: () => cableObj && (cableObj.visible = true), onLeaveBack: () => cableObj && (cableObj.visible = false)
        }});
        part1Timeline.to(winhubObj.position, { x: responsiveX(-93.75), y: responsiveY(37.04), z: responsiveX(-31.25) }, 0)
                     .to(winhubObj.rotation, { x: degToRad(80.5), y: degToRad(60), z: degToRad(-65) }, 0)
                     .to(winhubObj.scale, { x: responsiveScale(currentScaleConfig.part1), y: responsiveScale(currentScaleConfig.part1), z: responsiveScale(currentScaleConfig.part1) }, 0);
        splineTimelines.push(part1Timeline);
    }
    if (document.getElementById('part2')) {
        const part2Timeline = gsap.timeline({ scrollTrigger: {
            id: "part2SplineScrollTrigger", trigger: "#part2", start: "top 85%", end: "top 30%", scrub: 2,
            invalidateOnRefresh: true,
            onEnter: () => cableObj && (cableObj.visible = true), onEnterBack: () => cableObj && (cableObj.visible = true)
        }});
        part2Timeline.to(winhubObj.rotation, { x: degToRad(40), y: degToRad(60), z: degToRad(-60) }, 0)
                     .to(winhubObj.position, { x: responsiveX(50), y: responsiveY(10), z: responsiveX(-20) }, 0)
                     .to(winhubObj.scale, { x: responsiveScale(currentScaleConfig.part2 * 0.8), y: responsiveScale(currentScaleConfig.part2 * 0.8), z: responsiveScale(currentScaleConfig.part2 * 0.8) }, 0);
        splineTimelines.push(part2Timeline);
    }
    if (document.getElementById('part3')) {
        const part3Timeline = gsap.timeline({ scrollTrigger: {
            id: 'splineScrollTrigger-part3', trigger: "#part3", start: "top 30%", end: "center bottom", scrub: 2,
            invalidateOnRefresh: true,
            onEnter: () => cableObj && (cableObj.visible = true)
        }});
        part3Timeline.to(winhubObj.rotation, { x: degToRad(90), y: degToRad(-25), z: degToRad(-20) }, 0)
                     .to(winhubObj.scale, { x: responsiveScale(currentScaleConfig.part3), y: responsiveScale(currentScaleConfig.part3), z: responsiveScale(currentScaleConfig.part3) }, 0)
                     .to(winhubObj.position, { x: responsiveX(-61.67), y: responsiveY(80.11), z: 0 }, 0);
        splineTimelines.push(part3Timeline);
    }
}

function setupBarAnimations() {
    if (typeof gsap === 'undefined' || typeof MorphSVGPlugin === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP, MorphSVGPlugin, or ScrollTrigger not available for bar animation.");
        return;
    }
    const barElement = document.getElementById("barElementPath");
    if (!barElement) return;

    gsap.set(barElement, { morphSVG: barShapesConfig.initial });

    const sections = [
        { id: "hero", shape: barShapesConfig.initial, nextShape: barShapesConfig.part1Enter, color: "#FFD700" },
        { id: "part1", shape: barShapesConfig.part1Enter, nextShape: barShapesConfig.part2Enter, color: "#87CEEB" },
        { id: "part2", shape: barShapesConfig.part2Enter, nextShape: barShapesConfig.part3Enter, color: "#90EE90" },
        { id: "part3", shape: barShapesConfig.part3Enter, nextShape: barShapesConfig.full, color: "#FFB6C1" }
    ];

    sections.forEach((section, index) => {
        const triggerElement = document.getElementById(section.id);
        if (!triggerElement) return;

        ScrollTrigger.create({
            id: `barMorphTrigger-${section.id}`,
            trigger: triggerElement,
            start: "top 10%",
            end: "bottom top",
            invalidateOnRefresh: true,
            onEnter: () => {
                gsap.to(barElement, {
                    morphSVG: section.shape,
                    duration: 0.7,
                    ease: "sine.inOut",
                    attr: { fill: section.color }
                });
            },
            onEnterBack: () => {
                gsap.to(barElement, {
                    morphSVG: section.shape,
                    duration: 0.7,
                    ease: "sine.inOut",
                    attr: { fill: section.color }
                });
            },
            onLeaveBack: () => {
                if (index > 0) {
                    gsap.to(barElement, {
                        morphSVG: sections[index - 1].shape,
                        duration: 0.7,
                        ease: "sine.inOut",
                        attr: { fill: sections[index - 1].color }
                    });
                } else {
                     gsap.to(barElement, {
                        morphSVG: barShapesConfig.initial,
                        duration: 0.7,
                        ease: "sine.inOut",
                        attr: { fill: sections[0].color }
                    });
                }
            }
        });
    });
}

function setupAdvantageCardAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger not available for advantage card animations.");
        return;
    }

    const advantageCards = gsap.utils.toArray("#part1 .advantage-card");
    const integratedCard = document.querySelector("#part1 .integrated-value-card");

    advantageCards.forEach((card, index) => {
        gsap.set(card, { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            id: `advantageCardTrigger-${index}`,
            trigger: card,
            start: "top 85%",
            invalidateOnRefresh: true,
            toggleActions: "play none none reverse",
            onEnter: () => gsap.to(card, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                delay: index * 0.1
            }),
        });
    });

    if (integratedCard) {
        gsap.set(integratedCard, { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            id: 'integratedCardTrigger',
            trigger: integratedCard,
            start: "top 85%",
            invalidateOnRefresh: true,
            toggleActions: "play none none reverse",
            onEnter: () => gsap.to(integratedCard, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                delay: advantageCards.length * 0.1
            }),
        });
    }
}

function setupOutroContentAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger not available for outro content animation.");
        return;
    }

    const outroContentContainer = document.querySelector("#part3 .outro-content");
    if (!outroContentContainer) {
        console.warn("#part3 .outro-content not found for animation.");
        return;
    }
    
    const part3Info = outroContentContainer.closest('.part3-info');
    if (part3Info) {
        gsap.set(part3Info, { autoAlpha: 1 }); 
    }
    gsap.set(outroContentContainer, { autoAlpha: 1 });


    const elementsToAnimate = gsap.utils.toArray(outroContentContainer.children);
    if (elementsToAnimate.length === 0) {
        console.warn("No children found in #part3 .outro-content to animate.");
        return;
    }

    gsap.set(elementsToAnimate, { autoAlpha: 0, y: 40 }); 

    ScrollTrigger.create({
        id: `outroContentAllTrigger`, 
        trigger: outroContentContainer, 
        start: "top 80%", 
        invalidateOnRefresh: true,
        toggleActions: "play none none reverse",
        markers: false, 
        onEnter: () => {
            console.log('Part 3 Outro Content Enter. Container:', outroContentContainer, 'Animating Elements:', elementsToAnimate.length);
            gsap.to(elementsToAnimate, {
                autoAlpha: 1,
                y: 0,
                color: '', 
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.15 
            });
        },
        onLeaveBack: () => { 
             gsap.to(elementsToAnimate, { autoAlpha: 0, y: 40, duration: 0.3, ease: "power1.in" });
        },
        onToggle: (self) => {
            console.log(`Part 3 Outro Content (${self.vars.id}): onToggle, isActive: ${self.isActive}, direction: ${self.direction}`);
        }
    });
}

// Updated setupScrollToTopButton function from sub-app.js
function setupScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (!scrollToTopBtn) {
        console.warn("MAIN-APP: Scroll to Top button (#scrollToTopBtn) not found.");
        return;
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > window.innerHeight / 2) { 
            if (!scrollToTopBtn.classList.contains("show")) {
                scrollToTopBtn.classList.add("show");
            }
        } else {
            if (scrollToTopBtn.classList.contains("show")) {
                scrollToTopBtn.classList.remove("show");
            }
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    console.log("MAIN-APP: Scroll to Top button setup complete (using sub-app.js logic).");
}


async function runMainPageSequence() {
    if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
        await hideLoader(); return;
    }
    const loaderBarPromise = startLoaderBarAnimation({ barDuration: 1.5 });
    const splineCanvas = document.getElementById("canvas3d");
    if (splineCanvas) gsap.set(splineCanvas, { autoAlpha: 0 });

    try {
        mainSplineApp = await loadSplineScene("canvas3d", "https://prod.spline.design/0FDfaGjmdgz0JYwR/scene.splinecode");
        if (mainSplineApp) {
            winhub = mainSplineApp.findObjectByName("Winhub");
            cable = mainSplineApp.findObjectByName("cable");
            if (winhub) winhub.visible = false;
            if (cable) cable.visible = false;
            if (!winhub || !cable) console.error("MAIN-APP: Missing critical Spline objects (Winhub or cable).");
        } else {
            console.error("MAIN-APP: Main Spline App could not be loaded.");
        }
        await loaderBarPromise;
    } catch (error) {
        console.error("MAIN-APP: Error during critical loading:", error);
    }

    await hideLoader({ fadeDuration: 0.5 });
    document.body.style.overflow = 'hidden';

    const comNameElement = document.querySelector(".com-name-ani");
    if (comNameElement) {
        try { splitComName = new SplitText(".com-name-ani", { type: "chars" }); gsap.set(splitComName.chars, { opacity: 0 }); }
        catch (e) {
            splitComName = null;
        }
    }

    gsap.set(".com-name-ani", { autoAlpha: 0 }); gsap.set(".headline", { autoAlpha: 0 });

    const masterIntroTimeline = gsap.timeline({ onComplete: onMasterIntroComplete });
    const currentScaleConfig = getScaleConfig(window.innerWidth >= 768);
    const isMobileViewInitial = window.innerWidth <= 767; // Check initial viewport width

    if (splitComName) {
        masterIntroTimeline
            .set(".com-name-ani", { // Initial state: viewport centered
                autoAlpha: 1,
                position: "fixed", 
                top: "50%",
                left: "50%",
                xPercent: -50, 
                yPercent: -50,
                zIndex: 1001 
            })
            .fromTo(splitComName.chars, { opacity: 0, y: -200 }, { duration: 1, opacity: 1, y: 0, ease: "bounce.out", stagger: 0.1 })
            .to(".com-name-ani", { // Transition to position within .container
                duration: 0.8,
                position: "absolute", 
                top: isMobileViewInitial ? "-75px" : "-150px", // Adjusted for mobile
                left: isMobileViewInitial ? "20px" : "60px",   // Adjusted for mobile
                xPercent: 0,        
                yPercent: 0,        
                ease: "power3.inOut"
            }, "+=1"); 
    }
    masterIntroTimeline.set(".headline", { autoAlpha: 1, xPercent: -50, left: "50%" })
                       .to(".headline", { xPercent: 0, left: "0%", duration: 1, ease: "power2.inOut" }, splitComName ? "-=0.3" : "+=0.1");

    document.querySelectorAll(".headline div").forEach((divElement, lineIndex) => {
        gsap.set(divElement, { autoAlpha: 1, overflow: 'hidden' });
        try {
            const lineSplit = new SplitText(divElement, { type: "chars", charsClass: "headline-char" });
            splitHeadlineChars.push(lineSplit);
            masterIntroTimeline.fromTo(lineSplit.chars, { xPercent: 100, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.04, ease: "circ.out" }, `<${lineIndex * 0.2}`);
        } catch (e) {
            // Error handling
        }
    });
    masterIntroTimeline.addLabel("headlineCharsDone", ">")
                       .to(".headline div em", { color: "#FFFF00", duration: 0.5, stagger: 0.1, ease: "power1.inOut" }, "headlineCharsDone-=0.8")
                       .call(() => {
                           if (comNameElement && !comNameElement.querySelector('a')) {
                               const logoLink = document.createElement('a');
                               logoLink.href = "./index.html";
                               logoLink.style.display = "inline-block";
                               logoLink.setAttribute('aria-label', 'Homepage');
                               while (comNameElement.firstChild) logoLink.appendChild(comNameElement.firstChild);
                               comNameElement.appendChild(logoLink);
                               comNameElement.style.display = "inline-block";
                               comNameElement.style.whiteSpace = "nowrap";
                           }
                       });

    if (splineCanvas && winhub) {
        masterIntroTimeline.to(splineCanvas, { autoAlpha: 1, duration: 1 }, "-=0.5")
            .call(() => winhub.visible = true, null, "<")
            .fromTo(winhub.scale, { x: responsiveScale(currentScaleConfig.hero * 0.5), y: responsiveScale(currentScaleConfig.hero * 0.5), z: responsiveScale(currentScaleConfig.hero * 0.5) },
                                 { x: responsiveScale(currentScaleConfig.hero), y: responsiveScale(currentScaleConfig.hero), z: responsiveScale(currentScaleConfig.hero), duration: 1.5, ease: "power3.out" }, "<+0.2")
            .fromTo(winhub.rotation, { x: degToRad(90), y: degToRad(-360), z: degToRad(5) },
                                   { x: degToRad(0), y: degToRad(90), z: degToRad(0), duration: 1.5, ease: "power3.out" }, "<")
            .fromTo(winhub.position, { x: 0, y: WINHUB_INTRO_END_Y, z: WINHUB_INTRO_END_Z },
                                   { x: getTargetWinhubX(), y: WINHUB_INTRO_END_Y, z: WINHUB_INTRO_END_Z, duration: 1.5, ease: "power3.out" }, "<");
    }
}

function onMasterIntroComplete() {
    document.body.style.overflow = 'auto';

    if (typeof window.THREE !== 'undefined') {
        mainPageBackgroundSphere = new InteractiveBackgroundSphere('threejs-background-container', {
            sphereOffsetX: .1,
            sphereOffsetY: 0,
        });
        if (mainPageBackgroundSphere.valid && mainPageBackgroundSphere.init) {
            mainPageBackgroundSphere.init().introAnimate(
                { from: 1.5, to: 1, duration: 2.0, ease: "power2.out", delay: 0.1 },
                { fromY: Math.PI, toY: 0, duration: 2.5, ease: "power2.out", delay: 0.1 }
            );
        }
    }

    if (!initialSetupDone) {
        setupResponsiveScrollTriggers();
        initialSetupDone = true;
    } else {
        ScrollTrigger.refresh();
    }

    gsap.to([".menu-icon", ".scroll-icon"], { duration: 0.8, autoAlpha: 1, ease: "power2.out", delay: 0.3, stagger: 0.2 });
    window.scrollTo(0, 0);
}

function setupAllScrollTriggers(isDesktopView) {
    console.log(`%c[matchMedia] Setting up ScrollTriggers for ${isDesktopView ? 'Desktop' : 'Mobile'} view.`, "color: orange; font-weight: bold;");

    const elementsToClear = [".com-name-ani", "#part2 .part2-info", "#part2 .works-list", "#part2 .works-list-container"];
    elementsToClear.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) gsap.set(el, { clearProps: "all" });
    });
    gsap.set(document.body, { clearProps: "backgroundColor" });

    const comNameElement = document.querySelector(".com-name-ani");
    if (comNameElement) {
        comNameElement.classList.remove('scrolled');
        gsap.set(comNameElement, {
            autoAlpha: 1,
            position: "absolute", 
            top: isDesktopView ? "-150px" : "-75px", // Adjusted for mobile view
            left: isDesktopView ? "60px" : "20px",   // Adjusted for mobile view
            transform: "translate(0,0)", 
            zIndex: "" 
        });
    }

    setupMainPageBackgroundChangeAnimations();
    if (mainSplineApp && winhub && cable) {
        setupSplineScrollAnimations(winhub, cable, isDesktopView);
    } else {
        console.warn("[matchMedia] Spline objects (winhub, cable) not ready for setupSplineScrollAnimations.");
    }
    setupBarAnimations();
    setupAdvantageCardAnimations();
    setupOutroContentAnimation();
    setupComNameScrollAnimation();
    setupSubTitleAnimation();
    setupWorksHorizontalScroll();
    setupScrollToTopButton(); 

    document.body.offsetHeight;
    const pinElForReflow = document.querySelector("#part2 .part2-info");
    if (pinElForReflow) void pinElForReflow.offsetHeight;
    const listElForReflow = document.querySelector("#part2 .works-list");
    if (listElForReflow) void listElForReflow.offsetWidth;

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    ScrollTrigger.update();

    console.log(`%c[matchMedia] ScrollTriggers refreshed and updated for ${isDesktopView ? 'Desktop' : 'Mobile'} view.`, "color: orange;");

    const worksScrollTrigger = ScrollTrigger.getById('worksHorizontalScrollTrigger');
    const pinEl = document.querySelector("#part2 .part2-info");
    const listEl = document.querySelector("#part2 .works-list");
    if (worksScrollTrigger && pinEl && listEl) {
        const pinSpacer = worksScrollTrigger.spacer;
        console.log(`%c[matchMedia LOG] After ST setup (${isDesktopView ? 'Desktop' : 'Mobile'}):
worksHorizontalScrollTrigger.start: ${worksScrollTrigger.start}
worksHorizontalScrollTrigger.end: ${worksScrollTrigger.end}
pinTargetElement.offsetHeight: ${pinEl.offsetHeight}
pinSpacer.offsetHeight: ${pinSpacer ? pinSpacer.offsetHeight : 'N/A'}`,
"color: purple; font-weight: bold;");
    }
}

function setupResponsiveScrollTriggers() {
    ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() { // Desktop
            console.log("[matchMedia] Desktop setup executing.");
            killAllScrollTriggers(); 
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            splitSubTitles.forEach(st => st?.revert()); splitSubTitles = [];
            if(splitComName) { splitComName.revert(); splitComName = null; }
            splitHeadlineChars.forEach(st => st?.revert()); splitHeadlineChars = [];

            setupAllScrollTriggers(true); // Pass true for isDesktopView
            return function() { 
                console.log("[matchMedia] Desktop cleanup executing.");
                killAllScrollTriggers();
                splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
                splitSubTitles.forEach(st => st?.revert()); splitSubTitles = [];
                if(splitComName) { splitComName.revert(); splitComName = null; }
                splitHeadlineChars.forEach(st => st?.revert()); splitHeadlineChars = [];
            };
        },
        "(max-width: 767px)": function() { // Mobile
            console.log("[matchMedia] Mobile setup executing.");
            killAllScrollTriggers();
            splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
            splitSubTitles.forEach(st => st?.revert()); splitSubTitles = [];
            if(splitComName) { splitComName.revert(); splitComName = null; }
            splitHeadlineChars.forEach(st => st?.revert()); splitHeadlineChars = [];

            setupAllScrollTriggers(false); // Pass false for isDesktopView
            return function() { 
                console.log("[matchMedia] Mobile cleanup executing.");
                killAllScrollTriggers();
                splineTimelines.forEach(tl => tl.kill()); splineTimelines = [];
                splitSubTitles.forEach(st => st?.revert()); splitSubTitles = [];
                if(splitComName) { splitComName.revert(); splitComName = null; }
                splitHeadlineChars.forEach(st => st?.revert()); splitHeadlineChars = [];
            };
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupScrollRestoration();
    setupMenu("menu-toggle", "menu-overlay", "menu-close", ".menu-links .top-link a");
    setupMenuLinkEffects();

    runMainPageSequence().catch(error => {
        console.error("Error in runMainPageSequence:", error);
        hideLoader().finally(() => {
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);
            if (!initialSetupDone) {
                setupResponsiveScrollTriggers();
                initialSetupDone = true;
            }
        });
    });
});
