// -----------------------------------------
// common-utils.js
// Description: Shared utility functions and classes for the website.
// -----------------------------------------

// --- Spline Runtime Import ---
import { Application as SplineApplication } from 'https://unpkg.com/@splinetool/runtime/build/runtime.js';

// --- GSAP and Plugins ---
// GSAP core library (gsap object) is expected to be pre-loaded via <script> tag in HTML.
// Example: <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "https://esm.sh/gsap/ScrambleTextPlugin";

if (typeof gsap === 'undefined') {
    console.error("COMMON-UTILS: GSAP core library is not loaded. Please include it in your HTML. Effects will not work.");
} else {
    // Register GSAP plugins imported as ES modules
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
    console.log("COMMON-UTILS: GSAP ScrollTrigger and ScrambleTextPlugin registered via ES module import.");
}


// --- Scroll Restoration ---
export function setupScrollRestoration() {
    // 페이지 로드 시 즉시 최상단으로 스크롤 (수정된 부분)
    window.scrollTo(0, 0);
    console.log("COMMON-UTILS: Attempted to scroll to top on initial load.");

    // 브라우저의 기본 스크롤 복원 기능 비활성화
    history.scrollRestoration = "manual";

    // 페이지 언로드 직전에 최상단으로 스크롤
    window.addEventListener("beforeunload", () => {
        window.scrollTo(0, 0);
        console.log("COMMON-UTILS: Attempted to scroll to top on beforeunload.");
    });
}

// --- Utility Functions ---
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

export function responsiveScale(percentage, currentBaselineWidth = 1920) {
    return (percentage / 100) * (window.innerWidth / currentBaselineWidth);
}

export function responsiveX(percent) {
    const baselineWidth = 1920;
    return (percent / 100) * window.innerWidth;
}

export function responsiveY(percent) {
    const baselineHeight = 1080;
    return (percent / 100) * window.innerHeight;
}

// --- Loader Logic ---
let loaderElementGlobal = null;

export function startLoaderBarAnimation(config = {}) {
    const { barDuration = 1.5 } = config;

    return new Promise((resolve) => {
        loaderElementGlobal = document.getElementById("loader");
        const loaderBar = loaderElementGlobal ? loaderElementGlobal.querySelector(".loader-bar") : null;

        if (!loaderElementGlobal || !loaderBar) {
            console.warn("COMMON-UTILS: Loader element (#loader) or .loader-bar not found. Skipping loader bar animation.");
            resolve();
            return;
        }
        if (typeof gsap === 'undefined') {
            console.error("COMMON-UTILS: GSAP not loaded, cannot run loader bar animation.");
            if (loaderElementGlobal) loaderElementGlobal.style.display = 'none';
            resolve();
            return;
        }

        loaderElementGlobal.style.opacity = '1';
        loaderElementGlobal.style.display = 'block';
        loaderBar.style.width = '0%';

        gsap.to(loaderBar, {
            duration: barDuration,
            width: "100%",
            ease: "power1.inOut",
            onComplete: () => {
                console.log("COMMON-UTILS: Loader bar animation complete.");
                resolve();
            }
        });
    });
}

export function hideLoader(config = {}) {
    const { fadeDuration = 0.5, onCompleteUser } = config;

    return new Promise((resolve) => {
        if (!loaderElementGlobal) {
            // Try to find it again if startLoaderBarAnimation wasn't called or failed
            loaderElementGlobal = document.getElementById("loader");
            if (!loaderElementGlobal) {
                console.warn("COMMON-UTILS: Loader element not found for hiding.");
                if (onCompleteUser) onCompleteUser();
                resolve();
                return;
            }
        }
        if (typeof gsap === 'undefined') {
            console.error("COMMON-UTILS: GSAP not loaded, cannot hide loader with animation.");
            if (loaderElementGlobal) loaderElementGlobal.style.display = 'none';
            if (onCompleteUser) onCompleteUser();
            resolve();
            return;
        }

        // Check if already hidden or being hidden
        if (loaderElementGlobal.style.opacity === '0' || gsap.isTweening(loaderElementGlobal)) {
            if (loaderElementGlobal.style.opacity === '0' && loaderElementGlobal.style.display !== 'none') {
                 loaderElementGlobal.style.display = 'none'; // Ensure it's hidden if opacity is 0
            }
            // If a callback was provided and it's not already running due to a tween, call it.
            // This part might need more robust logic if multiple hideLoader calls are expected.
            if (onCompleteUser && !gsap.isTweening(loaderElementGlobal)) onCompleteUser();
            resolve();
            return;
        }

        gsap.to(loaderElementGlobal, {
            duration: fadeDuration,
            opacity: 0, // autoAlpha could also be used here if visibility needs management
            ease: "power2.out",
            onComplete: () => {
                if (loaderElementGlobal) loaderElementGlobal.style.display = 'none';
                console.log("COMMON-UTILS: Loader hidden.");
                if (onCompleteUser) onCompleteUser();
                resolve();
            }
        });
    });
}

