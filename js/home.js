document.addEventListener("DOMContentLoaded", function () {
    // --- SCROLL REVEAL (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.fade-up, .scale-up, .slide-l, .slide-r');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- SVG TREE ANIMATION ---
    const treeElements = document.querySelectorAll('.trunk-fill, .trunk-highlight, .bark-line, .knot, .root-flare, .intro-seed, .intro-seed-pulse');
    
    if (treeElements.length > 0) {
        const treeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('on');
                }
            });
        }, { threshold: 0.2, rootMargin: "0px 0px -100px 0px" });
        
        treeElements.forEach(el => treeObserver.observe(el));
    }    // --- SEQUENTIAL GROWTH TRAJECTORY ANIMATION ---
    const growthContainer = document.getElementById('growthContainer');
    const replayBtn = document.getElementById('btnReplayTrajectory');

    if (growthContainer) {
        function triggerTrajectoryAnimation() {
            growthContainer.classList.remove('active');
            // Force reflow so animations restart cleanly
            void growthContainer.offsetWidth;
            growthContainer.classList.add('active');
        }

        const growthObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerTrajectoryAnimation();
                }
            });
        }, { threshold: 0.2 });

        growthObserver.observe(growthContainer);

        if (replayBtn) {
            replayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerTrajectoryAnimation();
            });
        }
    }
});

// --- VIDEO PLAYER STUB ---
window.handleVideoPlay = function() {
    const videoInner = document.getElementById('video-inner');
    if (videoInner) {
        videoInner.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#000; color:#fff; border-radius:16px;">Video Player Placeholder</div>';
    } else {
        console.log("Play Video Clicked");
    }
};

// --- FAQ TOGGLE ---
window.toggleFaq = function(element) {
    const body = element.querySelector('.faq-body');
    const isOpen = element.classList.contains('open');

    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
        const b = item.querySelector('.faq-body');
        if (b) b.classList.remove('open');
    });

    // If it wasn't open, open it
    if (!isOpen) {
        element.classList.add('open');
        if (body) body.classList.add('open');
    }
};

// --- VIDEO SELECTOR & AUTOPLAY ---
(function() {
    const videoTypes = ['launch', 'market', 'bd'];
    let currentVideoIndex = 0;
    let autoPlayInterval;

    window.selectVideo = function(type, isManual = true) {
        // Remove active class from all items
        document.querySelectorAll('.bdaas-item').forEach(item => item.classList.remove('active'));
        
        // Add active class to the clicked item
        const clickedItem = document.getElementById('btn-' + type);
        if (clickedItem) clickedItem.classList.add('active');

        // Update video iframe source
        const iframe = document.querySelector('#value-video-box iframe');
        if (iframe) {
            if (type === 'launch') {
                iframe.src = 'https://www.youtube.com/embed/5_JCsAVSHn0?si=uqME-XuDlrsgWRqP';
            } else if (type === 'market') {
                iframe.src = 'https://www.youtube.com/embed/rOXNeaXi5-w?si=7NaF6v6Ou4JhkKre';
            } else if (type === 'bd') {
                iframe.src = 'https://www.youtube.com/embed/r3mrl_VLptM?si=93nOwehAzJlbj6y4';
            }
        }

        // If triggered manually by user click, update the current index and reset autoplay interval
        if (isManual) {
            currentVideoIndex = videoTypes.indexOf(type);
            if (currentVideoIndex === -1) currentVideoIndex = 0;
            resetAutoPlay();
        }
    };

    function nextVideo() {
        currentVideoIndex = (currentVideoIndex + 1) % videoTypes.length;
        window.selectVideo(videoTypes[currentVideoIndex], false);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextVideo, 3000); // Rotate every 3 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Initialize auto-play when DOM is ready
    document.addEventListener("DOMContentLoaded", function() {
        startAutoPlay();
    });
})();

