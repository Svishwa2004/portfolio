document.addEventListener('DOMContentLoaded', function() {
    // Display alert message when the webpage loads
    alert('This Portfolio is made for fun and Skills and Projects may not be accurate!');
    
    // Preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hide');
            setTimeout(function() {
                preloader.remove();
            }, 500);
        }, 500);
    });
    
    // Custom Cursor
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    
    document.addEventListener('mousemove', function(e) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', function() {
        customCursor.classList.add('grow');
    });
    
    document.addEventListener('mouseup', function() {
        customCursor.classList.remove('grow');
    });
    
    // Add grow class to elements that are clickable
    const clickables = document.querySelectorAll('a, button, .filter-btn, .project-card, .service-card, .skill-tag');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => customCursor.classList.add('grow'));
        item.addEventListener('mouseleave', () => customCursor.classList.remove('grow'));
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link based on scroll position
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });
    
    // Typing effect for hero section using Typed.js
    console.log("Looking for .typed element...");
    const typedElement = document.querySelector('.typed');
    console.log("Found element:", typedElement);
    if (typedElement) {
        console.log("Initializing Typed.js");
        const typed = new Typed('.typed', {
            strings: ['Full-Stack Developer', 'Front-End Specialist', 'Back-End Engineer', 'UI/UX Designer'],
            typeSpeed: 70,          // Slightly faster for smoother appearance
            backSpeed: 50,          // Consistent backspacing speed
            backDelay: 1000,        // Delay before backspacing
            startDelay: 300,        // Delay before starting
            loop: true,
            loopCount: Infinity,
            smartBackspace: false,  // Full backspace to avoid text shift
            showCursor: true,       // Show cursor
            cursorChar: '|',        // Professional cursor character
            autoInsertCss: true,    
            preStringTyped: (arrayPos, self) => {
                // Pre-typing callback
                typedElement.style.minWidth = '0px'; // Reset min-width
            },
            onStringTyped: (arrayPos, self) => {
                // After typing a string, set min-width to prevent layout shifts
                const computedWidth = window.getComputedStyle(typedElement).width;
                typedElement.style.minWidth = computedWidth;
            }
        });
    } else {
        console.error("Element with class 'typed' not found!");
    }
    
    // ScrollReveal initialization
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 1500,
        delay: 200,
        reset: false
    });
    
    // Reveal elements using ScrollReveal
    sr.reveal('.section-header', {});
    sr.reveal('.about-image', { origin: 'left' });
    sr.reveal('.about-text', { origin: 'right' });
    sr.reveal('.service-card', { interval: 200 });
    sr.reveal('.project-card', { interval: 300 });
    sr.reveal('.case-study', { interval: 400 });
    sr.reveal('.contact-info', { origin: 'left' });
    sr.reveal('.contact-form', { origin: 'right' });
    sr.reveal('.github-stat', { interval: 150 });
    sr.reveal('.github-repo', { interval: 200 });
    sr.reveal('.skill-category', { interval: 150 });
    
    // Animate skill bars when in view
    const skillBars = document.querySelectorAll('.skill-per');
    const animateSkills = () => {
        skillBars.forEach(skill => {
            const percentage = skill.getAttribute('data-per');
            skill.style.width = percentage;
        });
    };
    
    // Use Intersection Observer to trigger skill bar animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                }
            });
        }, { threshold: 0.5 });
        
        // Observe both skills sections
        const skillsSections = document.querySelectorAll('.skills, .skill-progress');
        skillsSections.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        window.addEventListener('scroll', () => {
            const skillsSection = document.querySelector('.skills');
            const skillProgressSection = document.querySelector('.skill-progress');
            
            [skillsSection, skillProgressSection].forEach(section => {
                if (section) {
                    const sectionTop = section.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (sectionTop < windowHeight * 0.8) {
                        animateSkills();
                    }
                }
            });
        });
    }
    
    // Project filtering with smooth transitions
    const filterButtons = document.querySelectorAll('.project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectGrid = document.querySelector('.project-grid');
    
    // Set initial active button
    document.querySelector('.project-filters .filter-btn[data-filter="all"]')?.classList.add('active');
    
    // Add click event to filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Apply staggered animation to project grid
            projectGrid.style.height = `${projectGrid.offsetHeight}px`;
            
            // Create a smooth filtering effect
            projectCards.forEach(item => {
                // First hide all items with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                // Force a reflow to ensure animation runs
                void item.offsetWidth;
                
                // After a short delay, show filtered items
                setTimeout(() => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, 300);
            });
            
            // Update grid height after filtering (with delay to allow animations)
            setTimeout(() => {
                projectGrid.style.height = 'auto';
            }, 600);
        });
    });
    
    // GitHub API Integration - Removed dynamic loading and replaced with static content

    // Add Scroll to Top button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Parallax effect for hero section background
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const scrollValue = window.scrollY;
            heroSection.style.backgroundPosition = `center ${scrollValue * 0.5}px`;
        }
    });
    
    // Add some additional animation to portfolio items
    projectCards.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const overlay = item.querySelector('.project-content');
            if (overlay) {
                overlay.style.transform = 'translateY(-10px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const overlay = item.querySelector('.project-content');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }
    
    // Toggle between light and dark themes
    themeToggle?.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
        
        // Update CSS variables for dark mode
        root.style.setProperty('--light-color', '#121212');
        root.style.setProperty('--dark-color', '#f9fafb');
        root.style.setProperty('--text-color', '#e0e0e0');
        root.style.setProperty('--heading-color', '#ffffff');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
        
        // Reset CSS variables to default
        root.style.setProperty('--light-color', '#f9fafb');
        root.style.setProperty('--dark-color', '#111827');
        root.style.setProperty('--text-color', '#4b5563');
        root.style.setProperty('--heading-color', '#1f2937');
    }
    
    // Add counter animation for numbers (example usage in the future)
    function animateCounter(target, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            target.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate GitHub statistics numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observerStats = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    const value = parseInt(statElement.textContent);
                    if (!isNaN(value)) {
                        animateCounter(statElement, 0, value, 2000);
                    }
                    observerStats.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            observerStats.observe(stat);
        });
    }
    
    // Add particles animation to the hero section
    const createParticles = () => {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const particles = document.createElement('div');
        particles.className = 'particles';
        heroSection.appendChild(particles);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 8 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.backgroundColor = 'rgba(74, 107, 253, 0.2)';
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particle.style.animation = 'floatParticle infinite linear';
            
            particles.appendChild(particle);
        }
        
        // Add keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(50px, -50px);
                }
                50% {
                    transform: translate(100px, 0);
                }
                75% {
                    transform: translate(50px, 50px);
                }
                100% {
                    transform: translate(0, 0);
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    createParticles();

    // Download CV functionality with confirmation dialog
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            const userConfirmed = confirm('Do you want to download the resume?');
            if (userConfirmed) {
                // Path to your resume PDF file
                const pdfPath = 'Resume 2.1v.pdf';
                
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = pdfPath;
                link.download = 'Sahan_Vishwa_Resume.pdf'; // Name that will appear when downloading
                
                // Append to the document, trigger click, then remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Optional: Add analytics or tracking
                console.log('Resume downloaded');
            } else {
                console.log('User canceled the download');
            }
        });
    }
});

// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Create a status message element
            const statusMessage = document.createElement('div');
            statusMessage.className = 'form-status';
            contactForm.appendChild(statusMessage);
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                console.log('Form submission response:', data); // For debugging
                
                if (data.success) {
                    statusMessage.className = 'form-status success';
                    statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                statusMessage.className = 'form-status error';
                statusMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Failed to send message. Please try again.'}`;
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Remove status message after 5 seconds
                setTimeout(() => {
                    statusMessage.remove();
                }, 3000);
            }
        });
    }
});