// --- Interactive Three.js Background Sphere ---
// This class expects THREE to be available on the window object.
// main-app.js or sub-app.js should handle importing THREE and setting window.THREE.
export class InteractiveBackgroundSphere {
    constructor(containerSelector, config = {}) {
        this.container = document.getElementById(containerSelector);
        if (!this.container) {
            console.error(`COMMON-UTILS: Three.js container '${containerSelector}' not found.`);
            this.valid = false;
            return;
        }

        if (typeof window.THREE === 'undefined') {
            console.error('COMMON-UTILS: THREE.js is not loaded (window.THREE). Please ensure it is imported and set globally by the main/sub app script for InteractiveBackgroundSphere.');
            this.valid = false;
            return;
        }
        this.THREE = window.THREE; // Use the global THREE
        this.valid = true;

        this.config = {
            cameraZ: 2.95,
            sphereRadius: 2.5,
            sphereDetail: 6,
            wireframeColor: new this.THREE.Color(0xffffff),
            pointsColor: new this.THREE.Color(0xffffff),
            wireframeOpacity: 0.1, // 기본 라인 투명도
            pointsOpacity: 0.05,   // 기본 포인트 투명도
            pointsSize: 0.035,
            sphereOffsetX: 0,
            sphereOffsetY: 0,
            depthEffect: true,
            depthOpacityMinZ: 2.5,
            depthOpacityMaxZ: 4.0,
            minAlphaFactorForDepth: 0.25,
            mouseMoveSensitivity: 0.0025,
            mouseScaleSensitivity: 0.2,
            rotationSmoothness: 0.6,
            scaleSmoothness: 0.8,
            ...config
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphereGroup = null;
        this.wireframeMesh = null;
        this.pointsMesh = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.targetProps = { rotationX: 0, rotationY: 0, scale: 1 };

        this._onMouseMove = this._onMouseMove.bind(this);
        this._onResize = this._onResize.bind(this);
        this._animate = this._animate.bind(this);
    }

    init() {
        if (!this.valid || !this.container) {
             console.warn("COMMON-UTILS: Sphere init skipped, constructor failed or container missing.");
             return this;
        }

        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = this.config.cameraZ;

        this.renderer = new this.THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.sphereGroup = new this.THREE.Group();
        this.scene.add(this.sphereGroup);
        this.sphereGroup.position.set(this.config.sphereOffsetX, this.config.sphereOffsetY, 0);

        this._createSphereGeometry();

        document.addEventListener('mousemove', this._onMouseMove, false);
        window.addEventListener('resize', this._onResize, false);

        this._animate();
        return this;
    }

    _createSphereGeometry() {
        if (!this.valid) return;

        if (this.wireframeMesh) this.sphereGroup.remove(this.wireframeMesh);
        if (this.pointsMesh) this.sphereGroup.remove(this.pointsMesh);

        const geometry = new this.THREE.IcosahedronGeometry(this.config.sphereRadius, this.config.sphereDetail);
        const wireframeMaterial = new this.THREE.MeshBasicMaterial({
            color: this.config.wireframeColor.clone(),
            wireframe: true,
            transparent: true,
            opacity: this.config.wireframeOpacity // 설정된 투명도 사용
        });
        const pointsMaterial = new this.THREE.PointsMaterial({
            color: this.config.pointsColor.clone(),
            size: this.config.pointsSize,
            sizeAttenuation: true,
            transparent: true,
            opacity: this.config.pointsOpacity, // 설정된 투명도 사용
        });

        if (this.config.depthEffect) {
            const setupDepthShader = (shader) => {
                shader.uniforms.uMinDepth = { value: this.config.depthOpacityMinZ };
                shader.uniforms.uMaxDepth = { value: this.config.depthOpacityMaxZ };
                shader.uniforms.uMinAlphaFactor = { value: this.config.minAlphaFactorForDepth };

                shader.vertexShader = `
    varying float vViewZDepth_custom;
` + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace(
                    'void main() {',
                    `
    void main() {
        vec4 mvPosition_custom = modelViewMatrix * vec4(position, 1.0);
        vViewZDepth_custom = -mvPosition_custom.z;
    `
                );
                shader.fragmentShader = `
    varying float vViewZDepth_custom;
    uniform float uMinDepth;
    uniform float uMaxDepth;
    uniform float uMinAlphaFactor;
` + shader.fragmentShader;
                shader.fragmentShader = shader.fragmentShader.replace(
                    /}\s*$/,
                    `
        float depthFactor_custom = smoothstep(uMaxDepth, uMinDepth, vViewZDepth_custom);
        depthFactor_custom = max(depthFactor_custom, uMinAlphaFactor);
        gl_FragColor.a *= depthFactor_custom;
    }`
                );
            };
            wireframeMaterial.onBeforeCompile = setupDepthShader;
            pointsMaterial.onBeforeCompile = setupDepthShader;
        }

        this.wireframeMesh = new this.THREE.Mesh(geometry, wireframeMaterial);
        this.sphereGroup.add(this.wireframeMesh);
        this.pointsMesh = new this.THREE.Points(geometry, pointsMaterial);
        this.sphereGroup.add(this.pointsMesh);
        console.log("COMMON-UTILS: Sphere geometry created. Depth effect active:", this.config.depthEffect);
    }