// ═══════════════════════════════════════════
// CONTACT FORM — Validation + Web3Forms
// ═══════════════════════════════════════════
(function () {
    const WEB3FORMS_ACCESS_KEY = '129533de-2531-44cb-a4e7-1c5ee899becd';

    const form = document.getElementById('contactForm');
    const btnS = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');
    const stat = document.getElementById('formStatus');
    if (!form) return;

    const PERSONAL_DOMAINS = new Set([
        'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk', 'yahoo.com.au',
        'ymail.com', 'rocketmail.com', 'hotmail.com', 'hotmail.co.uk', 'hotmail.in', 'hotmail.fr',
        'outlook.com', 'outlook.in', 'live.com', 'live.in', 'msn.com', 'icloud.com', 'me.com',
        'mac.com', 'aol.com', 'aim.com', 'rediffmail.com', 'protonmail.com', 'proton.me',
        'zohomail.com', 'mail.com', 'email.com', 'inbox.com', 'gmx.com', 'gmx.de', 'gmx.net',
        'tutanota.com', 'tutamail.com', 'fastmail.com', 'fastmail.fm', 'yandex.com', 'yandex.ru',
        'qq.com', '163.com', '126.com'
    ]);

    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
    function isCompanyEmail(v) {
        if (!isValidEmail(v)) return false;
        return !PERSONAL_DOMAINS.has(v.trim().split('@')[1].toLowerCase());
    }

    function validateField(f) {
        const val = f.value.trim();
        let ok = true, errMsg = '';
        const wrap = f.closest('.field-wrap');
        const errSpan = wrap ? wrap.querySelector('.field-error-msg') : null;

        if (f.id === 'fsize') { ok = val !== ''; errMsg = 'Please select your company size'; }
        else if (f.id === 'findustry') { ok = val !== ''; errMsg = 'Please select your industry'; }
        else if (f.id === 'femail') {
            if (!val) { ok = false; errMsg = 'Please enter your email'; }
            else if (!isValidEmail(val)) { ok = false; errMsg = 'Please enter a valid email address'; }
            else if (!isCompanyEmail(val)) { ok = false; errMsg = 'Please use your work email address'; }
        } else if (f.id === 'fphone') {
            if (!val) { ok = false; errMsg = 'Please enter your phone number'; }
            else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(val)) { ok = false; errMsg = 'Please enter a valid phone number'; }
        } else if (f.id === 'fmessage') {
            if (!val) { ok = false; errMsg = 'Please enter your message'; }
            else if (val.length < 10) { ok = false; errMsg = 'Message must be at least 10 characters'; }
        } else if (f.hasAttribute('required')) {
            ok = val.length > 0;
            if (!ok) errMsg = 'This field is required';
        }

        if (errSpan && errMsg) errSpan.textContent = errMsg;
        if (errSpan && ok) errSpan.textContent = '';
        f.classList.toggle('is-err', !ok);
        f.classList.toggle('is-good', ok && val.length > 0);

        // Shake animation on error
        if (!ok && wrap && document.activeElement === f) {
            wrap.style.transition = 'margin-left 0.05s';
            const shakeSeq = [-5, 5, -5, 5, 0];
            shakeSeq.forEach((px, i) => {
                setTimeout(() => { wrap.style.marginLeft = px + 'px'; }, i * 50);
            });
        }
        return ok;
    }

    const allInputs = form.querySelectorAll('.form-input');

    allInputs.forEach(f => {
        const evt = f.tagName === 'SELECT' ? 'change' : 'blur';
        f.addEventListener(evt, () => validateField(f));
        if (f.tagName !== 'SELECT') {
            f.addEventListener('input', () => { if (f.classList.contains('is-err')) validateField(f); });
        }
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Rate limiting — 1 submission per 24 hours
        const lastSub = localStorage.getItem('dataillam_form_sent');
        if (lastSub && Date.now() - parseInt(lastSub) < 1000 * 60 * 60 * 24) {
            if (stat) { stat.textContent = "We already received your message. We'll be in touch shortly."; stat.style.color = 'var(--red)'; }
            return;
        }

        let allOk = true;
        allInputs.forEach(f => { if (!validateField(f)) allOk = false; });

        if (!allOk) {
            // Shake the whole form
            form.style.transition = 'margin-left 0.05s';
            [-5, 5, -5, 5, 0].forEach((px, i) => {
                setTimeout(() => { form.style.marginLeft = px + 'px'; }, i * 50);
            });
            if (stat) { stat.textContent = 'Please fix the errors above.'; stat.style.color = 'var(--red)'; }
            return;
        }

        // Disable button & show loading
        btnS.disabled = true;
        const btnTxt = btnS.querySelector('.btn-txt');
        const originalText = btnTxt ? btnTxt.textContent : 'Send Message →';
        if (btnTxt) btnTxt.textContent = 'Sending...';
        if (success) success.style.display = 'none';
        if (stat) stat.textContent = '';

        const params = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: 'New Business Inquiry from DATAiLLAM Home Page',
            from_name: 'DATAiLLAM Website (Home)',
            company_name: form.querySelector('#fcompany').value.trim(),
            company_size: form.querySelector('#fsize').value,
            industry: form.querySelector('#findustry').value,
            from_email: form.querySelector('#femail').value.trim(),
            phone: form.querySelector('#fphone').value.trim(),
            message: form.querySelector('#fmessage').value.trim(),
            reply_to: form.querySelector('#femail').value.trim(),
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(params)
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                if (btnTxt) btnTxt.textContent = 'Sent ✓';
                btnS.style.background = '#2d8f4e';
                if (success) { success.style.display = 'flex'; }
                localStorage.setItem('dataillam_form_sent', Date.now().toString());

                // Reset form fields immediately
                form.reset();
                allInputs.forEach(f => {
                    f.classList.remove('is-err', 'is-good');
                    if (f.tagName === 'SELECT') {
                        f.classList.remove('has-value');
                        f.classList.add('placeholder-selected');
                    }
                });

                setTimeout(() => {
                    btnS.disabled = false;
                    if (btnTxt) btnTxt.textContent = originalText;
                    btnS.style.background = '';
                    if (success) success.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to send.');
            }

        } catch (err) {
            btnS.disabled = false;
            if (btnTxt) btnTxt.textContent = originalText;
            const msg = err?.message ? `Send failed: ${err.message}` : 'Failed to send. Please try again or email us directly.';
            if (stat) { stat.textContent = msg; stat.style.color = 'var(--red)'; }
        }
    });
})();

