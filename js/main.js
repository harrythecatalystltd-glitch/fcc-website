// Initialize GSAP ScrollTrigger (only if GSAP is loaded)
if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // 0. Dynamic copyright year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 0b. Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
        // Close on nav link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 0c. Scroll animations for non-GSAP pages
    if (typeof gsap === 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        return; // Skip GSAP-dependent code below
    }

    // 1. Initial Hero Animations with robust staggering
    const heroElements = document.querySelectorAll(".hero .fade-up");
    
    gsap.to(heroElements, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
    });

    // 2. Parallax effect for the hero image
    gsap.to(".hero-img", {
        y: 60,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // 3. Ambient Background slow movement
    gsap.to(".glow-1", {
        x: 100,
        y: 50,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(".glow-2", {
        x: -100,
        y: -50,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 4. ScrollTrigger fading for upcoming sections
    const scrollElements = document.querySelectorAll("section:not(.hero) .fade-up, .partners.fade-up");
    
    scrollElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
    });
    
    // 5. Card Hover Tilt Effects (Glassmorphism pop)
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // 6. Header blur handling
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(10, 12, 16, 0.8)";
            header.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.5)";
        } else {
            header.style.background = "rgba(10, 12, 16, 0.5)";
            header.style.boxShadow = "none";
        }
    });

    // 7. Quiz Logic
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const progressBar = document.getElementById('quiz-progress-bar');
    let currentStep = 1;
    const quizAnswers = {};

    quizBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStepEl = e.target.closest('.quiz-step');
            const nextStepId = e.target.getAttribute('data-next');
            const answer = e.target.getAttribute('data-answer');

            // Store answer keyed by step ID
            if (answer) quizAnswers[currentStepEl.id] = answer;

            // Hide current step
            currentStepEl.classList.remove('active');

            // Show next step
            document.getElementById(nextStepId).classList.add('active');

            // Update Progress Bar
            currentStep++;
            const totalSteps = 5; // Up to Lead Capture (Step 5)
            const progress = (currentStep / totalSteps) * 100;
            if(progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    });

    // Handle final Form Submit — compute course recommendation and show results
    const quizForm = document.getElementById('quiz-lead-form');
    if(quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Determine recommendation from stored answers
            const studyTime = quizAnswers['step-3'] || '';
            const edinburgh = quizAnswers['step-4'] || '';

            let scoreLabel, courseName, courseDesc, courseUrl;

            if (edinburgh === 'edinburgh-no') {
                scoreLabel  = 'Flexible Fit';
                courseName  = 'Online Personal Trainer Course';
                courseDesc  = 'Study fully at your own pace, from anywhere in the UK. Complete Level 2 & 3 qualification, CIMSPA-endorsed, 0% finance available. Practical assessment completed remotely.';
                courseUrl   = '/online-personal-trainer-course-edinburgh/';
            } else if (studyTime === 'study-high') {
                scoreLabel  = 'Fast-Track Ready';
                courseName  = 'Fast-Track Personal Trainer Course';
                courseDesc  = 'Our most intensive qualification route. Designed for those ready to commit and qualify quickly. Practical days at Platform Health & Fitness, Edinburgh. CIMSPA-endorsed, 0% finance available.';
                courseUrl   = '/fast-track-personal-trainer-course-edinburgh/';
            } else {
                scoreLabel  = 'Academy Fit';
                courseName  = 'Level 3 Hybrid Personal Trainer Course';
                courseDesc  = 'The flagship FCC programme. Self-paced online theory combined with practical workshop days at our Edinburgh gym. CIMSPA-endorsed, 0% finance available.';
                courseUrl   = '/level-3-pt-course-edinburgh/';
            }

            // Inject into results screen
            const scoreLabelEl = document.getElementById('quiz-score-label');
            const courseNameEl = document.getElementById('quiz-course-name');
            const courseDescEl = document.getElementById('quiz-course-desc');
            const courseLinkEl = document.getElementById('quiz-course-link');

            if (scoreLabelEl) scoreLabelEl.textContent = scoreLabel;
            if (courseNameEl) courseNameEl.textContent = courseName;
            if (courseDescEl) courseDescEl.textContent = courseDesc;
            if (courseLinkEl) courseLinkEl.href = courseUrl;

            document.getElementById('step-5').classList.remove('active');
            document.getElementById('step-6').classList.add('active');
            if(progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.backgroundColor = '#1ee6fd';
            }
        });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
