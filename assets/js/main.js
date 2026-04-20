import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Center profile cube
const centerGeometry = new THREE.BoxGeometry(3, 3, 3);
const centerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    emissive: 0x222222
});
const centerCard = new THREE.Mesh(centerGeometry, centerMaterial);
scene.add(centerCard);

// Load profile photo texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    'assets/images/cartoon_profile_photo.png',
    (texture) => {
        // Success callback
        // Configure texture for sharp rendering
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.generateMipmaps = false;
        
        centerMaterial.map = texture;
        centerMaterial.needsUpdate = true;
        console.log('Profile photo loaded successfully');
    },
    undefined,
    (error) => {
        // Error callback
        console.error('Error loading profile photo:', error);
    }
);

// Bubble data
const bubbles = [
    { 
        name: 'Past Experience', 
        angle: 680 / 360 * Math.PI,
        url: '#resume', // Replace with your resume link
        texture: 'assets/images/resume.png'
    },
    { 
        name: 'Websites',
        angle: 180 / 360 * Math.PI,
        url: '#websites', // Replace with your websites link
        texture: 'assets/images/websites.png'
    },
    { 
        name: 'Projects', 
        angle: 400 / 360 * Math.PI,
        url: '#projects', // Replace with your projects link
        texture: 'assets/images/projects.png'
    }
];

const bubbleMeshes = [];
const spokeRadius = 5;

bubbles.forEach((bubble, index) => {
    // Calculate position
    const x = Math.cos(bubble.angle) * spokeRadius;
    const y = Math.sin(bubble.angle) * spokeRadius;
    
    // Create bubble cube
    const bubbleGeometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const bubbleMaterial = new THREE.MeshPhongMaterial({ 
        color: bubble.texture ? 0xffffff : bubble.color,
        emissive: bubble.color,
        emissiveIntensity: 0.2
    });
    const bubbleMesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubbleMesh.position.set(x, y, 0);
    bubbleMesh.userData = { name: bubble.name, url: bubble.url };
    scene.add(bubbleMesh);
    bubbleMeshes.push(bubbleMesh);
    
    // Load texture if specified
    if (bubble.texture) {
        textureLoader.load(
            bubble.texture,
            (texture) => {
                // Configure texture for sharp rendering
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                texture.generateMipmaps = false;
                
                bubbleMaterial.map = texture;
                bubbleMaterial.needsUpdate = true;
                console.log(`${bubble.name} texture loaded successfully`);
            },
            undefined,
            (error) => {
                console.error(`Error loading ${bubble.name} texture:`, error);
            }
        );
    }
    
    // Add text label (using sprite)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    context.fillStyle = 'white';
    context.font = 'Bold 48px Arial';
    context.textAlign = 'center';
    context.fillText(bubble.name, 256, 80);
    
    const texture = new THREE.CanvasTexture(canvas);
    // Configure texture for sharp rendering
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = false;
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y - 1.2, 0);
    sprite.scale.set(2, 0.5, 1);
    scene.add(sprite);
});

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredBubble = null;

// Camera animation state
let cameraTarget = null;
let isAnimating = false;
const initialCameraPosition = new THREE.Vector3(0, 0, 9);
const initialControlsTarget = new THREE.Vector3(0, 0, 0);

// Scene state management
let currentView = 'main'; // 'main' or 'timeline'
let transitionState = 'none'; // 'none', 'zooming', 'darkening', 'fading-in-timeline', 'fading-out-timeline', 'lightening'
let transitionProgress = 0;
let pendingTimeline = null;
let clickedSphere = null;
const mainSceneObjects = [];
const timelineObjects = [];

// Get dark overlay element
const darkOverlay = document.getElementById('darkOverlay');

// Store all main scene objects
mainSceneObjects.push(centerCard);
bubbleMeshes.forEach(mesh => mainSceneObjects.push(mesh));

// Back button
const backButton = document.getElementById('backButton');
let isZoomedIn = false;

