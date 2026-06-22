$(document).ready(function () {
    
    // ── Hero Section Entrance Animation ──
    function animateHero() {
        const $title = $('.hero-title');
        const $textBlock = $('.text-content-wrap');
        const $visualBlock = $('.visual-blob-card');
        const $desc = $('.hero-desc');
        const $descEmp = $('.hero-desc-emphasis');
        const $actions = $('.hero-actions-new');

        // Set initial states
        $title.css({ opacity: 0, transform: 'translateY(30px)' });
        $desc.css({ opacity: 0, transform: 'translateY(20px)' });
        $descEmp.css({ opacity: 0, transform: 'translateY(20px)' });
        $actions.css({ opacity: 0, transform: 'translateY(20px)' });
        $textBlock.css({ opacity: 0, transform: 'translateX(-50px)' });
        $visualBlock.css({ opacity: 0, transform: 'scale(0.8) rotate(-5deg)', transition: 'none' });

        // 1. Heading
        setTimeout(() => {
            $title.animate({ opacity: 1 }, {
                step: function(now, fx) {
                    $(this).css('transform', `translateY(${30 * (1 - now)}px)`);
                },
                duration: 600
            });
        }, 100);

        // 2. Image Card (Visual Block)
        setTimeout(() => {
            $visualBlock.animate({ opacity: 1 }, {
                step: function(now, fx) {
                    const scale = 0.8 + (0.2 * now);
                    const rotate = -5 * (1 - now);
                    $(this).css('transform', `scale(${scale}) rotate(${rotate}deg)`);
                },
                duration: 800,
                complete: function() {
                    // Re-enable CSS transitions after entrance animation is done
                    $(this).css('transition', '');
                }
            });
        }, 300);

        // 3. Descriptions (Staggered)
        setTimeout(() => {
            $desc.animate({ opacity: 1 }, {
                step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                duration: 600
            });
        }, 300);

        setTimeout(() => {
            $descEmp.animate({ opacity: 1 }, {
                step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                duration: 600
            });
        }, 400);

        // 4. Buttons
        setTimeout(() => {
            $actions.animate({ opacity: 1 }, {
                step: function(now) { $(this).css('transform', `translateY(${20 * (1 - now)}px)`); },
                duration: 600
            });
        }, 500);
    }

    animateHero();

    // ── jQuery Section & Text Animations ──
    function jqAnimateSections() {
        var windowBottom = $(window).scrollTop() + $(window).height();

        $('.reveal').each(function () {
            var $el = $(this);
            var elementTop = $el.offset().top;

            if (elementTop < windowBottom - 100) {
                if (!$el.hasClass('active')) {
                    // 1. Transaction Animation: trigger CSS transition
                    $el.addClass('active');

                    // 2. Text Animation: Stagger inner text elements if it's a section heading or block
                    if ($el.is('.text-center, .col-lg-6, .col-lg-5')) {
                        var delay = 100;
                        $el.find('h1, h2, h3, p, .mission-pill').each(function () {
                            var $text = $(this);
                            // Store original styles
                            if (!$text.data('animated')) {
                                $text.data('animated', true);
                                $text.css({ opacity: 0, position: 'relative', left: '-20px' });
                                
                                setTimeout(function () {
                                    $text.animate({ opacity: 1, left: '0px' }, 600, 'swing');
                                }, delay);
                                delay += 200; // stagger effect
                            }
                        });
                    }
                }
            }
        });
    }

    $(window).on('scroll', jqAnimateSections);
    // Initial call with slight delay to ensure DOM readiness
    setTimeout(jqAnimateSections, 100);

    // ── Journey Section Specific Animation ──
    function animateJourneySection() {
        var $section = $('.journey-section');
        if ($section.length && !$section.data('animated')) {
            var windowBottom = $(window).scrollTop() + $(window).height();
            var sectionTop = $section.offset().top;

            if (sectionTop < windowBottom - 200) {
                $section.data('animated', true);
                
                // Animate Visual Box
                $('.journey-visual-frame').css({ opacity: 0, transform: 'scale(0.9) translateX(-30px)' })
                    .animate({ opacity: 1 }, {
                        step: function(now) {
                            var scale = 0.9 + (0.1 * now);
                            var trans = -30 * (1 - now);
                            $(this).css('transform', `scale(${scale}) translateX(${trans}px)`);
                        },
                        duration: 1000
                    });

                // Animate Timeline
                $('.vertical-timeline').css({ opacity: 0 });
                $('.vertical-timeline').animate({ opacity: 1 }, 1200);

                // Animate Content
                $('.journey-slide.active .journey-content-new').css({ opacity: 0, transform: 'translateX(30px)' })
                    .animate({ opacity: 1 }, {
                        step: function(now) {
                            var trans = 30 * (1 - now);
                            $(this).css('transform', `translateX(${trans}px)`);
                        },
                        duration: 1000
                    });
            }
        }
    }
    $(window).on('scroll', animateJourneySection);
    setTimeout(animateJourneySection, 500);



    // ── Nav Scroll Behavior (Standard) ──
    $(window).on('scroll', function() {
        var nav = $('#mainNav');
        if ($(window).scrollTop() > 50) {
            nav.css({
                'box-shadow': '0 4px 20px rgba(212, 146, 26, 0.1)',
                'background': 'rgba(246, 240, 226, 1)'
            });
        } else {
            nav.css({
                'box-shadow': 'none',
                'background': 'rgba(246, 240, 226, 0.98)'
            });
        }
    });

    // ── Smooth Anchor Scrolling ──
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });


    // ── Button Press Effects ──
    $('.btn-custom-red, .btn-custom-outline, .btn-enquire').on('mousedown', function () {
        $(this).css('transform', 'scale(0.95)');
    }).on('mouseup mouseleave', function () {
        $(this).css('transform', 'scale(1)');
    });


    // ── Team Image Hover ──
    $('.team-img').hover(
        function () { $(this).css({ 'transform': 'scale(1.05)', 'transition': '0.3s' }); },
        function () { $(this).css('transform', 'scale(1)'); }
    );





    // ═══════════════════════════════════════════════
    // JOURNEY CAROUSEL — Auto-play + Click Control
    // ═══════════════════════════════════════════════
    var slideOrder = [
        'slide-2020-feb',
        'slide-2020-july',
        'slide-2023-dec',
        'slide-2026-april'
    ];
    var currentIndex = 0; // Start at FEB 2020
    var autoInterval = null;
    var AUTOPLAY_DELAY = 4000; // 4 seconds per slide

    function updateTimeline(index) {
        // Update active dot
        $('.timeline-point').removeClass('active');
        $('.timeline-point[data-index="' + index + '"]').addClass('active');

        // Update progress bar width/height
        var totalPoints = slideOrder.length;
        var progressPercent = (index / (totalPoints - 1)) * 100;
        
        // Horizontal Timeline (All viewports)
        $('#timelineProgress').css('width', progressPercent + '%');
    }

    function goToSlide(index, animate) {
        if (index === currentIndex && animate) return;
        
        const $current = $('.journey-slide.active');
        const $next = $('#' + slideOrder[index]);
        const nextImg = $next.data('img');
        const $logoImg = $('.journey-logo');

        currentIndex = index;
        updateTimeline(index);

        if (animate) {
            // 1. Prepare next slide (hidden but positioned)
            $next.addClass('preparing'); 
            
            // 2. Start Transition
            // Fade out current
            $current.removeClass('active').addClass('exiting');
            
            // Fade in logo & next content
            $logoImg.css({ opacity: 0, transform: 'scale(0.95)' });
            
            setTimeout(() => {
                $logoImg.attr('src', nextImg).css({ opacity: 1, transform: 'scale(1)' });
                $next.removeClass('preparing').addClass('active');
                
                // Cleanup after transition
                setTimeout(() => {
                    $current.removeClass('exiting');
                    jqAnimateSections();
                }, 600);
            }, 50);
        } else {
            $('.journey-slide').removeClass('active');
            $next.addClass('active');
            $logoImg.attr('src', nextImg);
            jqAnimateSections();
        }
    }

    function nextSlide() {
        var next = (currentIndex + 1) % slideOrder.length;
        goToSlide(next, true);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }

    // Timeline point click
    $('.timeline-point').on('click', function () {
        var index = parseInt($(this).data('index'));
        goToSlide(index, true);
        // Restart autoplay from this point
        startAutoPlay();
    });

    // Initialize: show first slide, set timeline
    goToSlide(0, false);
    
    var journeyObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }, { threshold: 0.2 });
    var jcNode = document.getElementById('journeyCarousel');
    if (jcNode) journeyObserver.observe(jcNode);

    // Pause autoplay on hover
    $('#journeyCarousel, .timeline-wrapper').on('mouseenter', function () {
        stopAutoPlay();
    }).on('mouseleave', function () {
        startAutoPlay();
    });


    // ═══════════════════════════════════════════════
    // TEAM CAROUSEL — 3 Card Center-Focus
    // ═══════════════════════════════════════════════
    var $teamCards = $('.team-card');
    var teamCount = $teamCards.length;
    var activeTeam = 0;
    var teamAutoInterval = null;
    var TEAM_DELAY = 5000; // 5 seconds

    function setActiveTeam(index) {
        activeTeam = index;
        $teamCards.removeClass('active');
        $teamCards.eq(index).addClass('active');

        // Reorder cards in DOM so active is always visually centered
        var $carousel = $('#teamCarousel');
        var order = [];

        // Calculate: prev, active, next
        var prev = (index - 1 + teamCount) % teamCount;
        var next = (index + 1) % teamCount;

        $teamCards.eq(prev).css('order', '1');
        $teamCards.eq(index).css('order', '2');
        $teamCards.eq(next).css('order', '3');
    }

    function nextTeam() {
        var next = (activeTeam + 1) % teamCount;
        setActiveTeam(next);
    }

    function startTeamAuto() {
        stopTeamAuto();
        teamAutoInterval = setInterval(nextTeam, TEAM_DELAY);
    }

    function stopTeamAuto() {
        if (teamAutoInterval) {
            clearInterval(teamAutoInterval);
            teamAutoInterval = null;
        }
    }

    // Click any card to focus it
    $teamCards.on('click', function () {
        var idx = parseInt($(this).data('index'));
        setActiveTeam(idx);
        startTeamAuto();
    });

    // Initialize
    setActiveTeam(0);
    
    var teamObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            startTeamAuto();
        } else {
            stopTeamAuto();
        }
    }, { threshold: 0.2 });
    var tcNode = document.getElementById('teamCarousel');
    if (tcNode) teamObserver.observe(tcNode);

    // Pause on hover
    $('#teamCarousel').on('mouseenter', function () {
        stopTeamAuto();
    }).on('mouseleave', function () {
        startTeamAuto();
    });

});
