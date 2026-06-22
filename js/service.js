/* ══════════════════════════════════════════
   DATAiLLAM — Service Page Scripts
   ══════════════════════════════════════════ */

$(document).ready(function () {

    // ── Toggle: Market Enablement / BD Enablement ──
    $('.toggle-btn').on('click', function () {
        var target = $(this).data('target');

        $('.toggle-btn').removeClass('active');
        $(this).addClass('active');

        $('.timeline-panel').removeClass('active');
        var $panel = $('#panel-' + target);
        $panel.addClass('active');

        // Staggered re-animate cards
        $panel.find('.fade-up').each(function (i) {
            var $el = $(this);
            $el.removeClass('visible');
            setTimeout(function () {
                $el.addClass('visible');
            }, i * 90);
        });
    });

    // ── FAQ Accordion ──
    $('.faq-item').on('click', function () {
        var wasOpen = $(this).hasClass('open');
        $('.faq-item').removeClass('open');
        if (!wasOpen) {
            $(this).addClass('open');
        }
    });


    // ── Navbar scroll shadow (Standard) ──
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 30) {
            $('#mainNav').css({
                'box-shadow': '0 4px 20px rgba(212,146,26,0.1)',
                'background': 'rgba(246, 240, 226, 1)'
            });
        } else {
            $('#mainNav').css({
                'box-shadow': 'none',
                'background': 'rgba(246, 240, 226, 0.98)'
            });
        }
    });

    // ── Scroll-triggered fade-in ──
    function revealOnScroll() {
        var windowBottom = $(window).scrollTop() + $(window).height();
        $('.fade-up').each(function () {
            var elTop = $(this).offset().top;
            if (elTop < windowBottom - 50) {
                $(this).addClass('visible');
            }
        });
    }

    $(window).on('scroll', revealOnScroll);

    // Initial reveal for elements already in viewport
    revealOnScroll();

    // ── Smooth scroll for anchor links ──
    $('a[href^="#"]').on('click', function (e) {
        var targetSelector = $(this).attr('href');
        if (targetSelector.length > 1) {
            var targetEl = document.querySelector(targetSelector);
            if (targetEl) {
                e.preventDefault();
                // Stop any ongoing jQuery animations on html/body
                $('html, body').stop(true);
                
                // Calculate dynamic heights and positions
                var navHeight = document.getElementById('mainNav') ? document.getElementById('mainNav').offsetHeight : 70;
                var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                var elementOffsetTop = targetEl.getBoundingClientRect().top + scrollTop;
                var elementHeight = targetEl.offsetHeight;
                var viewportHeight = window.innerHeight;
                var availableHeight = viewportHeight - navHeight;
                
                // Always center the element vertically in the remaining space of the viewport
                var targetPosition = elementOffsetTop - navHeight - (availableHeight - elementHeight) / 2;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // ══════════════════════════════════════
    // ENGAGEMENT TIMELINE ANIMATION (jQuery)
    // ══════════════════════════════════════

    // Set initial hidden states
    $('.timeline-line').css({ width: '0%', left: '0' });
    $('.timeline-node').css({ opacity: 0, transform: 'scale(0)' });
    $('.timeline-connector').css({ height: 0 });
    $('.phase-card').css({ opacity: 0, transform: 'translateY(40px)' });

    var timelineAnimated = {};

    function animateTimeline($panel) {
        var panelId = $panel.attr('id');
        if (timelineAnimated[panelId]) return;
        timelineAnimated[panelId] = true;

        var $line = $panel.find('.timeline-line');
        var $nodes = $panel.find('.timeline-node');
        var $cards = $panel.find('.phase-card');

        // Check if timeline track is visible (not hidden on mobile)
        if ($panel.find('.timeline-track').is(':visible')) {
            // Step 1: Grow the horizontal line
            $line.animate({ width: '100%' }, 800, 'swing', function () {
                // Step 2: Pop in dots sequentially
                $nodes.each(function (i) {
                    var $node = $(this);
                    setTimeout(function () {
                        $node.css({
                            opacity: 1,
                            transform: 'scale(1)',
                            transition: 'all 0.5s cubic-bezier(.16,1,.3,1)'
                        });

                        // Step 3: Drop connector line from each dot
                        setTimeout(function () {
                            $node.find('.timeline-connector').css({
                                height: '40px',
                                transition: 'height 0.4s cubic-bezier(.16,1,.3,1)'
                            });
                        }, 200);

                        // Step 4: Slide up corresponding card
                        setTimeout(function () {
                            $cards.eq(i).css({
                                opacity: 1,
                                transform: 'translateY(0)',
                                transition: 'all 0.6s cubic-bezier(.16,1,.3,1)'
                            });
                        }, 350);

                    }, i * 250);
                });
            });
        } else {
            // Mobile/Tablet: Just show cards immediately or with a simple stagger
            $cards.each(function (i) {
                var $card = $(this);
                setTimeout(function () {
                    $card.css({
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.6s var(--ease)'
                    });
                }, i * 100);
            });
        }
    }

    // Trigger animation when engagement section scrolls into view
    function checkTimelineVisibility() {
        var $engagement = $('#engagement');
        if (!$engagement.length) return;

        var windowBottom = $(window).scrollTop() + $(window).height();
        var sectionTop = $engagement.offset().top + 200;

        if (windowBottom > sectionTop) {
            var $activePanel = $engagement.find('.timeline-panel.active');
            if ($activePanel.length) {
                animateTimeline($activePanel);
            }
        }
    }

    $(window).on('scroll', checkTimelineVisibility);
    checkTimelineVisibility(); // Check on load

    // Re-animate on tab toggle
    var originalToggleHandler = null;
    $('.toggle-btn').off('click').on('click', function () {
        var target = $(this).data('target');

        $('.toggle-btn').removeClass('active');
        $(this).addClass('active');

        $('.timeline-panel').removeClass('active');
        var $panel = $('#panel-' + target);
        $panel.addClass('active');

        // Reset animation states for this panel
        $panel.find('.timeline-line').css({ width: '0%' });
        $panel.find('.timeline-node').css({ opacity: 0, transform: 'scale(0)' });
        $panel.find('.timeline-connector').css({ height: 0 });
        $panel.find('.phase-card').css({ opacity: 0, transform: 'translateY(40px)' });

        // Remove from animated cache so it re-animates
        timelineAnimated[$panel.attr('id')] = false;

        // Short delay then trigger animation
        setTimeout(function () {
            animateTimeline($panel);
        }, 100);

        // Staggered re-animate fade-up elements
        $panel.find('.fade-up').each(function (i) {
            var $el = $(this);
            $el.removeClass('visible');
            setTimeout(function () {
                $el.addClass('visible');
            }, i * 90);
        });
    });

    // Hero animations are now handled by the .fade-up class and CSS transition delays.
});