    _onMouseMove(event) {
        if (!this.valid) return;
        this.mouse.x = (event.clientX - this.windowHalf.x);
        this.mouse.y = (event.clientY - this.windowHalf.y);
        this.targetProps.rotationY = (this.mouse.x * this.config.mouseMoveSensitivity);
        this.targetProps.rotationX = (this.mouse.y * this.config.mouseMoveSensitivity);
        const scaleRange = this.config.mouseScaleSensitivity;
        let dynamicScale = 1 - (this.mouse.y / this.windowHalf.y) * scaleRange * 0.5;
        this.targetProps.scale = Math.max(1 - scaleRange, Math.min(1 + scaleRange, dynamicScale));
    }

    _animate() {
        if (!this.valid || !this.renderer || !this.scene || !this.camera || !this.sphereGroup || typeof gsap === 'undefined') return;
        requestAnimationFrame(this._animate);
        gsap.to(this.sphereGroup.rotation, {
            duration: this.config.rotationSmoothness,
            x: this.targetProps.rotationX,
            y: this.targetProps.rotationY,
            ease: "power1.out"
        });
        gsap.to(this.sphereGroup.scale, {
            duration: this.config.scaleSmoothness,
            x: this.targetProps.scale,
            y: this.targetProps.scale,
            z: this.targetProps.scale,
            ease: "power2.out"
        });
        this.renderer.render(this.scene, this.camera);
    }

