/* ════════════════════════════════
   UNIFIED NAVBAR JAVASCRIPT
   ════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger') || document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mainNav = document.getElementById('mainNav');

    // 1. Mobile Menu Toggle Logic
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') || mobileMenu.classList.contains('open')) {
                if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                    // Clear any leftover inline styles defensively
                    hamburger.querySelectorAll('span').forEach(s => {
                        s.style.transform = '';
                        s.style.opacity = '';
                    });
                }
            }
        });

        // Close mobile menu when clicking a link inside it
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                // Clear any leftover inline styles defensively
                hamburger.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            });
        });
    }

    // 2. Active Page Highlighting Logic
    function highlightActivePage() {
        const currentPath = window.location.pathname.toLowerCase();
        let pageName = 'home';
        
        if (currentPath.includes('/about')) {
            pageName = 'about';
        } else if (currentPath.includes('/service')) {
            pageName = 'service';
        } else if (currentPath.includes('/bdaas')) {
            pageName = 'bdaas';
        } else if (currentPath.includes('/contact')) {
            pageName = 'contact';
        }

        // Clear active class from all nav & mob links first
        document.querySelectorAll('.nav-link, .mob-link').forEach(l => l.classList.remove('active'));

        // Find all links with data-page attribute matching current page
        const navLinks = document.querySelectorAll(`.nav-link[data-page="${pageName}"]`);
        const mobLinks = document.querySelectorAll(`.mob-link[data-page="${pageName}"]`);

        navLinks.forEach(link => link.classList.add('active'));
        mobLinks.forEach(link => link.classList.add('active'));
    }

    highlightActivePage();

    // 2b. Internal Page Navigation Click Feedback
    const allInternalLinks = document.querySelectorAll('a[href]');
    allInternalLinks.forEach(btn => {
        btn.addEventListener('click', function() {
            const rawHref = this.getAttribute('href') || '';
            const href = rawHref.trim().toLowerCase();

            // Ignore external links, anchor targets, mailto, tel, and blank targets
            if (
                !href ||
                href.startsWith('http://') ||
                href.startsWith('https://') ||
                href.startsWith('//') ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                this.getAttribute('target') === '_blank'
            ) {
                return; // External or non-nav link: do NOT alter active navbar indicator!
            }

            let targetPage = '';
            if (href.includes('/about') || href.includes('about/')) {
                targetPage = 'about';
            } else if (href.includes('/service') || href.includes('service/')) {
                targetPage = 'service';
            } else if (href.includes('/bdaas') || href.includes('bdaas/')) {
                targetPage = 'bdaas';
            } else if (href.includes('/contact') || href.includes('contact/')) {
                targetPage = 'contact';
            } else if (href === '../' || href === './' || href === '/' || href.includes('index.html')) {
                targetPage = 'home';
            }

            if (targetPage) {
                document.querySelectorAll('.nav-link, .mob-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll(`.nav-link[data-page="${targetPage}"]`).forEach(l => l.classList.add('active'));
                document.querySelectorAll(`.mob-link[data-page="${targetPage}"]`).forEach(l => l.classList.add('active'));
            }
        });
    });

    // 3. Scroll shadow logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // 4. Resize logic to close mobile menu if switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100) {
            if (mobileMenu && (mobileMenu.classList.contains('active') || mobileMenu.classList.contains('open'))) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
            if (hamburger) {
                // Defensively clear any inline styles on hamburger spans that other scripts might have set
                hamburger.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            }
        }
    });
});