// ═══════════════════════════════════════════
// INTERACTIVE CANVAS BACKGROUND ANIMATION
// ═══════════════════════════════════════════
(function () {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    let particles = [];
    let animationFrameId = null;
    let isVisible = false;

    const mouse = {
        x: null,
        y: null,
        active: false,
        radius: 180 // interactive radius
    };

    // Brand Colors (Cream background is #F1E9D8)
    const colors = [
        "rgba(200, 32, 42, 0.45)",  // Red (soft)
        "rgba(212, 146, 26, 0.45)",  // Amber (soft)
        "rgba(138, 126, 106, 0.25)"  // Mute (soft)
    ];

    class Particle {
        constructor() {
            this.resize();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Very slow speeds for a smooth, high-end floating feel
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 2.5 + 1.5; // 1.5px to 4px
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        resize() {
            // Adjust position if it goes off screen on resize
            if (this.x > canvas.width) this.x = canvas.width;
            if (this.y > canvas.height) this.y = canvas.height;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundary
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse Gravity
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    // Soft pull towards the cursor
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 0.4;
                    this.y += (dy / distance) * force * 0.4;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        // Particle density based on screen width
        const density = window.innerWidth < 768 ? 30 : 75;
        for (let i = 0; i < density; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        const rect = heroSection.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        particles.forEach(p => p.resize());
    }

    function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connecting lines
        const maxDist = window.innerWidth < 768 ? 90 : 120;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Link to mouse
            if (mouse.active) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const alpha = (1 - dist / mouse.radius) * 0.15;
                    ctx.strokeStyle = `rgba(212, 146, 26, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Link to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08;
                    ctx.strokeStyle = `rgba(138, 126, 106, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener("resize", () => {
        resize();
    });

    heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    heroSection.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    // Intersection Observer to pause when scrolled out of view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                // Restart animation loop
                cancelAnimationFrame(animationFrameId);
                animate();
            } else {
                // Stop animation loop
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0.05 });

    observer.observe(heroSection);

    // Initial setup
    resize();
    init();
})();
