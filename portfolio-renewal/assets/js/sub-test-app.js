import { ScrollToPlugin } from "https://esm.sh/gsap/ScrollToPlugin";
import { SplitText } from "https://esm.sh/gsap/SplitText";

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin, SplitText, ScrollTrigger);
} else console.error("SUB-TEST-APP: GSAP core not loaded, cannot register plugins.");

import {
    setupScrollRestoration,
    degToRad,
    responsiveY,
    runLoaderSequence,
    hideLoaderOnError,
    loadGLTFScene,
    killAllScrollTriggers,
    loadCommonUI,
    buildUrl,
    THREE
} from './common-test-utils.js';

// --- Subpage Specific Global Variables ---
let subpageSplineApp = null;
let subpageBodyElement = null;
let splitTitle = null;
let splitDescription = null;
let heroSection = null;
let splineIntroPlayed = false;
let gnbHeight = 0;
let isSnapping = false;
let isResizing = false;
let cachedWindowWidth = window.innerWidth;
let originalWinhubState = null;

const HERO_AREA_BACKGROUND_COLOR = "#090514";
const pageColorConfigs = {
    "default": { bodyBackgroundColorFallback: HERO_AREA_BACKGROUND_COLOR, textColor: "#ffffff" },
    "about.html": { bodyBackgroundColorFallback: "#090514", textColor: "#ffffff" },
    "works.html": { bodyBackgroundColorFallback: "#090514", textColor: "#ffffff" },
    "contact.html": { bodyBackgroundColorFallback: "#090514", textColor: "#ffffff" },
};
const scrolledPastHeroColors = { 
    darkContentTextColor: "#ffffff"
}; 

function getResponsiveSplineProperties() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        return {
            scaleMultiplier: 1.4,
            positionX: 400,
            positionYOffset: -150
        };
    }
    return {
        scaleMultiplier: 1.0,
        positionX: 300,
        positionYOffset: 0
    };
}

function getCurrentPageConfig() {
    const pathname = window.location.pathname.split('/').pop() || "default";
    return pageColorConfigs[pathname] || pageColorConfigs["default"];
}
const currentPageConfig = getCurrentPageConfig();


/**
 * Mission 섹션의 장식용 사각형 요소에 애니메이션과 패럴랙스 효과를 설정합니다.
 */
function setupDecorativeRectAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded for decorative animations.");
        return;
    }

    const section = document.querySelector("#sub-section-1");
    if (!section) return;

    const rect1 = section.querySelector(".rect-random");
    const rect2 = section.querySelector(".rect-random2");
    const parallaxBg = rect1 ? rect1.querySelector(".parallax-bg") : null;
    const parallaxBg2 = rect2 ? rect2.querySelector(".parallax-bg") : null;

    if (rect1) {
        gsap.set(rect1, { 
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', 
            autoAlpha: 1 
        });

        ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            id: 'rect1-anim',
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(rect1, { 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                duration: 1.2, 
                ease: 'expo.out' 
            }),
            onLeave: () => gsap.to(rect1, { 
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                duration: 0.8, 
                ease: 'power3.in' 
            }),
            onEnterBack: () => gsap.to(rect1, { 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                duration: 1.2, 
                ease: 'expo.out' 
            }),
            onLeaveBack: () => gsap.to(rect1, { 
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                duration: 0.8, 
                ease: 'power3.in' 
            })
        });

        if (parallaxBg) {
             gsap.fromTo(parallaxBg, {yPercent: -15}, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                    id: 'rect1-parallax',
                    invalidateOnRefresh: true
                }
            });
        }
        if (parallaxBg2) {
             gsap.fromTo(parallaxBg2, {yPercent: -15}, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                    id: 'rect1-parallax',
                    invalidateOnRefresh: true
                }
            });
        }
    }

    if (rect2) {
        gsap.set(rect2, { 
            clipPath: 'polygon(100% 100%, 100% 100%, 0% 100%, 0% 100%)',
            autoAlpha: 1 
        });

        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            id: 'rect2-anim',
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(rect2, { 
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%)',
                duration: 1.2, 
                ease: 'expo.out'
            }),
            onLeave: () => gsap.to(rect2, { 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                duration: 0.8, 
                ease: 'power3.in' 
            }),
            onEnterBack: () => gsap.to(rect2, { 
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%)',
                duration: 1.2, 
                ease: 'expo.out' 
            }),
            onLeaveBack: () => gsap.to(rect2, { 
                clipPath: 'polygon(100% 100%, 100% 100%, 0% 100%, 0% 100%)',
                duration: 0.8, 
                ease: 'power3.in' 
            })
        });
    }
}

