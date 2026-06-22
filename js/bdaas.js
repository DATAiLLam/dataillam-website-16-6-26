            /* ── INTRO ANIMATION ── */
            (function () {
                const ov = document.getElementById('intro-overlay'), cv = document.getElementById('intro-canvas');
                if (!ov || !cv) return;

                // --- ONCE PER SESSION LOGIC ---
                const hasSeenIntro = sessionStorage.getItem('dataillam_intro_seen');
                if (hasSeenIntro) {
                    ov.remove();
                    document.body.classList.remove('intro-active');
                    $(document).ready(function() {
                        if (typeof window.animateHero === 'function') {
                            window.animateHero();
                        }
                    });
                    return;
                }

                const c = cv.getContext('2d');
                let W, H, cx, cy;

                // Ambient falling orbs for background depth
                const orbs = Array.from({ length: 12 }, () => ({
                    x: Math.random(), y: Math.random(),
                    vx: (Math.random() - 0.5) * 0.0003,
                    vy: (Math.random() - 0.5) * 0.0003,
                    r: Math.random() * 100 + 50,
                    a: Math.random() * 0.06 + 0.02
                }));

                function resize() {
                    W = cv.width = ov.offsetWidth;
                    H = cv.height = ov.offsetHeight;
                    cx = W / 2; cy = H / 2;
                }
                window.addEventListener('resize', resize);
                resize();

                const baseLogo = document.getElementById('logo-base');
                const colorLogo = document.getElementById('logo-color');
                const coloredLayer = document.getElementById('colored-layer');
                const bdaasText = document.getElementById('bdaas-text');
                const taglineText = document.getElementById('tagline-text');
                const coloredIText = document.querySelector('#logo-text-color span');

                let t0 = Date.now();
                let dropY = -80;
                let dropping = false;
                let splattered = false;
                let splatTime = 0;
                let particles = [];

                let targetX = cx;
                let targetY = cy;

                function updateTarget() {
                    if (!coloredIText) return;
                    const rect = coloredIText.getBoundingClientRect();
                    if (rect.width > 0) {
                        targetX = rect.left + rect.width / 2;
                        targetY = rect.top + rect.height / 2 - 5;
                    }
                }

                function frame() {
                    const el = Date.now() - t0;
                    c.clearRect(0, 0, W, H);

                    // Draw Ambient Orbs
                    orbs.forEach(o => {
                        o.x += o.vx; o.y += o.vy;
                        if (o.x < 0 || o.x > 1) o.vx *= -1;
                        if (o.y < 0 || o.y > 1) o.vy *= -1;
                        const px = o.x * W, py = o.y * H;
                        const g = c.createRadialGradient(px, py, 0, px, py, o.r);
                        g.addColorStop(0, `rgba(212,146,26,${o.a})`);
                        g.addColorStop(1, 'rgba(212,146,26,0)');
                        c.beginPath(); c.arc(px, py, o.r, 0, 6.28); c.fillStyle = g; c.fill();
                    });

                    if (el > 300 && !baseLogo.classList.contains('on')) {
                        baseLogo.classList.add('on');
                        colorLogo.classList.add('on');
                        // Wait for layout font to snap
                        setTimeout(updateTarget, 200);
                        setTimeout(updateTarget, 800);
                    }

                    if (el > 600 && !dropping) {
                        dropping = true;
                        dropY = -80;
                    }

                    if (dropping) {
                        updateTarget();

                        if (!splattered) {
                            let lastY = dropY;
                            dropY += (targetY - dropY) * 0.12 + 6;

                            // Draw trailing drop (cinematic tail)
                            const tg = c.createLinearGradient(targetX, lastY - 24, targetX, dropY);
                            tg.addColorStop(0, 'rgba(200,32,42,0)');
                            tg.addColorStop(1, '#C8202A');
                            c.beginPath(); c.moveTo(targetX - 4, dropY); c.lineTo(targetX + 4, dropY);
                            c.lineTo(targetX + 1, lastY - 24); c.lineTo(targetX - 1, lastY - 24);
                            c.fillStyle = tg; c.fill();

                            c.beginPath();
                            c.ellipse(targetX, dropY, 5, 14, 0, 0, Math.PI * 2);
                            c.fillStyle = '#C8202A';
                            c.fill();

                            if (dropY >= targetY) {
                                splattered = true;
                                splatTime = el;
                                ov.classList.add('bloom'); // Trigger background warming CSS

                                for (let i = 0; i < 25; i++) {
                                    particles.push({
                                        x: targetX, y: targetY,
                                        vx: (Math.random() - 0.5) * 12,
                                        vy: (Math.random() - 0.5) * 10 - 4,
                                        r: Math.random() * 3 + 1.5,
                                        a: 1
                                    });
                                }
                                coloredLayer.style.clipPath = `circle(150vw at ${targetX}px ${targetY}px)`;

                                setTimeout(() => {
                                    bdaasText.classList.add('on');
                                    taglineText.classList.add('on');
                                }, 300);

                                setTimeout(() => {
                                    ov.classList.add('exit');
                                    document.body.classList.remove('intro-active');
                                    // SAVE FLAG: Animation complete
                                    sessionStorage.setItem('dataillam_intro_seen', 'true');
                                }, 2200);

                                setTimeout(() => {
                                    ov.remove();
                                    if (typeof window.animateHero === 'function') {
                                        window.animateHero();
                                    }
                                }, 3200);
                            }
                        } else {
                            // Draw Shockwave Ripples
                            const waveT = el - splatTime;
                            if (waveT < 1500) {
                                const wr = waveT * 1.6;
                                const wa = Math.max(0, 1 - waveT / 1000);
                                c.beginPath(); c.arc(targetX, targetY, wr, 0, 6.28);
                                c.lineWidth = 5; c.strokeStyle = `rgba(200,32,42,${wa * 0.35})`;
                                c.stroke();

                                if (waveT > 80) {
                                    c.beginPath(); c.arc(targetX, targetY, (waveT - 80) * 1.3, 0, 6.28);
                                    c.lineWidth = 2.5; c.strokeStyle = `rgba(212,146,26,${Math.max(0, 1 - waveT / 1200) * 0.5})`;
                                    c.stroke();
                                    c.beginPath(); c.arc(targetX, targetY, (waveT - 80) * 1.3 + 8, 0, 6.28);
                                    c.lineWidth = 1; c.strokeStyle = `rgba(255,255,255,${Math.max(0, 1 - waveT / 1200) * 0.2})`;
                                    c.stroke();
                                }
                            }

                            // Splash Particles
                            for (let i = particles.length - 1; i >= 0; i--) {
                                let p = particles[i];
                                p.x += p.vx;
                                p.y += p.vy;
                                p.vy += 0.5; // gravity
                                p.a -= 0.025;
                                if (p.a <= 0) {
                                    particles.splice(i, 1);
                                    continue;
                                }
                                c.beginPath();
                                c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                                c.fillStyle = `rgba(200,32,42,${p.a})`;
                                c.fill();
                            }
                        }
                    }

                    if (el < 5000 && ov.parentElement) {
                        requestAnimationFrame(frame);
                    }
                }
                requestAnimationFrame(frame);
            })();

            /* ── CAROUSEL ── */
            const progress = document.getElementById('carouselProgress');
            const prevBtnEl = document.getElementById('prevBtn');
            const nextBtnEl = document.getElementById('nextBtn');
            const track = document.getElementById('carouselTrack');

            if (progress && prevBtnEl && nextBtnEl && track) {
                const SLIDES = 3, INTERVAL = 4500;
                let currentSlide = 0, autoTimer = null, progressTimer = null, progressStart = null;
                const slides = document.querySelectorAll('.carousel-slide');
                const dots = document.querySelectorAll('.carousel-dot');

                function goToSlide(idx) {
                    const prev = currentSlide;
                    currentSlide = (idx + SLIDES) % SLIDES;
                    if (slides[prev]) { slides[prev].classList.remove('active'); slides[prev].classList.add('prev'); setTimeout(() => slides[prev].classList.remove('prev'), 700); }
                    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
                    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
                    resetProgress();
                }
                function resetProgress() {
                    if (progressTimer) cancelAnimationFrame(progressTimer);
                    progress.style.width = '0%'; progressStart = null; animateProgress();
                }
                function animateProgress() {
                    progressTimer = requestAnimationFrame(ts => {
                        if (!progressStart) progressStart = ts;
                        const pct = Math.min(((ts - progressStart) / INTERVAL) * 100, 100);
                        progress.style.width = pct + '%';
                        if (pct < 100) animateProgress();
                    });
                }
                function startAuto() { stopAuto(); autoTimer = setInterval(() => goToSlide(currentSlide + 1), INTERVAL) }
                function stopAuto() { if (autoTimer) clearInterval(autoTimer) }
                resetProgress(); startAuto();

                prevBtnEl.addEventListener('click', () => { stopAuto(); goToSlide(currentSlide - 1); startAuto() });
                nextBtnEl.addEventListener('click', () => { stopAuto(); goToSlide(currentSlide + 1); startAuto() });
                dots.forEach(dot => dot.addEventListener('click', () => { stopAuto(); goToSlide(+dot.dataset.slide); startAuto() }));

                let touchStartX = 0;
                track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true });
                track.addEventListener('touchend', e => {
                    const diff = touchStartX - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) { stopAuto(); goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1); startAuto() }
                }, { passive: true });
            }



            /* ── FAQ ── */
            function toggleFaq(el) {
                const body = el.querySelector('.faq-body');
                const isOpen = el.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-body').classList.remove('open') });
                if (!isOpen) { el.classList.add('open'); body.classList.add('open') }
            }

            /* ── VIDEO SELECTOR ── */
            const videoData = {
                launch: { tag: '<span class="bdaas-text"><span>B</span><span>D</span>aa<span>S</span></span> Launch', title: 'How <span class="bdaas-text"><span>B</span><span>D</span>aa<span>S</span></span> Launch works for<br>Startups &amp; SMEs', url: '' },
                market: { tag: 'Market Enablement', title: 'ICP, Positioning &amp; Go-To-Market<br>Playbook Explained', url: '' },
                bd: { tag: 'BD Enablement', title: 'Outreach Systems, Pipeline &amp;<br>BD Execution in Action', url: '' }
            };
            function selectVideo(type) {
                ['btn-launch', 'btn-market', 'btn-bd'].forEach(id => document.getElementById(id).classList.remove('active'));
                document.getElementById('btn-' + type).classList.add('active');
                const data = videoData[type];
                const box = document.getElementById('value-video-box');
                if (data.url) {
                    box.innerHTML = `<iframe src="${data.url}" allowfullscreen allow="autoplay; fullscreen" style="width:100%;height:100%;border:none"></iframe>`;
                } else {
                    box.innerHTML = `<div class="video-inner"><div class="vpulse"></div><div class="video-tag-pill">${data.tag}</div><div class="play-btn" onclick="handleVideoPlay()"><div class="play-tri"></div></div><span class="vvp-title">${data.title}</span><span class="vvp-label">WATCH VIDEO</span><div class="vpulse"></div></div>`;
                }
            }
            function handleVideoPlay() {
                const btn = document.querySelector('#value-video-box .play-btn');
                if (btn) { btn.style.transform = 'scale(1.2)'; setTimeout(() => btn.style.transform = '', 200) }
            }

            /* ── RESOURCE TABS ── */
            const $tabBtns = $('.resource-tab-btn');
            const $panels = $('.resource-panel');

            if ($tabBtns.length > 0 && $panels.length > 0) {
                $tabBtns.on('click', function () {
                    const $btn = $(this);
                    const targetTab = $btn.attr('data-tab');
                    const $targetPanel = $('#' + targetTab);
                    const $activePanel = $panels.filter('.active');

                    if ($targetPanel.hasClass('active')) return;

                    // Update active button state
                    $tabBtns.removeClass('active');
                    $btn.addClass('active');

                    // Fade transition
                    $activePanel.animate({ opacity: 0 }, 300, function() {
                        $activePanel.removeClass('active').css({ opacity: '' });
                        $targetPanel.css({ opacity: 0 }).addClass('active').animate({ opacity: 1 }, 300, function() {
                            $(this).css({ opacity: '' });
                        });
                    });
                });
            }

            /* ── NAV SCROLL ── */
            $(window).on('scroll', function() {
                $('#mainNav').css('box-shadow', $(window).scrollTop() > 50 ? '0 4px 20px rgba(212,146,26,0.1)' : 'none');
            });

            /* ── SCROLL TRIGGERS & SECTION ANIMATIONS ── */
            window.animateHero = function() {
                const $title = $('.bdaas-hero .hero-h1');
                const $eyebrow = $('.bdaas-hero .hero-eyebrow');
                const $visual = $('.bdaas-hero .hero-visual-card img');
                const $notch = $('.bdaas-hero .notch-caption');
                const $painCards = $('.bdaas-hero .pain-card');
                
                const $heroSection = $('.bdaas-hero');
                $heroSection.addClass('active');

                // Sequence
                $visual.animate({ opacity: 1 }, {
                    step: function(now) {
                        const scale = 0.95 + (0.05 * now);
                        $(this).css('transform', `scale(${scale})`);
                    },
                    duration: 800,
                    complete: function() {
                        $(this).css('transform', '');
                    }
                });

                setTimeout(() => {
                    $eyebrow.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${15 * (1 - now)}px)`); },
                        duration: 600,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 200);

                setTimeout(() => {
                    $title.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                        duration: 600,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 350);

                setTimeout(() => {
                    $notch.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                        duration: 600,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 500);

                $painCards.each(function(i) {
                    const $card = $(this);
                    setTimeout(() => {
                        $card.animate({ opacity: 1 }, {
                            step: function(now) { $(this).css('transform', `translateY(${25 * (1 - now)}px)`); },
                            duration: 600,
                            complete: function() { $(this).css('transform', ''); }
                        });
                    }, 600 + (i * 150));
                });
            };

            function animateEnginesSection($sec) {
                const $enginesHeader = $sec.find('.engines-header');
                const $businessCard = $sec.find('.business-card');
                const $opsCard = $sec.find('.ops-card');
                const $enginesEditorial = $sec.find('.engines-editorial');

                $enginesHeader.animate({ opacity: 1 }, {
                    step: function(now) { $(this).css('transform', `translateY(${30 * (1 - now)}px)`); },
                    duration: 600,
                    complete: function() { $(this).css('transform', ''); }
                });

                setTimeout(() => {
                    $businessCard.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${40 * (1 - now)}px)`); },
                        duration: 700,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 200);

                setTimeout(() => {
                    $opsCard.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${40 * (1 - now)}px)`); },
                        duration: 700,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 350);

                setTimeout(() => {
                    $enginesEditorial.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${30 * (1 - now)}px)`); },
                        duration: 600,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 500);
            }

            function animateStructureSection($sec) {
                const $structureBg = $sec.find('.structure-bg-visual img');
                const $structureInfoBox = $sec.find('.structure-info-box');

                $structureBg.animate({ opacity: 1 }, {
                    step: function(now) {
                        const scale = 1.05 - (0.05 * now);
                        $(this).css('transform', `scale(${scale})`);
                    },
                    duration: 1000,
                    complete: function() { $(this).css('transform', ''); }
                });

                setTimeout(() => {
                    $structureInfoBox.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateX(${-30 * (1 - now)}px)`); },
                        duration: 800,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 200);
            }

            function animateHighlightsSection($sec) {
                const $highlightInfo = $sec.find('.highlight-info-main');
                const $highlightDocCard = $sec.find('.highlight-document-card');

                $highlightInfo.animate({ opacity: 1 }, {
                    step: function(now) { $(this).css('transform', `translateY(${30 * (1 - now)}px)`); },
                    duration: 700,
                    complete: function() { $(this).css('transform', ''); }
                });

                setTimeout(() => {
                    $highlightDocCard.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateX(${30 * (1 - now)}px)`); },
                        duration: 700,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 200);
            }

            function animateResourceSection($sec) {
                const $resourceTabs = $sec.find('.resource-tabs');
                const $resourceContent = $sec.find('.resource-content-area');

                $resourceTabs.animate({ opacity: 1 }, {
                    step: function(now) {
                        const scale = 0.95 + (0.05 * now);
                        $(this).css('transform', `scale(${scale})`);
                    },
                    duration: 600,
                    complete: function() { $(this).css('transform', ''); }
                });

                setTimeout(() => {
                    $resourceContent.animate({ opacity: 1 }, {
                        step: function(now) { $(this).css('transform', `translateY(${30 * (1 - now)}px)`); },
                        duration: 700,
                        complete: function() { $(this).css('transform', ''); }
                    });
                }, 200);
            }

            function animateFaqSection($sec) {
                const $faqLeft = $sec.find('.faq-left');
                const $faqItems = $sec.find('.faq-item');

                $faqLeft.animate({ opacity: 1 }, {
                    step: function(now) { $(this).css('transform', `translateY(${30 * (1 - now)}px)`); },
                    duration: 600,
                    complete: function() { $(this).css('transform', ''); }
                });

                $faqItems.each(function(i) {
                    const $item = $(this);
                    setTimeout(() => {
                        $item.animate({ opacity: 1 }, {
                            step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                            duration: 500,
                            complete: function() { $(this).css('transform', ''); }
                        });
                    }, 150 + (i * 100));
                });
            }

            function jqAnimateSections() {
                var windowBottom = $(window).scrollTop() + $(window).height();

                $('.reveal').each(function () {
                    var $el = $(this);
                    var elementTop = $el.offset().top;

                    if (elementTop < windowBottom - 100) {
                        if (!$el.hasClass('active')) {
                            $el.addClass('active');

                            if ($el.hasClass('engines-section')) {
                                animateEnginesSection($el);
                            } else if ($el.hasClass('structure-section')) {
                                animateStructureSection($el);
                            } else if ($el.hasClass('highlights-section')) {
                                animateHighlightsSection($el);
                            } else if ($el.hasClass('resource-section')) {
                                animateResourceSection($el);
                            } else if ($el.hasClass('faq-section')) {
                                animateFaqSection($el);
                            }
                        }
                    }
                });
            }

            $(window).on('scroll', jqAnimateSections);
            // Initial call to catch elements in view on page load
            setTimeout(jqAnimateSections, 100);
