'use strict';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = window.matchMedia('(hover: none)').matches;



/* ══════════════════════════════════════
   NAV SCROLL (standard)
   ══════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(212,146,26,0.1)';
        nav.style.background = 'rgba(241,233,216,1)';
    } else {
        nav.style.boxShadow = 'none';
        nav.style.background = 'rgba(241,233,216,0.97)';
    }
}, { passive: true });

/* ══════════════════════════════════════
   HERO ENTRANCE ANIMATION (jQuery)
   ══════════════════════════════════════ */
function initHeroJQuery() {
    if (reduced) {
        $('#chTitle, #chBody, .ch-actions').css({ opacity: 1, transform: 'none' });
        return;
    }

    const title = $('#chTitle');
    const body = $('#chBody');
    const actions = $('.ch-actions');

    // Initial state
    $(title).css({ opacity: 0, transform: 'translateY(30px)' });
    $(body).css({ opacity: 0, transform: 'translateY(30px)' });
    $(actions).css({ opacity: 0, transform: 'translateY(30px)' });

    // Animate sequence
    setTimeout(() => {
        title.css({ transition: 'all 0.8s ease-out' }).css({ opacity: 1, transform: 'translateY(0)' });

        setTimeout(() => {
            body.css({ transition: 'all 0.8s ease-out' }).css({ opacity: 1, transform: 'translateY(0)' });
        }, 200);

        setTimeout(() => {
            actions.css({ transition: 'all 0.8s ease-out' }).css({ opacity: 1, transform: 'translateY(0)' });
        }, 400);
    }, 200);
}

$(document).ready(initHeroJQuery);

/* ══════════════════════════════════════
   INFO CARD ANIMATIONS (scroll-triggered)
   ══════════════════════════════════════ */
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-anim');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = parseInt(card.dataset.delay || 0);
                setTimeout(() => {
                    card.classList.add('animated');
                }, delay);
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));

    // GSAP 3D tilt removed as per "fixed state" request
}
initCardAnimations();

/* ══════════════════════════════════════
   SCROLL REVEALS (.reveal → .in-view)
   ══════════════════════════════════════ */