/**
 * Lottie 애니메이션 플레이어를 제어하기 위해 ScrollTrigger를 설정합니다.
 * 'ready' 이벤트를 사용하여 플레이어가 준비된 후 스크립트를 실행합니다.
 * 플레이어가 뷰포트에 들어오면 재생하고, 벗어나면 정지시킵니다.
 */
function setupLottieScrollTrigger() {
    const lottiePlayer = document.querySelector("#overview-lottie");
    if (!lottiePlayer || typeof ScrollTrigger === 'undefined') {
        return;
    }

    // ScrollTrigger를 생성하되, 처음에는 비활성화 상태로 둡니다.
    const st = ScrollTrigger.create({
        trigger: lottiePlayer,
        start: "top 80%",
        end: "bottom 20%",
        id: 'lottie-overview-trigger',
        invalidateOnRefresh: true,
        onToggle: self => {
            if (self.isActive) {
                // 뷰포트 안에 있을 때: 애니메이션을 처음부터 재생합니다.
                lottiePlayer.seek(0);
                lottiePlayer.play();
            } else {
                // 뷰포트 밖에 있을 때: 애니메이션을 정지합니다.
                lottiePlayer.stop();
            }
        },
        enabled: false // 초기에 비활성화
    });

    // Lottie-player가 상호작용 가능할 때 발생하는 'ready' 이벤트를 기다립니다.
    lottiePlayer.addEventListener('ready', () => {
        // 'autoplay' 속성으로 인해 재생될 수 있으므로, 준비가 되면 즉시 정지시킵니다.
        lottiePlayer.stop();

        // Lottie 플레이어가 준비되면 ScrollTrigger를 활성화합니다.
        // 이제 ScrollTrigger는 정확한 위치 계산을 할 수 있습니다.
        if (st) {
            st.enable();
        }
    });
}


// --- Animation & Setup Functions (기존 함수들) ---
function initialPageVisualSetup(isResize = false) { 
    if (typeof gsap === 'undefined') return;
    subpageBodyElement = document.querySelector('.subpage-body'); if (!subpageBodyElement) return;
    heroSection = document.getElementById("sub-hero");
    const gnbContainer = document.querySelector('.gnb-container');
    if (gnbContainer) {
        gnbHeight = gnbContainer.offsetHeight;
    }

    gsap.set("#sub-hero", { autoAlpha: 1 });
    gsap.set(".sub-hero-content", { autoAlpha: 0 });
    gsap.set([".sub-hero-content .page-title", ".sub-hero-content .page-description"], { autoAlpha: 0, y: 0, xPercent: 0 });
    gsap.set(".scroll-icon", { autoAlpha: 0 });

    const nonHeroSections = gsap.utils.toArray(".subpage-section:not(#sub-hero)");
    nonHeroSections.forEach(section => {
        const wrapper = section.querySelector(".section-content-wrapper");
        if (wrapper) {
            const animatedContent = wrapper.querySelector(".animated-content");
            if (animatedContent) gsap.set(animatedContent, { opacity: 0, y: 50 });
            else gsap.set(wrapper, {opacity: 0, y: 50});
        } else {
            gsap.set(section, {opacity:0, y:50});
        }
    });

    const splineContainer = document.getElementById("threejs-object-container");
    if (splineContainer && !isResize) {
        gsap.set(splineContainer, { autoAlpha: 0 });
    }

    gsap.set(subpageBodyElement, { backgroundColor: currentPageConfig.bodyBackgroundColorFallback });
    subpageBodyElement.classList.remove('scrolled-past-hero-colors');

    const heroDependentElements = getHeroDependentElements();
    const heroTextElements = getHeroTextElements();
    const otherContentElements = getOtherContentTextElements();

    heroDependentElements.forEach(el => gsap.set(el, { color: currentPageConfig.textColor }));
    heroTextElements.forEach(el => gsap.set(el, { color: currentPageConfig.textColor }));
    otherContentElements.forEach(el => gsap.set(el, { color: currentPageConfig.textColor }));
 }
