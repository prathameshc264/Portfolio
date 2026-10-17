/* ============================================================
   PORTFOLIO JAVASCRIPT — Prathamesh Chavan
   Navigation, typing animation, scroll reveals, counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ── Navbar Scroll Effect ──────────────────────────────────
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const sections = document.querySelectorAll('.section, .hero');

    function handleNavScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ── Mobile Nav Toggle ─────────────────────────────────────
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });

    // ── Active Nav Link on Scroll ─────────────────────────────
    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;
        const allNavLinks = navLinks.querySelectorAll('a:not(.nav-cta)');

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ── Typing Animation ──────────────────────────────────────
    const roles = [
        'AI/ML Engineer',
        'Data Scientist',
        'Machine Learning Developer',
        'Python & Data Specialist'
    ];

    const heroRole = document.getElementById('heroRole');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            heroRole.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else {
                typingSpeed = 80;
            }
        } else {
            heroRole.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before next word
            } else {
                typingSpeed = 40;
            }
        }

        setTimeout(typeRole, typingSpeed);
    }

    typeRole();

    // ── Scroll Reveal Animation ───────────────────────────────
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Respect animation-delay set via inline style
                const delay = entry.target.style.animationDelay || '0s';
                const delayMs = parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delayMs);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Counter Animation ─────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, 0, count, 1500);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ── Score Bar Animation ───────────────────────────────────
    const scoreFills = document.querySelectorAll('.score-fill');

    const scoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                // The width is already set via inline style
                // We just need to trigger the animation
                const targetWidth = fill.style.width;
                fill.style.width = '0%';

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        fill.style.width = targetWidth;
                    });
                });

                scoreObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    scoreFills.forEach(el => scoreObserver.observe(el));

    // ── Smooth Scroll for Anchor Links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-height'));
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Keyboard Accessibility ────────────────────────────────
    // Allow Enter/Space to trigger nav toggle
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });
});