(function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (reduced) {
        revealEls.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('in-view'), (i % 4) * 80);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════
   FAQ TOGGLE
   ══════════════════════════════════════ */
function toggleFaq(btn) {
    const item = $(btn).closest('.faq-item');
    const wasOpen = item.hasClass('open');

    // Close other items
    $('.faq-item.open').removeClass('open').find('.faq-a').slideUp(300);

    if (!wasOpen) {
        item.addClass('open').find('.faq-a').slideDown(300);
    }
}
window.toggleFaq = toggleFaq;

/* ══════════════════════════════════════
   BACK TO TOP
   ══════════════════════════════════════ */
const btt = document.getElementById('btt');
if (btt) {
    window.addEventListener('scroll', () => {
        btt.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
}

/* ══════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   ══════════════════════════════════════ */
$('a[href^="#"]').on('click', function (e) {
    const href = $(this).attr('href');
    if (href === '#') return;
    const target = $(href);
    if (!target.length) return;
    e.preventDefault();
    $('html, body').animate({
        scrollTop: target.offset().top - 90
    }, reduced ? 0 : 800);
});

/* ══════════════════════════════════════
   ROAD TIMELINE SCROLL-JACKING (Vanilla JS)
   ══════════════════════════════════════ */
(function () {
    var section, timeline, container, overflow;

    function init() {
        section   = document.querySelector('.contact-journey-section');
        timeline  = document.getElementById('roadTimeline');
        container = document.querySelector('.timeline-container');

        if (!section || !timeline || !container) return;

        // Use ResizeObserver to catch any height changes (like late-loading images)
        if (window.ResizeObserver) {
            new ResizeObserver(measure).observe(timeline);
        }

        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
    }

    function measure() {
        timeline.style.transform = 'translateY(0)';
        void timeline.offsetHeight; // force reflow

        var timelineH  = timeline.getBoundingClientRect().height;
        var containerH = container.getBoundingClientRect().height;

        overflow = Math.max(0, timelineH - containerH + 40);
        
        // If there's no overflow, just make section normal height
        if (overflow <= 0) {
            section.style.height = 'auto';
        } else {
            section.style.height = (window.innerHeight + overflow) + 'px';
        }
        
        onScroll();
    }

    function onScroll() {
        if (!overflow || overflow <= 0) {
            timeline.style.transform = 'translateY(0)';
            return;
        }

        var rect     = section.getBoundingClientRect();
        var progress = -rect.top / overflow;

        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        timeline.style.transform = 'translateY(' + -(progress * overflow) + 'px)';
    }

    if (document.readyState === 'complete') {
        setTimeout(init, 50);
    } else {
        window.addEventListener('load', function () {
            setTimeout(init, 50);
        });
    }
})();


/* ══════════════════════════════════════
   CONTACT FORM — EmailJS
   ══════════════════════════════════════ */
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

    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) }
    function isCompanyEmail(v) {
        if (!isValidEmail(v)) return false;
        return !PERSONAL_DOMAINS.has(v.trim().split('@')[1].toLowerCase());
    }

    function validateField(f) {
        const val = f.value.trim();
        let ok = true, errMsg = '';
        const wrap = $(f).closest('.field-wrap');
        const errSpan = wrap.find('.field-error-msg');

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

        if (errSpan.length && errMsg) errSpan.text(errMsg);
        $(f).toggleClass('is-err', !ok);
        $(f).toggleClass('is-good', ok && val.length > 0);

        if (!ok && !reduced && wrap.length && document.activeElement === f) {
            // jQuery Shake
            wrap.animate({ marginLeft: '-5px' }, 50)
                .animate({ marginLeft: '5px' }, 50)
                .animate({ marginLeft: '-5px' }, 50)
                .animate({ marginLeft: '5px' }, 50)
                .animate({ marginLeft: '0px' }, 50);
        }
        return ok;
    }

    const allInputs = form.querySelectorAll('.fl-input, .fl-select');

    allInputs.forEach(f => {
        const evt = f.tagName === 'SELECT' ? 'change' : 'blur';
        f.addEventListener(evt, e => { validateField(f); if (f.tagName === 'SELECT') syncSelect(f); });
        if (f.tagName !== 'SELECT') {
            f.addEventListener('input', e => { if (f.classList.contains('is-err')) validateField(f); });
        }
    });

    function syncSelect(sel) {
        const hasVal = sel.value !== '';
        $(sel).toggleClass('has-value', hasVal);
        $(sel).toggleClass('placeholder-selected', !hasVal);
    }
    form.querySelectorAll('select').forEach(syncSelect);

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const lastSub = localStorage.getItem('dataillam_form_sent');
        if (lastSub && Date.now() - parseInt(lastSub) < 1000 * 60 * 60 * 24) {
            if (stat) { $(stat).text('We already received your message. We\'ll be in touch shortly.').css('color', 'var(--red)'); }
            return;
        }

        let allOk = true;
        allInputs.forEach(f => { if (!validateField(f)) allOk = false; });
        form.querySelectorAll('select').forEach(syncSelect);

        if (!allOk) {
            if (!reduced) {
                $(form).animate({ marginLeft: '-5px' }, 50)
                    .animate({ marginLeft: '5px' }, 50)
                    .animate({ marginLeft: '0' }, 50);
            }
            if (stat) { $(stat).text('Please fix the errors above.').css('color', 'var(--red)'); }
            return;
        }

        $(btnS).addClass('loading').prop('disabled', true);
        if (success) $(success).removeClass('show');
        if (stat) $(stat).text('');

        const params = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: 'New Business Inquiry from DATAiLLAM Contact Form',
            from_name: 'DATAiLLAM Website',
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
                $(btnS).removeClass('loading').addClass('success').find('.btn-txt').text('Sent ✓');
                if (success) $(success).addClass('show');
                localStorage.setItem('dataillam_form_sent', Date.now().toString());

                // Reset form fields immediately
                form.reset();
                $(allInputs).removeClass('is-err is-good');
                form.querySelectorAll('select').forEach(syncSelect);

                setTimeout(() => {
                    $(btnS).removeClass('success loading').prop('disabled', false).find('.btn-txt').text('Send Message');
                    if (success) $(success).removeClass('show');
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to send.');
            }

        } catch (err) {
            $(btnS).removeClass('loading').prop('disabled', false);
            const msg = err?.message ? `Send failed: ${err.message}` : 'Failed to send. Please try again or email us directly.';
            if (stat) { $(stat).text(msg).css('color', 'var(--red)'); }
        }
    });
})();