function getHeroDependentElements() {
    return [
        ...document.querySelectorAll(".com-name-logo.logo-class"),
        ...document.querySelectorAll(".menu-icon")
    ];
 }
function getHeroTextElements() {
    return heroSection ? [
        ...heroSection.querySelectorAll(".page-title.title-class"),
        ...heroSection.querySelectorAll(".page-description.content-class")
    ] : [];
 }
function getOtherContentTextElements() {
    let elements = [];
    document.querySelectorAll(".subpage-section:not(#sub-hero)").forEach(section => {
        const wrapper = section.querySelector(".section-content-wrapper");
        if (wrapper) {
            elements.push(...wrapper.querySelectorAll('h2, h3, p, .tab-button, span.content-class, a.content-class, div.content-class, .biz-domain-item-icon'));
        }
        elements.push(...section.querySelectorAll('.content-class, h2, h3, p, .biz-domain-item-icon'));
    });
    elements.push(...document.querySelectorAll("footer.subpage-footer .content-class, footer.subpage-footer span, footer.subpage-footer a"));

    const heroDependent = getHeroDependentElements();
    const heroTexts = getHeroTextElements();

    return elements.filter((el, index, self) =>
        self.indexOf(el) === index &&
        !heroDependent.includes(el) &&
        !heroTexts.includes(el) &&
        el.closest('#sub-hero') === null &&
        (el.textContent.trim() !== "" || el.children.length > 0 || ['IMG', 'SVG', 'I'].includes(el.tagName))
    );
 }
function switchColors(isScrolledPast) {
    const heroDependentElements = getHeroDependentElements();
    const otherContentTextElements = getOtherContentTextElements();

    const duration = 0.5;

    if (isScrolledPast) {
        subpageBodyElement.classList.add('scrolled-past-hero-colors');
    } else {
        subpageBodyElement.classList.remove('scrolled-past-hero-colors');
    }

    const logoMenuColorScrolledPast = scrolledPastHeroColors.darkContentTextColor;
    const logoMenuColorInHero = currentPageConfig.textColor; 
    heroDependentElements.forEach(el => gsap.to(el, { 
        color: isScrolledPast ? logoMenuColorScrolledPast : logoMenuColorInHero, 
        duration: duration, 
        overwrite: "auto" 
    }));

    const contentTargetTextColor = isScrolledPast ? scrolledPastHeroColors.darkContentTextColor : currentPageConfig.textColor;
    otherContentTextElements.forEach(el => gsap.to(el, { 
        color: contentTargetTextColor, 
        duration: duration, 
        overwrite: "auto" 
    }));
 }
function setupHeroColorSwitcher() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !subpageBodyElement || !heroSection) return;

    const existingTrigger = ScrollTrigger.getById("heroColorSwitcher");
    if (existingTrigger) existingTrigger.kill();
    
    ScrollTrigger.create({
        id: "heroColorSwitcher",
        trigger: heroSection,
        start: "bottom 80%",
        toggleActions: "play none none reverse",
        onEnter: () => switchColors(true),
        onLeaveBack: () => switchColors(false),
        invalidateOnRefresh: true,
    });
 }
function setupHeroParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !heroSection) return;

    const subHeroContent = heroSection.querySelector(".sub-hero-content");
    const splineObjectContainer = document.getElementById("threejs-object-container");
    const backgroundContainer = document.getElementById('fullscreen-threejs-bg');

    const existingParallaxTrigger = ScrollTrigger.getById("heroParallax");
    if (existingParallaxTrigger) existingParallaxTrigger.kill();

    const parallaxTl = gsap.timeline({
        scrollTrigger: {
            id: "heroParallax",
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true,
        }
    });

    if (subHeroContent) parallaxTl.to(subHeroContent, { yPercent: -80, ease: "none" }, 0);
    if (splineObjectContainer) parallaxTl.to(splineObjectContainer, { yPercent: -40, scale: 0.9, ease: "none" }, 0);
    if (backgroundContainer) parallaxTl.to(backgroundContainer, { yPercent: -20, ease: "none" }, 0);

    const existingVisibilityTrigger = ScrollTrigger.getById("heroVisibilityTrigger");
    if (existingVisibilityTrigger) existingVisibilityTrigger.kill();

    ScrollTrigger.create({
        id: "heroVisibilityTrigger",
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        invalidateOnRefresh: true,
        onLeave: () => gsap.to([subHeroContent, splineObjectContainer], { autoAlpha: 0, duration: 0.3 }),
        onEnterBack: () => {
            gsap.to(splineObjectContainer, { autoAlpha: 1, duration: 0.3 });
            gsap.to(subHeroContent, {
                autoAlpha: 1,
                duration: 0.1,
                onComplete: () => animateHeroText()
            });
        },
    });
 }

function setupSubPageContentAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const sections = gsap.utils.toArray(".subpage-section:not(#sub-hero)");

    sections.forEach((section) => {
        let animatedElement;
        const contentWrapper = section.querySelector(".section-content-wrapper");
        
        if (contentWrapper) {
            const specificAnimatedContent = contentWrapper.querySelector(".animated-content");
            animatedElement = specificAnimatedContent || contentWrapper;
        } else {
            animatedElement = section;
        }
        
        gsap.set(animatedElement, { opacity: 0, y: 50 });

        if (section.id === 'contact-section' || section.id === 'map-section') {
            ScrollTrigger.create({
                trigger: section,
                start: "top 85%",
                toggleActions: 'play none none none',
                invalidateOnRefresh: true,
                onEnter: () => gsap.to(animatedElement, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }),
            });
        } else {
            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                invalidateOnRefresh: true,
                onEnter: () => gsap.to(animatedElement, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" }),
                onLeave: () => gsap.to(animatedElement, { opacity: 0, y: -50, duration: 0.4, ease: "power1.in", overwrite: "auto" }),
                onEnterBack: () => gsap.to(animatedElement, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" }),
                onLeaveBack: () => gsap.to(animatedElement, { opacity: 0, y: 50, duration: 0.4, ease: "power1.in", overwrite: "auto" }),
            });
        }
    });
}


function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    if (tabButtons.length === 0 || tabContents.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            button.classList.add("active");
            const targetTab = button.getAttribute("data-tab");
            const targetContent = document.getElementById(targetTab);
            if (targetContent) targetContent.classList.add("active");
        });
    });

    if (!document.querySelector(".tab-button.active") && tabButtons.length > 0) {
        tabButtons[0].classList.add("active");
        const firstTabId = tabButtons[0].getAttribute("data-tab");
        const firstTabContent = document.getElementById(firstTabId);
        if (firstTabContent) firstTabContent.classList.add("active");
    }
 }