    _onResize() {
        if (!this.valid || !this.camera || !this.renderer) return;
        this.windowHalf.x = window.innerWidth / 2;
        this.windowHalf.y = window.innerHeight / 2;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    introAnimate(scaleParams = { from: 1.5, to: 1, duration: 2.0, ease: "power2.out", delay: 0 },
        rotationParams = { fromY: Math.PI, toY: 0, duration: 2.5, ease: "power2.out", delay: 0 }) {
        if (!this.valid || !this.sphereGroup || typeof gsap === 'undefined') return this;

        // Ensure THREE is available for this method too
        if (typeof this.THREE === 'undefined') {
            console.error("COMMON-UTILS: THREE is not available for introAnimate in Sphere.");
            return this;
        }

        this.sphereGroup.scale.set(scaleParams.from, scaleParams.from, scaleParams.from);
        this.sphereGroup.rotation.y = rotationParams.fromY;
        const tl = gsap.timeline({ delay: Math.max(scaleParams.delay, rotationParams.delay) });
        tl.to(this.sphereGroup.scale, {
            x: scaleParams.to, y: scaleParams.to, z: scaleParams.to,
            duration: scaleParams.duration, ease: scaleParams.ease
        }, 0)
          .to(this.sphereGroup.rotation, {
            y: rotationParams.toY,
            duration: rotationParams.duration, ease: rotationParams.ease
        }, 0);
        this.targetProps.scale = scaleParams.to;
        this.targetProps.rotationX = 0;
        this.targetProps.rotationY = rotationParams.toY;
        return this;
    }

    updateColors(newColors) {
        if (!this.valid || typeof gsap === 'undefined' || typeof this.THREE === 'undefined') return this;
        if (this.wireframeMesh && newColors.wireframeColor) {
            gsap.to(this.wireframeMesh.material.color, {
                r: newColors.wireframeColor.r, g: newColors.wireframeColor.g, b: newColors.wireframeColor.b,
                duration: 0.5
            });
        }
        if (this.pointsMesh && newColors.pointsColor) {
            gsap.to(this.pointsMesh.material.color, {
                r: newColors.pointsColor.r, g: newColors.pointsColor.g, b: newColors.pointsColor.b,
                duration: 0.5
            });
        }
        if (newColors.wireframeColor) this.config.wireframeColor = newColors.wireframeColor.clone();
        if (newColors.pointsColor) this.config.pointsColor = newColors.pointsColor.clone();
        return this;
    }

    /**
     * Sphere 객체의 포인트 및 라인 투명도를 업데이트합니다.
     * @param {object} opacities - 투명도 값 객체.
     * @param {number} [opacities.wireframeOpacity] - 라인의 새로운 투명도 (0.0 ~ 1.0).
     * @param {number} [opacities.pointsOpacity] - 포인트의 새로운 투명도 (0.0 ~ 1.0).
     * @param {number} [duration=0.5] - 투명도 변경 애니메이션 지속 시간(초).
     */
    updateOpacities(opacities = {}, duration = 0.5) {
        if (!this.valid || typeof gsap === 'undefined') {
            console.warn("COMMON-UTILS: Sphere not valid or GSAP not loaded for updateOpacities.");
            return this;
        }

        if (this.wireframeMesh && typeof opacities.wireframeOpacity === 'number') {
            const newWireframeOpacity = Math.max(0, Math.min(1, opacities.wireframeOpacity));
            this.config.wireframeOpacity = newWireframeOpacity; // 설정값도 업데이트
            gsap.to(this.wireframeMesh.material, {
                opacity: newWireframeOpacity,
                duration: duration,
                ease: "power1.out"
            });
            console.log(`COMMON-UTILS: Wireframe opacity updated to ${newWireframeOpacity}`);
        }

        if (this.pointsMesh && typeof opacities.pointsOpacity === 'number') {
            const newPointsOpacity = Math.max(0, Math.min(1, opacities.pointsOpacity));
            this.config.pointsOpacity = newPointsOpacity; // 설정값도 업데이트
            gsap.to(this.pointsMesh.material, {
                opacity: newPointsOpacity,
                duration: duration,
                ease: "power1.out"
            });
            console.log(`COMMON-UTILS: Points opacity updated to ${newPointsOpacity}`);
        }
        return this;
    }

    setVisibility(isVisible, duration = 0.5) {
        if (!this.valid || !this.container || typeof gsap === 'undefined') return;
        gsap.to(this.container, {
            autoAlpha: isVisible ? 1 : 0,
            duration: duration,
            ease: "power1.out"
        });
    }
}

// --- Menu Toggle ---
export function setupMenu(toggleId, overlayId, closeId, linksSelector) {
    const menuToggle = document.getElementById(toggleId);
    const menuOverlay = document.getElementById(overlayId);
    const menuClose = document.getElementById(closeId);
    const menuLinkContainers = document.querySelectorAll(linksSelector);

    if (!menuToggle || !menuOverlay || !menuClose || menuLinkContainers.length === 0) {
        console.warn("COMMON-UTILS: Menu elements for toggle not found (using selector: " + linksSelector + "). Menu animations will not be set up.");
        return;
    }
    if (typeof gsap === 'undefined') {
        console.error("COMMON-UTILS: GSAP is not loaded for setupMenu.");
        return;
    }

    // Set initial state for menu links for GSAP animation,
    // this ensures they are ready for the "from" state when the menu opens.
    gsap.set(menuLinkContainers, {
        opacity: 0,
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200)
    });

