// Portfolio Data Manager
class PortfolioManager {
    constructor() {
        this.projects = [];
        this.skills = [];
        this.contact = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderProjects();
        this.renderSkills();
        this.renderContact();
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

            // Load contact data
            try {
                const contactResponse = await fetch('./data/contact.json');
                const contactData = await contactResponse.json();
                this.contact = contactData.contact;
            } catch (error) {
                console.log('Contact data not found, using defaults');
                this.contact = this.getDefaultContact();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.loadFallbackData();
        }
    }

    getDefaultContact() {
        return {
            email: "your.email@example.com",
            github: "https://github.com/J5T3R0R",
            tryhackme: "https://tryhackme.com/p/yourusername",
            linkedin: "https://linkedin.com/in/yourusername"
        };
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
            { name: "C Programming", level: 92, category: "programming" },
            { name: "C++", level: 88, category: "programming" },
            { name: "Linux Administration", level: 87, category: "systems" },
            { name: "Reverse Engineering", level: 75, category: "security" }
        ];

        this.contact = this.getDefaultContact();
    }

    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = '';

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
        // Render main skills container (top skills)
        const container = document.getElementById('skills-container');
        if (container) {
            container.innerHTML = '';

            // Show top 6 skills
            const topSkills = this.skills
                .sort((a, b) => b.level - a.level)
                .slice(0, 6);

            topSkills.forEach(skill => {
                const skillBar = this.createSkillBar(skill);
                container.appendChild(skillBar);
            });
        }

        // Render categorized skills
        this.renderSkillsByCategory();
    }

    renderSkillsByCategory() {
        const categories = ['programming', 'systems', 'security', 'tools', 'networking', 'web'];

        categories.forEach(category => {
            const container = document.getElementById(`${category}-skills`);
            if (!container) return;

            container.innerHTML = '';

            const categorySkills = this.skills.filter(skill =>
                skill.category === category ||
                (category === 'tools' && (skill.category === 'tools' || skill.category === 'web'))
            );

            categorySkills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'flex justify-between items-center text-sm';
                skillItem.innerHTML = `
                    <span class="text-[#bacaa7]">${skill.name}</span>
                    <span class="text-[#0a9b29] font-bold">${skill.level}%</span>
                `;
                container.appendChild(skillItem);
            });
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

    renderContact() {
        const container = document.getElementById('contact-links');
        if (!container) return;

        container.innerHTML = '';

        const contactLinks = [
            {
                icon: 'fab fa-github',
                label: 'GitHub Profile',
                url: this.contact.github
            },
            {
                icon: 'fas fa-skull-crossbones',
                label: 'TryHackMe Profile',
                url: this.contact.tryhackme
            },
            {
                icon: 'fas fa-envelope',
                label: 'Email Me',
                url: `mailto:${this.contact.email}`
            }
        ];

        // Add optional social links if they exist
        if (this.contact.linkedin) {
            contactLinks.push({
                icon: 'fab fa-linkedin',
                label: 'LinkedIn',
                url: this.contact.linkedin
            });
        }

        if (this.contact.discord) {
            contactLinks.push({
                icon: 'fab fa-discord',
                label: 'Discord',
                url: `https://discord.com/users/${this.contact.discord.replace('#', '')}`
            });
        }

        contactLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.className = 'flex items-center gap-3 text-[#bacaa7] hover:text-[#0a9b29] transition-colors';
            linkElement.innerHTML = `
                <i class="${link.icon} w-6 h-6 text-lg"></i>
                ${link.label}
            `;
            container.appendChild(linkElement);
        });
    }

    initializeAnimations() {
        this.setupNavigation();
        this.setupSkillAnimations();
        this.setupScrollAnimations();
        this.setupTypingEffect();
        this.setupContactForm();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
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

        const updateActiveNav = () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
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
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                        // Rate limiting check
                        const lastSubmission = localStorage.getItem('lastContactSubmission');
                        const now = Date.now();
                        const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds

                        if (lastSubmission && (now - parseInt(lastSubmission) < cooldownTime)) {
                            e.preventDefault();
                            const remainingTime = Math.ceil((cooldownTime - (now - parseInt(lastSubmission))) / 60000);
                            alert(`Please wait ${remainingTime} minute(s) before sending another message.`);
                            return;
                        }

                        // Store submission time
                        localStorage.setItem('lastContactSubmission', now.toString());


                        // Show loading state
                        const submitBtn = document.getElementById('submit-btn');
                        const btnText = submitBtn.querySelector('.btn-text');
                        const btnLoading = submitBtn.querySelector('.btn-loading');

                        btnText.classList.add('hidden');
                        btnLoading.classList.remove('hidden');
                        submitBtn.disabled = true;

                        // Hide previous messages
                        document.getElementById('form-messages').classList.add('hidden');
                        document.getElementById('success-message').classList.add('hidden');
                        document.getElementById('error-message').classList.add('hidden');

                        // the form submit naturally to Formspree
                        // The page will redirect or show a success message

                        // Reset button after a delay (in case of errors)
                        setTimeout(() => {
                            btnText.classList.remove('hidden');
                            btnLoading.classList.add('hidden');
                            submitBtn.disabled = false;
                        }, 5000);
                    });
                }
            }
}

        // Initialize the portfolio when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new PortfolioManager();
        });