function animateHeroText() {
    const subHeroContent = document.querySelector(".sub-hero-content");
    if (!subHeroContent) return gsap.timeline();

    const pageTitle = subHeroContent.querySelector(".page-title");
    const pageDescription = subHeroContent.querySelector(".page-description");

    if (splitTitle && typeof splitTitle.revert === 'function') splitTitle.revert();
    if (splitDescription && typeof splitDescription.revert === 'function') splitDescription.revert();
    splitTitle = null;
    splitDescription = null;

    gsap.set([pageTitle, pageDescription], { autoAlpha: 0, y: 0, xPercent: 0, clearProps: "all" });
    if (gsap.getProperty(subHeroContent, "autoAlpha") === 0) {
        gsap.set(subHeroContent, {autoAlpha: 1});
    }

    const masterTextAnimationTl = gsap.timeline();

    if (pageTitle && pageTitle.offsetParent !== null) { 
        if (typeof SplitText !== 'undefined') {
            try {
                splitTitle = new SplitText(pageTitle, { type: "chars" }); 
                masterTextAnimationTl.fromTo(splitTitle.chars, 
                    { autoAlpha: 0, y: -200 },
                    { duration: .5, autoAlpha: 1, y: 0, ease: "back.out(1.7)", stagger: 0.1 }
                );
            } catch (e) { 
                masterTextAnimationTl.from(pageTitle, { duration: 0.7, autoAlpha: 0, y: -50, ease: "power2.out" });
            }
        } else { 
            masterTextAnimationTl.from(pageTitle, { duration: 0.7, autoAlpha: 0, y: -50, ease: "power2.out" });
        }
    }

    if (pageDescription && pageDescription.offsetParent !== null) { 
        if (typeof SplitText !== 'undefined') {
            try {
                splitDescription = new SplitText(pageDescription, { type: "lines" });
                masterTextAnimationTl.from(splitDescription.lines, {
                    duration: 0.6, autoAlpha: 0, y: 50, ease: "back.out(1.7)", stagger: 0.1
                }, ">");
            } catch (e) {
                masterTextAnimationTl.from(pageDescription, { duration: 0.7, autoAlpha: 0, y: 30, ease: "power2.out" }, ">");
            }
        } else {
            masterTextAnimationTl.from(pageDescription, { duration: 0.7, autoAlpha: 0, y: 30, ease: "power2.out" }, ">");
        }
    }
    return masterTextAnimationTl;
 }
function setupScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const heroSection = document.getElementById('sub-hero');
    if (!scrollToTopBtn || !heroSection) return;
    
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: heroSection,
            start: "bottom top",
            onEnter: () => scrollToTopBtn.classList.add('show'),
            onLeaveBack: () => scrollToTopBtn.classList.remove('show')
        });
    }
    scrollToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
 }
function setupSubPageScrollIconAnimation() {
    const scrollIcon = document.querySelector("#sub-hero .scroll-icon");
    if (!scrollIcon || typeof ScrollTrigger === 'undefined') return;

    gsap.to(scrollIcon, { autoAlpha: 1, duration: 0.5, delay: 1.5 });
    
    ScrollTrigger.create({
        id: 'subPageScrollIconVisibilityTrigger',
        start: 1,
        onEnter: () => gsap.to(scrollIcon, { autoAlpha: 0, duration: 0.2 }),
        onLeaveBack: () => gsap.to(scrollIcon, { autoAlpha: 1, duration: 0.2 }),
    });
 }
