// Portfolio Data Manager
class PortfolioManager {
    constructor() {
        this.projects = [];
        this.skills = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderProjects();
        this.renderSkills();
        this.initializeAnimations();
    }

    async loadData() {
        try {
            // Load projects data
            const projectsResponse = await fetch('./data/projects.json');
            const projectsData = await projectsResponse.json();
            this.projects = projectsData.projects;

            // Load skills data
            const skillsResponse = await fetch('./data/skills.json');
            const skillsData = await skillsResponse.json();
            this.skills = skillsData.skills;
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback data in case JSON files are not available
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.projects = [
            {
                id: "msh",
                title: "MSH - Shell Implementation",
                description: "Custom shell implementation in C, featuring command parsing, process management, and built-in commands. A deep dive into Unix system calls.",
                technologies: ["C", "Unix Systems", "Process Management"],
                githubUrl: "https://github.com/J5T3R0R/msh",
                featured: true
            },
            {
                id: "philosophers",
                title: "Philosophers",
                description: "Solution to the classic dining philosophers problem using threads and mutexes. Explores concurrent programming and deadlock prevention.",
                technologies: ["C", "Threading", "Concurrency"],
                githubUrl: "https://github.com/J5T3R0R/philosophers",
                featured: true
            },
            {
                id: "minisock",
                title: "MiniSock",
                description: "Lightweight socket programming implementation. Network communication library exploring TCP/UDP protocols and client-server architecture.",
                technologies: ["C", "Networking", "Socket Programming"],
                githubUrl: "https://github.com/J5T3R0R/minisock",
                featured: true
            }
        ];

        this.skills = [
            { name: "C/C++", level: 90, category: "programming" },
            { name: "Cybersecurity", level: 85, category: "security" },
            { name: "Linux Systems", level: 88, category: "systems" },
            { name: "Front-End Development", level: 80, category: "web" }
        ];
    }

    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = '';

        // Filter featured projects or show all if none are featured
        const featuredProjects = this.projects.filter(project => project.featured);
        const projectsToShow = featuredProjects.length > 0 ? featuredProjects : this.projects;

        projectsToShow.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card bg-black/60 border border-[#0a9b29]/30 rounded-lg p-6 hover:border-[#0a9b29] transition-all';
        
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        card.innerHTML = `
            <h3 class="text-xl font-bold text-[#0a9b29] mb-3">${project.title}</h3>
            <p class="text-[#bacaa7] mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${techTags}
            </div>
            <a href="${project.githubUrl}" target="_blank" class="text-[#0a9b29] hover:text-[#0b6810] transition-colors">View on GitHub →</a>
        `;

        return card;
    }

    renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        container.innerHTML = '';

        this.skills.forEach(skill => {
            const skillBar = this.createSkillBar(skill);
            container.appendChild(skillBar);
        });
    }

    createSkillBar(skill) {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-bar';
        
        skillDiv.innerHTML = `
            <div class="flex justify-between mb-1">
                <span class="text-[#bacaa7]">${skill.name}</span>
                <span class="text-[#0a9b29]">${skill.level}%</span>
            </div>
            <div class="bg-gray-800 rounded-full h-2">
                <div class="bg-[#0a9b29] h-2 rounded-full skill-progress" data-width="${skill.level}"></div>
            </div>
        `;

        return skillDiv;
    }

    initializeAnimations() {
        // Initialize all animations after data is loaded
        this.setupNavigation();
        this.setupSkillAnimations();
        this.setupScrollAnimations();
        this.setupTypingEffect();
        this.setupContactForm();
    }

    setupNavigation() {
        // Smooth scrolling for navigation
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const updateActiveNav = () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav);
    }

    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const rect = bar.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible && !bar.classList.contains('animate')) {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.setProperty('--target-width', targetWidth + '%');
                    bar.classList.add('animate');
                    bar.style.width = targetWidth + '%';
                }
            });
        };

        window.addEventListener('scroll', animateSkillBars);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    setupTypingEffect() {
        const heading = document.querySelector('.typing-container h1');
        if (heading) {
            const text = heading.textContent;
            heading.textContent = '';
            heading.style.borderRight = '3px solid #0a9b29';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heading.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        heading.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }

    setupContactForm() {
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = this.querySelector('input[type="text"]').value;
                const email = this.querySelector('input[type="email"]').value;
                const message = this.querySelector('textarea').value;
                
                if (name && email && message) {
                    alert('Thank you for your message! I\'ll get back to you soon.');
                    this.reset();
                } else {
                    alert('Please fill in all fields.');
                }
            });
        }
    }
}

// Initialize the portfolio when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});