    menuToggle.addEventListener("click", () => {
        // Ensure .hidden is removed so display:none is not active, allowing autoAlpha to work
        if (menuOverlay.classList.contains("hidden")) {
            menuOverlay.classList.remove("hidden");
        }
        document.body.style.overflow = "hidden";
        if(menuToggle) menuToggle.style.display = "none"; // Hide hamburger icon

        // Animate overlay to visible using autoAlpha
        gsap.to(menuOverlay, {
            duration: 0.5,
            autoAlpha: 1, // Manages opacity and visibility
            ease: "power2.out",
            onComplete: () => console.log("COMMON-UTILS: Menu overlay opened.")
        });

        // Animate links in
        // The .set for menuLinkContainers above prepares them for this "to" animation
        gsap.to(menuLinkContainers, {
            duration: 0.8,
            opacity: 1,
            x: 0,
            y: 0,
            ease: "power3.out",
            stagger: { each: 0.1 }
        });
    });

    menuClose.addEventListener("click", () => {
        // Animate links out
        gsap.to(menuLinkContainers, {
            duration: 0.8, // Matched original duration
            opacity: 0,
            x: () => gsap.utils.random(-200, 200),
            y: () => gsap.utils.random(-200, 200),
            ease: "power3.in", // Matched original ease
            stagger: { each: 0.1, from: "end" } // Matched original stagger
        });

        // Animate overlay to hidden using autoAlpha
        gsap.to(menuOverlay, {
            duration: 0.5, // Matched original duration
            autoAlpha: 0, // Manages opacity and visibility
            ease: "power2.in", // Matched original ease
            delay: 0.2, // Keep existing delay
            onComplete: () => {
                // Add .hidden back to ensure display:none for accessibility and layout when closed
                menuOverlay.classList.add("hidden");
                if (menuToggle) menuToggle.style.display = "block"; // Ensure toggle is visible again
                document.body.style.overflow = "auto";
                console.log("COMMON-UTILS: Menu overlay closed.");
            }
        });
    });
}