function setupHeroScrollSnap() {
    if (typeof ScrollToPlugin === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const heroSection = document.getElementById('sub-hero');
    const firstContentSection = document.querySelector('.subpage-section:not(#sub-hero)');
    if (!heroSection || !firstContentSection) return;
    
    ScrollTrigger.create({
        id: 'heroScrollSnapTrigger',
        trigger: heroSection,
        start: "top top-1",
        end: "bottom top",
        onEnter: self => {
            if (isSnapping || self.direction !== 1 || isResizing) return; 
            isSnapping = true;
            gsap.to(window, {
                scrollTo: { y: firstContentSection },
                duration: .35,
                ease: 'power2.inOut',
                onComplete: () => { gsap.delayedCall(0.1, () => { isSnapping = false; }); },
                overwrite: 'auto'
            });
        },
        onEnterBack: self => {
            if (isSnapping || self.direction !== -1 || isResizing) return;
            isSnapping = true;
            gsap.to(window, {
                scrollTo: { y: 0 },
                duration: .35,
                ease: 'power2.inOut',
                onComplete: () => { gsap.delayedCall(0.1, () => { isSnapping = false; }); },
                overwrite: 'auto'
            });
        },
        invalidateOnRefresh: true
    });
 }

// --- Main Initialization ---
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

        dotX += (targetX - dotX) * 0.4;
        dotY += (targetY - dotY) * 0.4;

        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;

        currentVelocity *= 0.92;

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

const subpageAtmospheres = {
    "about.html": {
        bg: "linear-gradient(135deg, #0d1e2e 0%, #081119 50%, #050a0e 100%)",
        spotColor: new THREE.Color(0x38bdf8), // Cyan neon spot
        position: { x: -1.8, y: 0.2, z: -4.5 },
        rotation: { x: degToRad(35), y: degToRad(145), z: degToRad(-15) },
        scale: 1.15
    },
    "works.html": {
        bg: "linear-gradient(135deg, #18092e 0%, #0c0419 50%, #06020c 100%)",
        spotColor: new THREE.Color(0xc084fc), // Deep purple neon spot
        position: { x: 1.8, y: -0.3, z: -4.2 },
        rotation: { x: degToRad(-40), y: degToRad(-60), z: degToRad(25) },
        scale: 1.25
    },
    "contact.html": {
        bg: "linear-gradient(135deg, #2a0822 0%, #150311 50%, #0a0108 100%)",
        spotColor: new THREE.Color(0xf43f5e), // Pink/red neon spot
        position: { x: 0.0, y: -0.6, z: -3.8 },
        rotation: { x: degToRad(65), y: degToRad(15), z: degToRad(-45) },
        scale: 1.35
    },
    "default": {
        bg: "linear-gradient(135deg, #090514 0%, #04020a 100%)",
        spotColor: new THREE.Color(0xa855f7),
        position: { x: 0.0, y: 0.0, z: -5.0 },
        rotation: { x: degToRad(25), y: degToRad(-35), z: degToRad(15) },
        scale: 1.0
    }
};

function getSubpageAtmosphere() {
    const pageName = window.location.pathname.split('/').pop() || "default";
    return subpageAtmospheres[pageName] || subpageAtmospheres["default"];
}

async function initializeSubpage() {
    initialPageVisualSetup();
    setupCustomCyberCursor();

    const atmosphere = getSubpageAtmosphere();
    gsap.set(document.body, { background: atmosphere.bg });

    const loaderPromise = runLoaderSequence('.subpage-container');

    const gltfPath = buildUrl('/assets/models/capsule_creo_d/scene-draco.gltf');
    const gltfLoadPromise = loadGLTFScene("canvas3d", gltfPath)
        .then(app => {
            subpageSplineApp = app;
            if (subpageSplineApp) {
                const capsuleObj = subpageSplineApp.findObjectByName("Winhub");
                if (capsuleObj) {
                    capsuleObj.visible = true;
                    // Apply unique 3D position, rotation and scale per subpage
                    gsap.set(capsuleObj.position, atmosphere.position);
                    gsap.set(capsuleObj.rotation, atmosphere.rotation);
                    gsap.set(capsuleObj.scale, { x: atmosphere.scale, y: atmosphere.scale, z: atmosphere.scale });
                }
                if (subpageSplineApp.rightSpotUniforms && subpageSplineApp.rightSpotUniforms.uRightSpotColor) {
                    subpageSplineApp.rightSpotUniforms.uRightSpotColor.value.copy(atmosphere.spotColor);
                }
            }
        })
        .catch(error => {
            console.error("SUB-TEST-APP: Error loading 3D GLTF scene:", error);
        });

    await Promise.all([loaderPromise, gltfLoadPromise]);

    if (subpageSplineApp && typeof subpageSplineApp.startDrawingAnimation === 'function') {
        const canvas = document.getElementById("canvas3d");
        if (canvas) gsap.to(canvas, { opacity: 1, duration: 0.35, ease: "power2.out" });
        await subpageSplineApp.startDrawingAnimation();
    }

    const logoElement = document.querySelector(".com-name-logo.logo-class");
    const menuIconElement = document.querySelector(".menu-icon");
    if (logoElement && menuIconElement) {
        gsap.to([logoElement, menuIconElement], { 
            duration: 0.8, 
            autoAlpha: 1,
            ease: "power2.out", 
            delay: 0.2 
        });
    }

    const subHeroContent = document.querySelector(".sub-hero-content");
    if (subHeroContent) {
        gsap.to(subHeroContent, { autoAlpha: 1, duration: 0.1, onComplete: () => {
            animateHeroText();
        }});
    }

    setupSubPageContentAnimations();
    setupDecorativeRectAnimations();
    setupLottieScrollTrigger(); // Lottie 애니메이션 설정 함수 호출
    setupHeroParallax(); 
    setupHeroColorSwitcher();
    setupHeroScrollSnap();
    setupTabs();
    setupScrollToTopButton();
    setupSubPageScrollIconAnimation();

    window.scrollTo(0, 0);
    ScrollTrigger.refresh(true);
    if(subpageBodyElement) subpageBodyElement.style.overflow = 'auto';
}

function handleSubPageResize() {
    if (window.innerWidth !== cachedWindowWidth) {
        isResizing = true; 
        cachedWindowWidth = window.innerWidth;
        window.scrollTo({top: 0, behavior: "auto"});
        killAllScrollTriggers(); 

        if (splitTitle) splitTitle.revert();
        if (splitDescription) splitDescription.revert();
        gsap.set([".sub-hero-content .page-title", ".sub-hero-content .page-description"], { clearProps: "all" });

        const winhubObject = subpageSplineApp ? subpageSplineApp.findObjectByName("Winhub") : null;
        if (winhubObject && originalWinhubState) {
            const responsiveProps = getResponsiveSplineProperties();
            const targetScale = { x: originalWinhubState.scale.x * responsiveProps.scaleMultiplier, y: originalWinhubState.scale.y * responsiveProps.scaleMultiplier, z: originalWinhubState.scale.z * responsiveProps.scaleMultiplier };
            const targetPosition = { x: responsiveProps.positionX, y: originalWinhubState.position.y + responsiveProps.positionYOffset, z: originalWinhubState.position.z };
            gsap.to(winhubObject.scale, { ...targetScale, duration: 0.5, ease: "power2.out", overwrite: true });
            gsap.to(winhubObject.position, { ...targetPosition, duration: 0.5, ease: "power2.out", overwrite: true });
        }
        
        initialPageVisualSetup(true); 
        
        setupSubPageContentAnimations();
        setupTabs();
        setupDecorativeRectAnimations();
        setupLottieScrollTrigger(); // 리사이즈 시 Lottie 트리거도 재설정
        setupHeroParallax(); 
        setupHeroColorSwitcher();
        setupHeroScrollSnap(); 
        setupSubPageScrollIconAnimation();
        setupScrollToTopButton();

        gsap.delayedCall(0.5, () => {
            ScrollTrigger.refresh(true);
            isResizing = false; 
            const subHeroContentOnResize = document.querySelector(".sub-hero-content");
            if (subHeroContentOnResize) {
                gsap.set(subHeroContentOnResize, { autoAlpha: 1 });
                animateHeroText();
            }
            if (winhubObject) {
                gsap.set(winhubObject.rotation, {x: degToRad(0), y: degToRad(90), z: degToRad(0)});
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    setupScrollRestoration();
    splineIntroPlayed = false;
    originalWinhubState = null;
    cachedWindowWidth = window.innerWidth;

    try {
        await loadCommonUI();
        await initializeSubpage();
    } catch (error) {
        console.error("SUB-APP: Initialization failed:", error);
        hideLoaderOnError();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleSubPageResize, 250);
    });
});

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh(true);
        }
    }, 150);

});