backButton.addEventListener('click', () => {
    if (currentView === 'timeline') {
        // Transition back to main scene
        transitionToMainScene();
    } else {
        // Return to initial view
        isAnimating = true;
        isZoomedIn = false;
        cameraTarget = initialCameraPosition.clone();
        controls.target.copy(initialControlsTarget);
        backButton.classList.remove('visible');
    }
});

// Timeline creation function
function createTimeline(categoryName) {
    // Clear existing timeline objects
    timelineObjects.forEach(obj => scene.remove(obj));
    timelineObjects.length = 0;
    
    // Sample timeline data - replace with your actual data
    const timelineItems = [
        { year: '2024', title: 'Project Alpha', description: 'Description here' },
        { year: '2023', title: 'Project Beta', description: 'Another project' },
        { year: '2022', title: 'Project Gamma', description: 'Earlier work' },
        { year: '2021', title: 'Project Delta', description: 'Initial project' }
    ];
    
    const itemSpacing = 3;
    const startY = (timelineItems.length - 1) * itemSpacing / 2;
    
    timelineItems.forEach((item, index) => {
        const yPos = startY - (index * itemSpacing);
        
        // Create card for timeline item
        const cardGeometry = new THREE.BoxGeometry(4, 2, 0.2);
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            emissive: 0x222222
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        card.position.set(0, yPos, 0);
        
        // Create text for timeline item
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 512;
        
        context.fillStyle = '#1a1a2e';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = 'Bold 72px Arial';
        context.textAlign = 'center';
        context.fillText(item.year, 512, 150);
        
        context.font = '48px Arial';
        context.fillText(item.title, 512, 250);
        
        context.font = '32px Arial';
        context.fillText(item.description, 512, 350);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        cardMaterial.map = texture;
        cardMaterial.needsUpdate = true;
        
        scene.add(card);
        timelineObjects.push(card);
        
        // Add connecting line
        if (index < timelineItems.length - 1) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-2, yPos - 1, 0),
                new THREE.Vector3(-2, yPos - itemSpacing + 1, 0)
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4a90e2 });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            timelineObjects.push(line);
        }
    });
    
    // Initially hide timeline objects
    timelineObjects.forEach(obj => {
        obj.visible = false;
    });
}

// Transition functions
function transitionToTimeline(categoryName, spherePosition) {
    if (transitionState !== 'none' || currentView === 'timeline') return;
    
    createTimeline(categoryName);
    pendingTimeline = categoryName;
    
    // Step 1: Start zooming to sphere
    transitionState = 'zooming';
    transitionProgress = 0;
    isAnimating = true;
    const offset = new THREE.Vector3(0, 0, 3);
    cameraTarget = spherePosition.clone().add(offset);
    controls.target.copy(spherePosition);
}

function transitionToMainScene() {
    if (transitionState !== 'none' || currentView === 'main') return;
    
    // Transition back to main scene
    transitionState = 'fading-out-timeline';
    transitionProgress = 0;
}