// --- Menu Link Scramble and SVG Path Animation Effect ---
export function setupMenuLinkEffects() {
    console.log("COMMON-UTILS: setupMenuLinkEffects function CALLED.");
    const menuAnchorElements = document.querySelectorAll(".menu-links .top-link a");

    if (menuAnchorElements.length === 0) {
        console.warn("COMMON-UTILS: Menu anchor elements (.menu-links .top-link a) for effects not found.");
        return;
    }
    if (typeof gsap === 'undefined' || !gsap.plugins.scrambleText) { // Check for ScrambleTextPlugin on gsap.plugins
        console.error("COMMON-UTILS: GSAP core or ScrambleTextPlugin is not properly registered on gsap.plugins.");
        return;
    }

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const allSvgData = Array.from(menuAnchorElements).map(anchor => {
        const svgElement = anchor.querySelector(".menu-link-hover-svg");
        const svgPath = svgElement ? svgElement.querySelector(".arrow-path") : null;
        return { anchor, svgElement, svgPath, initialized: false, pathLength: 0 };
    });

    allSvgData.forEach((data, index) => {
        const { anchor, svgElement, svgPath } = data;
        const textSpanElement = anchor.querySelector(".menu-link-text");
        let originalText = textSpanElement ? textSpanElement.innerText.trim() : "";

        if (!textSpanElement && !svgPath) {
            console.warn(`COMMON-UTILS: [Link ${index}] No text span and no SVG path for effects.`);
            return;
        }

        const initializeCurrentSvgPath = () => {
            if (svgPath && !data.initialized) {
                try {
                    const length = svgPath.getTotalLength();
                     if (length === 0 && svgPath.getBBox && svgPath.getBBox().width > 0) {
                        console.warn(`COMMON-UTILS: [Link ${index}] SVG path length reported as 0, but element has dimensions. Animation might be affected.`);
                    }
                    gsap.set(svgPath, { strokeDasharray: length, strokeDashoffset: length });
                    data.pathLength = length;
                    data.initialized = true;
                    return true;
                } catch (e) {
                    console.error(`COMMON-UTILS: [Link ${index}] Error initializing SVG path:`, e);
                    return false;
                }
            }
            return data.initialized;
        };

        const animateCurrentSvgIn = () => {
            if (svgPath && data.initialized) {
                 if (isNaN(data.pathLength) || (data.pathLength === 0 && svgPath.getBBox && svgPath.getBBox().width > 0)) {
                    console.warn(`COMMON-UTILS: Invalid or zero path length for SVG IN on [Link ${index}]. Forcing visibility.`);
                    gsap.killTweensOf(svgElement); gsap.set(svgElement, { opacity: 1, x: 0 }); return;
                 }
                 if (isNaN(data.pathLength)) { console.error(`COMMON-UTILS: Truly invalid path length for SVG IN on [Link ${index}].`); return; }

                gsap.killTweensOf(svgElement); gsap.killTweensOf(svgPath);
                gsap.set(svgElement, { opacity: 0, x: -10 });
                gsap.to(svgElement, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" });
                gsap.fromTo(svgPath, { strokeDashoffset: data.pathLength }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
            } else if (svgPath && initializeCurrentSvgPath()) {
                animateCurrentSvgIn();
            }
        };

        const animateCurrentSvgOut = () => {
            if (svgPath && data.initialized) {
                if (isNaN(data.pathLength)) return;
                gsap.killTweensOf(svgElement); gsap.killTweensOf(svgPath);
                gsap.to(svgElement, { opacity: 0, x: -10, duration: 0.2, ease: "power1.in" });
                if (data.pathLength > 0) {
                    gsap.to(svgPath, { strokeDashoffset: data.pathLength, duration: 0.2, ease: "power1.in" });
                }
            } else if (svgElement) {
                gsap.set(svgElement, { opacity: 0, x: -10 });
            }
        };

        const hideOtherSVGs = (currentAnchor) => {
            allSvgData.forEach(otherData => {
                if (otherData.anchor !== currentAnchor) {
                    if (otherData.svgElement) gsap.set(otherData.svgElement, { opacity: 0, x: -10 });
                    if (otherData.svgPath && otherData.initialized && otherData.pathLength > 0) {
                        gsap.set(otherData.svgPath, { strokeDashoffset: otherData.pathLength });
                    }
                }
            });
        };

        anchor.addEventListener('pointerenter', () => {
            hideOtherSVGs(anchor);
            const svgReady = initializeCurrentSvgPath();
            if (textSpanElement && originalText && !gsap.isTweening(textSpanElement) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                gsap.to(textSpanElement, {
                    duration: 0.8, ease: 'sine.in',
                    scrambleText: { text: originalText, chars: scrambleChars, speed: 2, revealDelay: 0.1, tweenLength: true },
                    onComplete: () => { if (svgReady) animateCurrentSvgIn(); }
                });
            } else if (svgReady) {
                animateCurrentSvgIn();
            }
        });
        anchor.addEventListener('pointerleave', () => animateCurrentSvgOut());
        anchor.addEventListener('focus', () => anchor.dispatchEvent(new Event('pointerenter')));
        anchor.addEventListener('blur', () => anchor.dispatchEvent(new Event('pointerleave')));
    });
}

// --- Spline Application Loader ---
export async function loadSplineScene(canvasId, sceneUrl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`COMMON-UTILS: Spline canvas with ID '${canvasId}' not found.`);
        return null;
    }
    // SplineApplication is imported at the top of this file
    const app = new SplineApplication(canvas);
    try {
        await app.load(sceneUrl);
        console.log(`COMMON-UTILS: Spline scene loaded successfully from ${sceneUrl}`);
        return app;
    } catch (error) {
        console.error(`COMMON-UTILS: Failed to load Spline scene from ${sceneUrl}:`, error);
        return null;
    }
}

// --- General ScrollTrigger Management ---
export function killAllScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("COMMON-UTILS: GSAP or ScrollTrigger not available for killAllScrollTriggers.");
        return;
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    console.log("COMMON-UTILS: All ScrollTriggers killed.");
}

export function killScrollTriggersByPattern(idPattern) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("COMMON-UTILS: GSAP or ScrollTrigger not available for killScrollTriggersByPattern.");
        return;
    }
    let killedCount = 0;
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars.id && st.vars.id.startsWith(idPattern)) {
            st.kill();
            killedCount++;
        }
    });
    if (killedCount > 0) {
        console.log(`COMMON-UTILS: Killed ${killedCount} ScrollTriggers with ID pattern "${idPattern}".`);
    }
}
