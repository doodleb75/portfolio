// assets/js/common-test-utils.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/DRACOLoader.js';
export { THREE, GLTFLoader, DRACOLoader };

import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "https://esm.sh/gsap/ScrambleTextPlugin";

if (typeof gsap === 'undefined') {
    console.error("COMMON-TEST-UTILS: GSAP core library is not loaded.");
} else {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
}

export function setupScrollRestoration() {
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";
    window.addEventListener("beforeunload", () => {
        window.scrollTo(0, 0);
    });
}
export function buildUrl(path) {
    if (typeof path !== 'string') return '';
    return path.startsWith('/') ? path.substring(1) : path;
}
export function degToRad(degrees) { return degrees * (Math.PI / 180); }
export function responsiveScale(percentage, currentBaselineWidth = 1920) { 
    const calculationWidth = window.innerWidth >= 768 ? Math.max(window.innerWidth, 1100) : window.innerWidth;
    return (percentage / 100) * (calculationWidth / currentBaselineWidth); 
}
export function responsiveX(percent) { return (percent / 100) * window.innerWidth; }
export function responsiveY(percent) { return (percent / 100) * window.innerHeight; }

function safeSessionGet(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function safeSessionSet(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (e) {}
}

export function runLoaderSequence() {
    return new Promise((resolve) => {
        const loaderContainer = document.getElementById("loader");
        const loaderBar = document.querySelector(".loader-bar");
        const percentEl = document.querySelector(".loader-percentage");
        const centerContent = document.querySelector(".loader-center-content");

        if (!loaderContainer || !loaderBar) {
            resolve();
            return;
        }

        gsap.set(loaderBar, { width: "0%" });
        gsap.set(loaderContainer, { display: "flex", opacity: 1 });
        if (centerContent) gsap.set(centerContent, { opacity: 1, scale: 1 });
        if (percentEl) percentEl.textContent = "0";

        const counter = { val: 0 };

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(loaderContainer, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loaderContainer.style.display = "none";
                        resolve();
                    }
                });
            }
        });

        tl.to(loaderBar, {
            width: "100%",
            duration: 1.2,
            ease: "power2.inOut"
        }, 0);

        if (percentEl) {
            tl.to(counter, {
                val: 100,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => {
                    percentEl.textContent = Math.floor(counter.val);
                }
            }, 0);
        }
    });
}

export function hideLoaderOnError() {
    const loaderContainer = document.getElementById("loader");
    if (loaderContainer) {
        gsap.to(loaderContainer, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => loaderContainer.style.display = "none"
        });
    }
}

async function loadHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            return element;
        }
        return null;
    } catch (error) {
        console.error(`Error loading HTML from ${filePath}:`, error);
        return null;
    }
}

export async function loadCommonUI() {
    const baseCommonPath = 'assets/common/'; 
    try {
        await Promise.all([
            loadHTML('header-placeholder', `${baseCommonPath}_header.html`),
            loadHTML('menu-overlay-placeholder', `${baseCommonPath}_menu_overlay_test.html`),
            loadHTML('footer-placeholder', `${baseCommonPath}_footer.html`),
            loadHTML('loader-placeholder', `${baseCommonPath}_loader.html`)
        ]);

        if (typeof setupMenu === 'function') {
            setupMenu("menu-toggle", "menu-overlay", "menu-close", ".menu-links .top-link a");
        }
        if (typeof setupMenuLinkEffects === 'function') {
            setupMenuLinkEffects();
        }
        activateCurrentNavLink();
    } catch (error) {
        console.error("Error loading common UI components:", error);
    }
}

function activateCurrentNavLink() {
    const menuOverlayElement = document.getElementById('menu-overlay');
    if (!menuOverlayElement) return;
    const navLinks = menuOverlayElement.querySelectorAll('.menu-links .top-link a');
    if (navLinks.length === 0) return;
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && (currentPath.endsWith(linkHref) || (linkHref.endsWith('index.html') && (currentPath.endsWith('/') || currentPath.endsWith('portfolio-renewal/'))))) {
            link.classList.add('active-nav-link');
        } else {
            link.classList.remove('active-nav-link');
        }
    });
}