function updateTransition() {
    if (transitionState === 'none') return;
    
    switch (transitionState) {
        case 'zooming':
            // Check if camera has reached target
            if (!isAnimating && camera.position.distanceTo(cameraTarget) < 0.1) {
                // Zoom complete, start darkening
                transitionState = 'darkening';
                transitionProgress = 0;
                darkOverlay.style.opacity = '0';
            }
            break;
            
        case 'darkening':
            transitionProgress += 0.04;
            darkOverlay.style.opacity = Math.min(transitionProgress, 1).toString();
            
            if (transitionProgress >= 1) {
                // Darkening complete, hide main scene and show timeline
                mainSceneObjects.forEach(obj => obj.visible = false);
                scene.children.forEach(child => {
                    if (child.type === 'Sprite') child.visible = false;
                });
                timelineObjects.forEach(obj => {
                    obj.visible = true;
                    if (obj.material) {
                        obj.material.opacity = 0;
                        obj.material.transparent = true;
                    }
                });
                
                currentView = 'timeline';
                camera.position.set(0, 0, 8);
                controls.target.set(0, 0, 0);
                cameraTarget = null;
                
                // Start lightening and fading in timeline
                transitionState = 'fading-in-timeline';
                transitionProgress = 0;
                backButton.classList.add('visible');
            }
            break;
            
        case 'fading-in-timeline':
            transitionProgress += 0.04;
            const fadeInOpacity = Math.min(transitionProgress, 1);
            
            // Fade in timeline objects
            timelineObjects.forEach(obj => {
                if (obj.material) {
                    obj.material.opacity = fadeInOpacity;
                }
            });
            
            // Lighten overlay simultaneously
            darkOverlay.style.opacity = (1 - fadeInOpacity).toString();
            
            if (transitionProgress >= 1) {
                // Transition complete
                transitionState = 'none';
                darkOverlay.style.opacity = '0';
            }
            break;
            
        case 'fading-out-timeline':
            transitionProgress += 0.04;
            const fadeOutOpacity = Math.min(transitionProgress, 1);
            
            // Darken screen and fade out timeline
            darkOverlay.style.opacity = fadeOutOpacity.toString();
            timelineObjects.forEach(obj => {
                if (obj.material) {
                    obj.material.opacity = 1 - fadeOutOpacity;
                }
            });
            
            if (transitionProgress >= 1) {
                // Hide timeline, show main scene
                timelineObjects.forEach(obj => obj.visible = false);
                mainSceneObjects.forEach(obj => {
                    obj.visible = true;
                    if (obj.material) {
                        obj.material.opacity = 0;
                        obj.material.transparent = true;
                    }
                });
                scene.children.forEach(child => {
                    if (child.type === 'Sprite') child.visible = true;
                });
                
                currentView = 'main';
                camera.position.copy(initialCameraPosition);
                controls.target.copy(initialControlsTarget);
                
                // Start lightening
                transitionState = 'lightening';
                transitionProgress = 0;
                backButton.classList.remove('visible');
            }
            break;
            
        case 'lightening':
            transitionProgress += 0.04;
            const lightenOpacity = Math.min(transitionProgress, 1);
            
            // Lighten overlay and fade in main scene
            darkOverlay.style.opacity = (1 - lightenOpacity).toString();
            mainSceneObjects.forEach(obj => {
                if (obj.material) {
                    obj.material.opacity = lightenOpacity;
                }
            });
            
            if (transitionProgress >= 1) {
                // Transition complete
                transitionState = 'none';
                darkOverlay.style.opacity = '0';
                
                // Reset material opacity to fully opaque
                mainSceneObjects.forEach(obj => {
                    if (obj.material) {
                        obj.material.opacity = 1;
                        obj.material.transparent = false;
                    }
                });
            }
            break;
    }
}

// Mouse move for hover effect
window.addEventListener('mousemove', (event) => {
    if (currentView === 'timeline' || transitionState !== 'none') return; // Don't process hover during transition
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bubbleMeshes);
    
    // Reset all bubbles
    bubbleMeshes.forEach(bubble => {
        bubble.scale.set(1, 1, 1);
    });
    
    // Highlight hovered bubble
    if (intersects.length > 0) {
        const hovered = intersects[0].object;
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
});

// Click handler
window.addEventListener('click', (event) => {
    if (currentView === 'timeline' || transitionState !== 'none') return; // Don't process clicks during transition
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bubbleMeshes);
    
    if (intersects.length > 0) {
        const clicked = intersects[0].object;
        console.log('Clicked:', clicked.userData.name);
        
        // Transition to timeline view with zoom
        clickedSphere = clicked;
        transitionToTimeline(clicked.userData.name, clicked.position);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update transition state
    updateTransition();
    
    // Smooth camera animation
    if (isAnimating && cameraTarget) {
        camera.position.lerp(cameraTarget, 0.10);
        
        // Check if close enough to target
        if (camera.position.distanceTo(cameraTarget) < 0.01) {
            isAnimating = false;
        }
    }
  
    
    controls.update();
    renderer.render(scene, camera);
}

animate();
