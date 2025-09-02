document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const currentYearSpan = document.getElementById('current-year');
    const backToTopBtn = document.querySelector('.back-to-top');
    const statCounters = document.querySelectorAll('.stat-number');
    const projectFilterChips = document.querySelectorAll('.filter-chip');
    const projectsGrid = document.getElementById('projects-grid');
    const projectSearchInput = document.getElementById('project-search');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const toggleSkillsBtn = document.getElementById('toggle-skills');
    const skillsContainer = document.getElementById('skills-container');
    const skillFilterInput = document.getElementById('skill-filter');
    const copyEmailBtn = document.getElementById('copy-email');
    const emailLink = document.getElementById('email-link');
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    // Smooth Scroll & Active Link Highlighting
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call

    // Mobile Navigation
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
        const isExpanded = menuToggle.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Dark/Light Theme Toggle
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    const setTheme = (theme) => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-sun', theme === 'dark');
        icon.classList.toggle('fa-moon', theme === 'light');
        localStorage.setItem('theme', theme);
    };

    if (currentTheme) {
        setTheme(currentTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Dynamic Current Year
    currentYearSpan.textContent = new Date().getFullYear();

    // Back to Top Button
    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    window.addEventListener('scroll', toggleBackToTop);

    // Intersection Observer for Animations & Counters
    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('hero-stats')) {
                    startCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll, .about-bio, .about-card, .hero-title, .hero-subtitle, .hero-buttons, .hero-stats').forEach(el => {
        animateOnScroll.observe(el);
    });

    // Animated Counters
    const startCounters = () => {
        statCounters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-count');
                const count = +counter.innerText;
                const increment = target / 200; // Adjust speed here

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Lazy Loading Images
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.onload = () => {
                    img.removeAttribute('data-src');
                };
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.lazy-image').forEach(img => {
        lazyLoadObserver.observe(img);
    });

    // Project Filtering
    const filterProjects = (filter) => {
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            const tags = card.getAttribute('data-tags').split(' ');
            const isVisible = filter === 'all' || tags.includes(filter);
            card.style.display = isVisible ? 'flex' : 'none';
        });
    };

    projectFilterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            projectFilterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterProjects(chip.getAttribute('data-filter'));
        });
    });

    // Project Search
    projectSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            const tags = card.getAttribute('data-tags').toLowerCase();
            const stack = card.getAttribute('data-stack').toLowerCase();
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const isMatch = title.includes(searchTerm) || tags.includes(searchTerm) || stack.includes(searchTerm);
            card.style.display = isMatch ? 'flex' : 'none';
        });
    });

    // Skill Accordions
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                content.classList.remove('open');
                header.setAttribute('aria-expanded', 'false');
            } else {
                content.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Toggle All Skills
    toggleSkillsBtn.addEventListener('click', () => {
        const isCollapsed = toggleSkillsBtn.textContent === 'Collapse All';
        accordionHeaders.forEach(header => {
            const content = header.nextElementSibling;
            if (isCollapsed) {
                content.classList.remove('open');
                header.setAttribute('aria-expanded', 'false');
            } else {
                content.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        });
        toggleSkillsBtn.textContent = isCollapsed ? 'Show All' : 'Collapse All';
    });

    // Skill Filter
    skillFilterInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        skillsContainer.querySelectorAll('.skill-item').forEach(skill => {
            const skillName = skill.querySelector('.skill-name').textContent.toLowerCase();
            if (skillName.includes(searchTerm)) {
                skill.style.display = 'flex';
            } else {
                skill.style.display = 'none';
            }
        });
    });

    // Copy Email Functionality
    copyEmailBtn.addEventListener('click', () => {
        const email = emailLink.textContent.trim();
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!', 'success');
        }).catch(err => {
            showToast('Failed to copy email.', 'error');
            console.error('Failed to copy email: ', err);
        });
    });

    // Contact Form Validation & Submission
    const showToast = (message, type) => {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = document.getElementById('submit-btn');

        if (!name || !email || !message) {
            showToast('Please fill out all fields.', 'error');
            return;
        }

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Mock API call with setTimeout
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% chance of success
            if (success) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showToast('Failed to send message. Please try again.', 'error');
            }
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 2000); // Simulate network latency
    });
});