export function setupMenu(toggleId, overlayId, closeId, linksSelector) {
    const menuToggle = document.getElementById(toggleId);
    const menuOverlay = document.getElementById(overlayId);
    const menuClose = document.getElementById(closeId);
    if (!menuToggle || !menuOverlay || !menuClose) return;

    const menuLinkElements = menuOverlay.querySelectorAll(linksSelector);
    const menuInfo = menuOverlay.querySelector('.menu-info');
    const numPanels = 6;
    let panelWrapper = menuOverlay.querySelector('.menu-blind-panels-wrapper');
    if (!panelWrapper) {
        panelWrapper = document.createElement('div');
        panelWrapper.className = 'menu-blind-panels-wrapper';
        for (let i = 0; i < numPanels; i++) {
            const panel = document.createElement('div');
            panel.className = 'menu-blind-panel';
            panelWrapper.appendChild(panel);
        }
        menuOverlay.insertBefore(panelWrapper, menuOverlay.firstChild);
    }
    const blindPanels = Array.from(panelWrapper.children);
    const initialY = 30;
    gsap.set(blindPanels, { yPercent: -100 });
    gsap.set(menuLinkElements, { opacity: 0, y: initialY });
    if (menuInfo) gsap.set(menuInfo, { opacity: 0, y: initialY });

    const openMenu = () => {
        if (menuOverlay.classList.contains("hidden")) {
            menuOverlay.classList.remove("hidden");
        }
        document.body.style.overflow = "hidden";
        gsap.set(menuOverlay, { autoAlpha: 1 }); 
        const openTl = gsap.timeline();
        openTl.to(blindPanels, { duration: 0.4, yPercent: 0, ease: "power2.out", stagger: 0.07 })
              .to(menuLinkElements, { duration: 0.7, opacity: 1, y: 0, ease: "power3.out", stagger: { each: 0.1 } }, "-=0.2");
        if (menuInfo) openTl.to(menuInfo, { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" }, "-=0.5");
    };

    const closeMenu = () => {
        const closeTl = gsap.timeline({
            onComplete: () => {
                gsap.set(menuOverlay, { autoAlpha: 0 }); 
                menuOverlay.classList.add("hidden");
                document.body.style.overflow = "auto";
                gsap.set(menuLinkElements, { opacity: 0, y: initialY });
                if(menuInfo) gsap.set(menuInfo, { opacity: 0, y: initialY });
            }
        });
        closeTl.to([menuLinkElements, menuInfo], { duration: 0.4, opacity: 0, y: initialY, ease: "power3.in", stagger: { each: 0.07, from: "end" } });
        closeTl.to(blindPanels, { duration: 0.5, yPercent: -100, ease: "power2.in", stagger: { each: 0.05, from: "end" } }, "-=0.2");
    };

    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);
}

export function setupMenuLinkEffects() {
    const menuOverlayElement = document.getElementById('menu-overlay');
    if (!menuOverlayElement) return;
    const menuAnchorElements = menuOverlayElement.querySelectorAll(".menu-links .top-link a");
    if (menuAnchorElements.length === 0 || typeof gsap === 'undefined' || !gsap.plugins.scrambleText) return;

    menuAnchorElements.forEach((anchor) => {
        const textSpanElement = anchor.querySelector(".menu-link-text");
        if (!textSpanElement) return;
        const originalText = textSpanElement.innerText.trim();

        anchor.addEventListener('pointerenter', () => {
            gsap.to(textSpanElement, {
                duration: 0.8,
                ease: 'sine.in',
                scrambleText: { text: originalText, speed: 2, revealDelay: 0.1 }
            });
        });
        anchor.addEventListener('pointerleave', () => {
            gsap.killTweensOf(textSpanElement);
            textSpanElement.innerText = originalText;
        });
    });
}

// Background Sphere Class
export class InteractiveBackgroundSphere {
    constructor(containerSelector, config = {}) {
        this.container = document.getElementById(containerSelector);
        if (!this.container) {
            this.valid = false;
            return;
        }
        this.THREE = THREE;
        this.valid = true;
        this.config = {
            cameraZ: 2.95,
            sphereRadius: 2.5,
            sphereDetail: 6,
            wireframeColor: new this.THREE.Color(0xffffff),
            pointsColor: new this.THREE.Color(0xffffff),
            wireframeOpacity: 0.08,
            pointsOpacity: 0.04,
            pointsSize: 0.035,
            sphereOffsetX: 0,
            sphereOffsetY: 0,
            depthEffect: true,
            mouseMoveSensitivity: 0.0025,
            mouseScaleSensitivity: 0.2,
            rotationSmoothness: 0.6,
            scaleSmoothness: 0.8,
            ...config
        };
        this.scene = null; this.camera = null; this.renderer = null;
        this.sphereGroup = null; this.wireframeMesh = null; this.pointsMesh = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.targetProps = { rotationX: 0, rotationY: 0, scale: 1 };
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onResize = this._onResize.bind(this);
        this._animate = this._animate.bind(this);
    }
    init() {
        if (!this.valid || !this.container) return this;
        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = this.config.cameraZ;
        this.renderer = new this.THREE.WebGLRenderer({ antialias: true, alpha: true });
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
        const geometry = new this.THREE.IcosahedronGeometry(this.config.sphereRadius, this.config.sphereDetail);
        const wireframeMaterial = new this.THREE.MeshBasicMaterial({
            color: this.config.wireframeColor.clone(), wireframe: true, transparent: true, opacity: this.config.wireframeOpacity
        });
        const pointsMaterial = new this.THREE.PointsMaterial({
            color: this.config.pointsColor.clone(), size: this.config.pointsSize, sizeAttenuation: true, transparent: true, opacity: this.config.pointsOpacity,
        });
        this.wireframeMesh = new this.THREE.Mesh(geometry, wireframeMaterial); this.sphereGroup.add(this.wireframeMesh);
        this.pointsMesh = new this.THREE.Points(geometry, pointsMaterial); this.sphereGroup.add(this.pointsMesh);
    }
    _onMouseMove(event) {
        if (!this.valid) return;
        this.mouse.x = (event.clientX - this.windowHalf.x); this.mouse.y = (event.clientY - this.windowHalf.y);
        this.targetProps.rotationY = (this.mouse.x * this.config.mouseMoveSensitivity);
        this.targetProps.rotationX = (this.mouse.y * this.config.mouseMoveSensitivity);
        const scaleRange = this.config.mouseScaleSensitivity;
        let dynamicScale = 1 - (this.mouse.y / this.windowHalf.y) * scaleRange * 0.5;
        this.targetProps.scale = Math.max(1 - scaleRange, Math.min(1 + scaleRange, dynamicScale));
    }
    _animate() {
        if (!this.valid || !this.renderer || !this.scene || !this.camera || !this.sphereGroup || typeof gsap === 'undefined') return;
        requestAnimationFrame(this._animate);
        gsap.to(this.sphereGroup.rotation, { duration: this.config.rotationSmoothness, x: this.targetProps.rotationX, y: this.targetProps.rotationY, ease: "power1.out" });
        gsap.to(this.sphereGroup.scale, { duration: this.config.scaleSmoothness, x: this.targetProps.scale, y: this.targetProps.scale, z: this.targetProps.scale, ease: "power2.out" });
        this.renderer.render(this.scene, this.camera);
    }
    _onResize() {
        if (!this.valid || !this.camera || !this.renderer) return;
        this.windowHalf.x = window.innerWidth / 2; this.windowHalf.y = window.innerHeight / 2;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    introAnimate(scaleParams = { from: 1.15, to: 1, duration: 2.0, ease: "sine.out", delay: 0 }, rotationParams = { fromY: 0.15, toY: 0, duration: 2.2, ease: "sine.out", delay: 0 }) {
        if (!this.valid || !this.sphereGroup || typeof gsap === 'undefined' || typeof this.THREE === 'undefined') return this;
        this.sphereGroup.scale.set(scaleParams.from, scaleParams.from, scaleParams.from);
        this.sphereGroup.rotation.y = rotationParams.fromY;
        if (this.wireframeMesh) {
            gsap.fromTo(this.wireframeMesh.material, { opacity: 0 }, { opacity: this.config.wireframeOpacity, duration: 1.8, ease: "sine.inOut" });
        }
        if (this.pointsMesh) {
            gsap.fromTo(this.pointsMesh.material, { opacity: 0 }, { opacity: this.config.pointsOpacity, duration: 1.8, ease: "sine.inOut" });
        }
        const tl = gsap.timeline({ delay: Math.max(scaleParams.delay, rotationParams.delay) });
        tl.to(this.sphereGroup.scale, { x: scaleParams.to, y: scaleParams.to, z: scaleParams.to, duration: scaleParams.duration, ease: scaleParams.ease }, 0)
          .to(this.sphereGroup.rotation, { y: rotationParams.toY, duration: rotationParams.duration, ease: rotationParams.ease }, 0);
        this.targetProps.scale = scaleParams.to; this.targetProps.rotationX = 0; this.targetProps.rotationY = rotationParams.toY;
        return this;
    }
    updateColors(newColors) {
        if (!this.valid || typeof gsap === 'undefined' || typeof this.THREE === 'undefined') return this;
        if (this.wireframeMesh && newColors.wireframeColor) gsap.to(this.wireframeMesh.material.color, { r: newColors.wireframeColor.r, g: newColors.wireframeColor.g, b: newColors.wireframeColor.b, duration: 0.8 });
        if (this.pointsMesh && newColors.pointsColor) gsap.to(this.pointsMesh.material.color, { r: newColors.pointsColor.r, g: newColors.pointsColor.g, b: newColors.pointsColor.b, duration: 0.8 });
        return this;
    }
}

export function killAllScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

export async function loadSplineScene() { return null; }

// --- 3D CAPSULE CREO D BACKGROUND LOADER ---
export async function loadGLTFScene(canvasId, modelUrl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("❌ [3D TEST LOADER] Canvas element with ID not found:", canvasId);
        return null;
    }

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    console.log("🚀 [3D TEST LOADER] Requesting Capsule Creo D GLTF model from:", modelUrl);
    console.log(`📐 [3D TEST LOADER] Canvas Dimensions: ${width}x${height}`);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 20);

    // Bright Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 5.0);
    rimLight.position.set(-10, -10, -5);
    scene.add(rimLight);

    const spotBounceLight = new THREE.PointLight(0xc084fc, 10.0, 30.0);
    spotBounceLight.position.set(6, 5, 8);
    scene.add(spotBounceLight);

    const rightSpotUniforms = {
        uRightSpotColor: { value: new THREE.Color(0xa855f7) },
        uRightSpotOpacity: { value: 0.85 }
    };

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    return new Promise((resolve) => {
        loader.load(modelUrl, (gltf) => {
            const rawModel = gltf.scene;

            rawModel.updateMatrixWorld(true);

            let meshCount = 0;
            const outlineLines = [];
            const outlineMaterials = [];
            const originalMaterials = [];

            // Configure Capsule Creo D as an Atmospheric Semi-Transparent 3D Background Element
            rawModel.traverse((child) => {
                if (child.isMesh) {
                    meshCount++;
                    child.visible = true;
                    child.frustumCulled = false;
                    if (child.geometry) {
                        child.geometry.computeBoundingBox();
                        child.geometry.computeBoundingSphere();
                        child.geometry.computeVertexNormals();
                    }

                    // Keep material as dark sleek background element with subtle opacity (starts at 0.0 for fade-in)
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x2e1065,
                        roughness: 0.15,
                        metalness: 0.7,
                        emissive: 0x1e0938,
                        emissiveIntensity: 0.3,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.0,         // Start fully transparent for fade-in
                        depthWrite: false
                    });

                    // Shader integration: Dynamic Section Background Spot Light Reaction
                    mat.onBeforeCompile = (shader) => {
                        shader.uniforms.uRightSpotColor = rightSpotUniforms.uRightSpotColor;

                        shader.vertexShader = `
                            varying vec3 vModelPosCustom;
                            varying vec3 vNormalCustom;
                            ${shader.vertexShader}
                        `.replace(
                            'void main() {',
                            'void main() {\n    vModelPosCustom = position;\n    vNormalCustom = normal;'
                        );

                        const targetChunk = shader.fragmentShader.includes('#include <colorspace_fragment>') 
                            ? '#include <colorspace_fragment>' 
                            : (shader.fragmentShader.includes('#include <opaque_fragment>') ? '#include <opaque_fragment>' : '#include <tonemapping_fragment>');

                        shader.fragmentShader = `
                            varying vec3 vModelPosCustom;
                            varying vec3 vNormalCustom;
                            uniform vec3 uRightSpotColor;
                            ${shader.fragmentShader}
                        `.replace(
                            targetChunk,
                            `
                            ${targetChunk}
                            // Smooth section background spot light reaction onto Capsule 3D surface
                            vec3 n_custom = normalize(vNormalCustom);
                            vec3 spotDir = normalize(vec3(0.4, 0.6, 0.7));
                            float spotLightVal = max(0.0, dot(n_custom, spotDir));
                            float spotMask = pow(spotLightVal, 2.2);

                            if (spotMask > 0.01) {
                                vec3 spotColorMix = mix(gl_FragColor.rgb, uRightSpotColor * 1.5, spotMask * 0.75);
                                gl_FragColor.rgb = max(gl_FragColor.rgb, spotColorMix);
                            }
                            `
                        );
                    };

                    child.material = mat;
                    originalMaterials.push({ material: mat, targetOpacity: 0.32 });

                    // Create Outline / Edges Drawing mesh
                    if (child.geometry) {
                        const bbox = child.geometry.boundingBox || new THREE.Box3().setFromObject(child);
                        const minY = bbox.min.y;
                        const maxY = bbox.max.y;

                        const edgesGeom = new THREE.EdgesGeometry(child.geometry);
                        const drawMat = new THREE.ShaderMaterial({
                            uniforms: {
                                uProgress: { value: 0.0 },
                                uColor: { value: new THREE.Color(0xc084fc) }, // Neon purple
                                uOpacity: { value: 0.0 },
                                uMinY: { value: minY },
                                uMaxY: { value: maxY },
                                uPulseMode: { value: 0.0 }
                            },
                            vertexShader: `
                                varying float vY;
                                void main() {
                                    vY = position.y;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `,
                            fragmentShader: `
                                uniform float uProgress;
                                uniform vec3 uColor;
                                uniform float uOpacity;
                                uniform float uMinY;
                                uniform float uMaxY;
                                uniform float uPulseMode;
                                varying float vY;

                                void main() {
                                    float percent = (vY - uMinY) / (uMaxY - uMinY + 0.0001);
                                    
                                    if (uPulseMode > 0.5) {
                                        // Pulse loop mode: only render a moving band [uProgress - 0.15, uProgress]
                                        if (percent > uProgress || percent < uProgress - 0.15) {
                                            discard;
                                        }
                                        
                                        // Fade edges of the pulse band for organic light beam feel
                                        float dist = uProgress - percent;
                                        float alpha = uOpacity * (1.0 - dist / 0.15);
                                        gl_FragColor = vec4(uColor * 2.0, alpha); // Double color brightness for glow
                                    } else {
                                        // Intro drawing mode
                                        if (percent > uProgress) {
                                            discard;
                                        }
                                        
                                        // Glow effect at drawing edge
                                        float dist = abs(percent - uProgress);
                                        float alpha = uOpacity;
                                        vec3 color = uColor;
                                        if (dist < 0.05) {
                                            color = mix(uColor * 2.0, uColor, dist / 0.05);
                                            alpha = uOpacity;
                                        }
                                        gl_FragColor = vec4(color, alpha);
                                    }
                                }
                            `,
                            transparent: true,
                            depthWrite: false,
                            side: THREE.DoubleSide
                        });

                        const lineSegments = new THREE.LineSegments(edgesGeom, drawMat);
                        child.add(lineSegments);

                        outlineLines.push(lineSegments);
                        outlineMaterials.push(drawMat);
                    }
                }
            });

            rawModel.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(rawModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const normalizeScale = maxDim > 0 ? (35.0 / maxDim) : 1;

            console.log(`✅ [3D TEST LOADER] GLTF Loaded! Total Meshes: ${meshCount}`);
            console.log(`📏 [3D TEST LOADER] Bounding Size: ${size.x.toFixed(1)} x ${size.y.toFixed(1)} x ${size.z.toFixed(1)}, Center: ${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${center.z.toFixed(1)}`);
            console.log(`🔍 [3D TEST LOADER] Applied Normalize Scale Factor: ${normalizeScale.toFixed(4)}`);

            // Use a clean pivot node to center rawModel without moving its local origin
            rawModel.scale.setScalar(normalizeScale);
            rawModel.position.set(-center.x * normalizeScale, -center.y * normalizeScale, -center.z * normalizeScale);

            const modelWrapper = new THREE.Group();
            modelWrapper.name = "Winhub";
            modelWrapper.add(rawModel);
            scene.add(modelWrapper);

            console.log("🎉 [3D TEST LOADER] Winhub background group successfully added to 3D Scene!");

            let isRotating = false;

            function animate() {
                requestAnimationFrame(animate);
                if (isRotating) {
                    modelWrapper.rotation.y += 0.00005; // Super slow rotation to keep focus on UI content
                    modelWrapper.rotation.x += 0.000025;
                }
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                const w = canvas.clientWidth || window.innerWidth;
                const h = canvas.clientHeight || window.innerHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h, false);
            });

            let loopTimer = null;
            
            const startGlowingPulseLoop = () => {
                const triggerNextPulse = () => {
                    const nextDelay = 3.5 + Math.random() * 3.5; // Random delay: 3.5s to 7.0s
                    
                    loopTimer = gsap.delayedCall(nextDelay, () => {
                        // Smoothly transition pulse uProgress and opacity
                        outlineMaterials.forEach((mat) => {
                            mat.uniforms.uProgress.value = -0.15;
                            mat.uniforms.uOpacity.value = 0.55; // Semi-transparent pulse glow
                            
                            gsap.to(mat.uniforms.uProgress, {
                                value: 1.15,
                                duration: 0.85,
                                ease: "sine.inOut"
                            });
                            
                            gsap.to(mat.uniforms.uOpacity, {
                                value: 0.0,
                                duration: 0.35,
                                delay: 0.5,
                                ease: "sine.out"
                            });
                        });
                        
                        triggerNextPulse();
                    });
                };
                triggerNextPulse();
            };

            const startDrawingAnimation = () => {
                return new Promise((animResolve) => {
                    if (typeof gsap === 'undefined') {
                        // GSAP is not loaded, immediately show mesh and finish
                        originalMaterials.forEach((item) => {
                            item.material.opacity = item.targetOpacity;
                        });
                        animResolve();
                        return;
                    }

                    const tl = gsap.timeline({
                        onComplete: () => {
                            // Turn on uPulseMode to transition to looping outlines rather than deleting them
                            outlineMaterials.forEach((mat) => {
                                mat.uniforms.uPulseMode.value = 1.0;
                                mat.uniforms.uProgress.value = -0.2;
                                mat.uniforms.uOpacity.value = 0.0;
                            });
                            
                            console.log("⚡ [3D DRAWING ANIMS] Intro completed. Switching to Glowing Pulse Loop mode.");
                            isRotating = true; // Start slow rotation AFTER intro completes
                            startGlowingPulseLoop();
                            animResolve();
                        }
                    });

                    // Step 1: Draw neon outlines by animating uProgress from 0 to 1
                    outlineMaterials.forEach((mat) => {
                        // Make outlines visible as soon as the intro animation kicks off
                        mat.uniforms.uOpacity.value = 0.8;
                        
                        tl.to(mat.uniforms.uProgress, {
                            value: 1.0,
                            duration: 0.95,
                            ease: "power2.out"
                        }, 0);
                    });

                    // Step 2: Flicker (stuttering light bulb on) fade-in of original mesh materials using a single high-performance onUpdate loop to prevent frame drops
                    const flickerObj = { opacity: 0.0 };
                    tl.to(flickerObj, {
                        opacity: 1.0,
                        duration: 1.1,
                        ease: "none",
                        onUpdate: () => {
                            const p = flickerObj.opacity;
                            let currentOpacity = 0.0;
                            
                            // High fidelity simulated flicker curve matching the original multi-step sequence
                            if (p < 0.32) {
                                currentOpacity = 0.0;
                            } else if (p < 0.39) {
                                currentOpacity = 0.55;
                            } else if (p < 0.44) {
                                currentOpacity = 0.03;
                            } else if (p < 0.55) {
                                currentOpacity = 0.95;
                            } else if (p < 0.61) {
                                currentOpacity = 0.14;
                            } else if (p < 0.68) {
                                currentOpacity = 0.65;
                            } else {
                                // Smooth transition from 0.65 to 1.0
                                const t = (p - 0.68) / 0.32;
                                currentOpacity = 0.65 + t * 0.35;
                            }
                            
                            originalMaterials.forEach((item) => {
                                item.material.opacity = item.targetOpacity * currentOpacity;
                            });
                        }
                    }, 0);

                    // Step 3: Fade-out neon outlines smoothly to achieve perfect cross-fade overlap
                    outlineMaterials.forEach((mat) => {
                        tl.to(mat.uniforms.uOpacity, {
                            value: 0.0,
                            duration: 0.85,
                            ease: "power2.out"
                        }, 0.6); // Starts at 0.6s, completes at 1.45s synchronously with main body fade-in
                    });
                });
            };

            const cleanup = () => {
                if (loopTimer) {
                    loopTimer.kill();
                    loopTimer = null;
                }
                outlineLines.forEach((line) => {
                    if (line.parent) {
                        line.parent.remove(line);
                    }
                    if (line.geometry) line.geometry.dispose();
                });
                outlineMaterials.forEach((mat) => mat.dispose());
                console.log("🧹 [3D SCENE] Cleaned up glowing pulse loop timer & outline WebGL resources");
            };

            resolve({
                findObjectByName: (name) => (name === "Winhub" ? modelWrapper : null),
                startDrawingAnimation,
                setRotating: (val) => { isRotating = val; },
                cleanup,
                scene,
                camera,
                renderer,
                rimLight,
                bounceLight: spotBounceLight,
                spotBounceLight,
                rightSideCapLight: keyLight,
                rightSpotUniforms
            });
        }, undefined, (err) => {
            console.error("❌ [3D TEST LOADER] Error loading GLTF model:", err);
            resolve(null);
        });
    });
}
