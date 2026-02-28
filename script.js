/* ===========================================
   Portfolio — Space-Themed AI Animations
   Cosmic neural network, nebula particles,
   typing effect, scroll animations, card glow
   =========================================== */

// Space color palette
const SPACE_COLORS = [
    { r: 0, g: 212, b: 255 },    // Cyan
    { r: 123, g: 97, b: 255 },   // Purple
    { r: 255, g: 100, b: 200 },  // Pink
    { r: 255, g: 160, b: 60 },   // Nebula orange
    { r: 80, g: 200, b: 255 },   // Light blue
    { r: 180, g: 80, b: 255 },   // Violet
    { r: 100, g: 255, b: 200 },  // Mint
    { r: 255, g: 80, b: 120 },   // Hot pink
];

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. NEURAL NETWORK CANVAS (Hero Background)
    //    Draws nodes + edges that look like a
    //    neural network / knowledge graph
    // ============================================
    const neuralCanvas = document.getElementById('neuralCanvas');
    const nctx = neuralCanvas.getContext('2d');
    let nodes = [];
    let stars = [];
    let neuralAnimId;
    const NODE_COUNT = 75;
    const STAR_COUNT = 120;
    const CONNECTION_DIST = 170;

    function resizeNeuralCanvas() {
        const hero = document.getElementById('hero');
        neuralCanvas.width = hero.offsetWidth;
        neuralCanvas.height = hero.offsetHeight;
    }

    class Star {
        constructor(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.3;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.005 + Math.random() * 0.02;
            // Stars are mostly white/blue with occasional warm tones
            const roll = Math.random();
            if (roll < 0.6) {
                this.r = 200 + Math.random() * 55;
                this.g = 210 + Math.random() * 45;
                this.b = 255;
            } else if (roll < 0.8) {
                this.r = 255; this.g = 200 + Math.random() * 40; this.b = 150 + Math.random() * 50;
            } else {
                this.r = 150 + Math.random() * 50; this.g = 180 + Math.random() * 50; this.b = 255;
            }
        }
    }

    class Node {
        constructor(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 2.8 + 1;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.01 + Math.random() * 0.025;
            // Assign a random space color
            this.color = SPACE_COLORS[Math.floor(Math.random() * SPACE_COLORS.length)];
        }

        update(w, h) {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
    }

    function initNodes() {
        nodes = [];
        stars = [];
        const w = neuralCanvas.width;
        const h = neuralCanvas.height;
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(new Node(w, h));
        }
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star(w, h));
        }
    }

    function drawNeural() {
        const w = neuralCanvas.width;
        const h = neuralCanvas.height;
        nctx.clearRect(0, 0, w, h);

        // Draw twinkling stars
        for (const star of stars) {
            star.twinkle += star.twinkleSpeed;
            const brightness = 0.2 + 0.6 * Math.abs(Math.sin(star.twinkle));
            nctx.beginPath();
            nctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            nctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${brightness})`;
            nctx.fill();
        }

        // Draw connections with gradient colors
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
                    const c1 = nodes[i].color;
                    const c2 = nodes[j].color;
                    const grad = nctx.createLinearGradient(
                        nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y
                    );
                    grad.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${alpha})`);
                    grad.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${alpha})`);
                    nctx.beginPath();
                    nctx.moveTo(nodes[i].x, nodes[i].y);
                    nctx.lineTo(nodes[j].x, nodes[j].y);
                    nctx.strokeStyle = grad;
                    nctx.lineWidth = 0.6;
                    nctx.stroke();
                }
            }
        }

        // Draw nodes with individual colors
        for (const node of nodes) {
            const glow = 0.35 + 0.35 * Math.sin(node.pulse);
            const c = node.color;
            nctx.beginPath();
            nctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            nctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${glow})`;
            nctx.fill();

            // Outer glow in same color
            nctx.beginPath();
            nctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
            nctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${glow * 0.12})`;
            nctx.fill();

            node.update(w, h);
        }

        neuralAnimId = requestAnimationFrame(drawNeural);
    }

    // Mouse interaction with neural network
    let mouseX = -1000, mouseY = -1000;
    document.getElementById('hero').addEventListener('mousemove', (e) => {
        const rect = neuralCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Push nearby nodes away gently
        for (const node of nodes) {
            const dx = node.x - mouseX;
            const dy = node.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
                const force = (120 - dist) / 120 * 0.3;
                node.vx += (dx / dist) * force;
                node.vy += (dy / dist) * force;
                // Dampen
                node.vx *= 0.98;
                node.vy *= 0.98;
            }
        }
    });

    resizeNeuralCanvas();
    initNodes();
    drawNeural();

    window.addEventListener('resize', () => {
        resizeNeuralCanvas();
        initNodes();
    });

    // ============================================
    // 2. FLOATING PARTICLES (Full-Page Overlay)
    //    Tiny floating data points drifting upward
    // ============================================
    const particleCanvas = document.getElementById('particleCanvas');
    const pctx = particleCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 35;

    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = particleCanvas.height + Math.random() * 100;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.color = SPACE_COLORS[Math.floor(Math.random() * SPACE_COLORS.length)];
            this.char = Math.random() > 0.7
                ? ['0', '1', '{', '}', '<', '>', '/', '*'][Math.floor(Math.random() * 8)]
                : '';
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -20) this.reset();
        }

        draw() {
            const c = this.color;
            if (this.char) {
                pctx.font = `${10 + this.size * 3}px 'JetBrains Mono', monospace`;
                pctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${this.opacity * 0.5})`;
                pctx.fillText(this.char, this.x, this.y);
            } else {
                pctx.beginPath();
                pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${this.opacity})`;
                pctx.fill();
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Particle();
            p.y = Math.random() * particleCanvas.height; // Spread initially
            particles.push(p);
        }
    }

    function drawParticles() {
        pctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(drawParticles);
    }

    resizeParticleCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeParticleCanvas();
    });

    // ============================================
    // 3. LLM-STYLE TYPING ANIMATION
    //    Types out roles like token generation
    // ============================================
    // REPLACE: Edit these strings to change what gets typed
    const titles = [
        'Data Scientist & LLM Engineer',
        'Building intelligent systems',
        'NLP · RAG · Agentic AI',
        'Turning data into insight',
    ];

    const typingEl = document.getElementById('typingText');
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 70;

    function typeLoop() {
        const current = titles[titleIdx];

        if (!isDeleting) {
            typingEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;

            if (charIdx === current.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else {
                // Variable speed to simulate LLM token generation
                typeSpeed = 40 + Math.random() * 60;
            }
        } else {
            typingEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;

            if (charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                typeSpeed = 400; // Pause before next string
            } else {
                typeSpeed = 25;
            }
        }

        setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();

    // ============================================
    // 4. MOBILE NAV TOGGLE
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-links a');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // ============================================
    // 5. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============================================
    // 6. ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('.section, .hero');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        },
        { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(s => sectionObserver.observe(s));

    // ============================================
    // 7. SCROLL FADE-IN ANIMATIONS
    //    With staggered delays via CSS --delay
    // ============================================
    const animateEls = document.querySelectorAll('.animate-in');

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    animateEls.forEach(el => fadeObserver.observe(el));

    // ============================================
    // 8. CARD GLOW (follows mouse)
    // ============================================
    document.querySelectorAll('.project-card, .pub-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // ============================================
    // 9. MAGNETIC BUTTONS (social icons)
    //    Buttons subtly follow cursor on hover
    // ============================================
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.08)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
});
