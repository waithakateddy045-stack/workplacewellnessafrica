// Shared Layout Component
document.addEventListener('DOMContentLoaded', () => {
    injectAccessibility();
    injectAlertBar();
    injectHeader();
    injectFooter();
    initMobileMenu();
    highlightActiveLink();
    initScrollDynamics();
    injectWhatsAppButton();
    injectCookieConsent();
    injectTawkTo();
    injectShareButtons();
});

const ROOT = window.SITE_ROOT || '';

const SITE_CONFIG = {
    name: "Workplace Wellness Africa",
    tagline: "Achieved Work-Life Balance",
    logoPath: `${ROOT}assets/images/logo.png`,
    homePath: `${ROOT}index.html`,
    supportText: "Need Urgent Support? Reach Out | Kenya Red Cross: 1199 | Befrienders: 0722 178 177"
};

function injectAccessibility() {
    // Skip to content link
    if (!document.getElementById('skip-to-content')) {
        const skip = document.createElement('a');
        skip.href = '#main-content';
        skip.className = 'skip-to-content';
        skip.textContent = 'Skip to main content';
        Object.assign(skip.style, {
            position: 'absolute', top: '-9999px', left: '50%', transform: 'translateX(-50%)',
            background: '#10b981', color: 'white', padding: '1rem 2rem', zIndex: '10001',
            textDecoration: 'none', fontWeight: 'bold', borderRadius: '0 0 8px 8px'
        });
        skip.addEventListener('focus', () => skip.style.top = '0');
        skip.addEventListener('blur', () => skip.style.top = '-9999px');
        document.body.prepend(skip);
    }

    // Add main id if missing (for skip link)
    const main = document.querySelector('main') || document.querySelector('section:first-of-type');
    if (main && !main.id) main.id = 'main-content';

    // Current page accessibility
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('a').forEach(a => {
        if (a.getAttribute('href')?.includes(currentPath)) {
            a.setAttribute('aria-current', 'page');
        }
    });
}

function injectAlertBar() {
    let alertBar = document.querySelector('.alert-bar');
    if (!alertBar) {
        alertBar = document.createElement('div');
        alertBar.className = 'alert-bar';
        document.body.prepend(alertBar);
    }
    alertBar.innerHTML = `
        ${SITE_CONFIG.supportText.replace('Reach Out', '<a href="' + ROOT + 'contact.html" style="color: #ffd600; font-weight: 700; text-decoration: underline;">Reach Out</a>')}
    `;
}

function injectHeader() {
    let header = document.querySelector('header');
    if (!header) {
        const oldNav = document.querySelector('nav');
        header = document.createElement('header');
        if (oldNav) {
            oldNav.replaceWith(header);
        } else {
            document.body.prepend(header);
        }
    }

    header.innerHTML = `
        <div class="nav-container">
            <a href="${SITE_CONFIG.homePath}" class="logo">
                <div class="logo-text">
                    <span class="logo-main">Workplace Wellness <span class="logo-accent">Africa</span></span>
                    <span class="tagline-text">${SITE_CONFIG.tagline}</span>
                </div>
            </a>
            <button class="hamburger" aria-label="Toggle menu">☰</button>
            <ul class="nav-menu">
                <li class="nav-item"><a href="${ROOT}index.html" class="nav-link">Home</a></li>
                <li class="nav-item">
                    <a href="${ROOT}about.html" class="nav-link">About ▾</a>
                    <div class="dropdown-menu">
                        <a href="${ROOT}about.html" class="dropdown-item">Our Mission</a>
                        <a href="${ROOT}team.html" class="dropdown-item">Our Team</a>
                        <a href="${ROOT}partners.html" class="dropdown-item">Partners</a>
                        <a href="${ROOT}case-studies.html" class="dropdown-item">Case Studies</a>
                        <a href="${ROOT}multimedia.html" class="dropdown-item">Media Hub</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="${ROOT}resources.html" class="nav-link">Resources ▾</a>
                    <div class="mega-menu">
                        <div class="mega-column">
                            <h4>For Individuals</h4>
                            <a href="${ROOT}resources/your-wellness.html" class="dropdown-item">Your Wellness</a>
                            <a href="${ROOT}resources/families.html" class="dropdown-item">Family & Work</a>
                            <a href="${ROOT}resources/why-wellness.html" class="dropdown-item">The "Why"</a>
                            <a href="${ROOT}self-assessment.html" class="dropdown-item" style="color: #10b981; font-weight: 600;">🧠 Burnout Self-Assessment</a>
                        </div>
                        <div class="mega-column">
                            <h4>For Leaders</h4>
                            <a href="${ROOT}resources/healthy-business.html" class="dropdown-item">Healthy Business</a>
                            <a href="${ROOT}resources/managing-workforce.html" class="dropdown-item">Workforce Management</a>
                        </div>
                        <div class="mega-column">
                            <h4>Strategy & Culture</h4>
                            <a href="${ROOT}resources/corporate-emotional-valves.html" class="dropdown-item">Emotional Valves</a>
                            <a href="${ROOT}resources/generational-gap.html" class="dropdown-item">Generational Gap</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                     <a href="${ROOT}approaches.html" class="nav-link">Our Work ▾</a>
                     <div class="dropdown-menu">
                        <a href="${ROOT}approaches.html" class="dropdown-item">Overview</a>
                        <a href="${ROOT}pricing.html" class="dropdown-item">Services & Pricing</a>
                        <a href="${ROOT}approaches/business-training.html" class="dropdown-item">Training & MHFA</a>
                        <a href="${ROOT}approaches/community-wellness.html" class="dropdown-item">Community Outreach</a>
                        <a href="${ROOT}approaches/practitioner-access.html" class="dropdown-item">Practitioner Network</a>
                    </div>
                </li>
                <li class="nav-item"><a href="${ROOT}contact.html" class="nav-link btn-primary-nav">Get in Touch</a></li>
            </ul>
        </div>
    `;

    if (!document.querySelector('link[href*="layout.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${ROOT}assets/css/layout.css`;
        document.head.appendChild(link);
    }
}

function injectFooter() {
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }

    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-col" style="flex: 1.5;">
                <h4 style="color: #10b981; font-family: 'Playfair Display', serif; font-size: 1.5rem;">${SITE_CONFIG.name}</h4>
                <p style="opacity: 0.7; line-height: 1.7; margin-bottom: 1.5rem;">We work with organisations across Africa to build healthier workplaces through consulting, employee education, and financial literacy programmes. Revenue from our consulting services funds our charitable work — fighting mental health stigma and advocating for humane workplace policies.</p>
                <div class="footer-social">
                    <a href="https://wa.me/254745710078" target="_blank" rel="noopener" aria-label="WhatsApp" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:white; margin-right:0.5rem; font-size:1.2rem; text-decoration:none; transition: transform 0.2s;">💬</a>
                    <a href="mailto:workplacewellnessafrica@gmail.com" aria-label="Email" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#059669; color:white; margin-right:0.5rem; font-size:1.2rem; text-decoration:none; transition: transform 0.2s;">✉</a>
                    <a href="tel:+254745710078" aria-label="Call us" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#059669; color:white; margin-right:0.5rem; font-size:1.2rem; text-decoration:none; transition: transform 0.2s;">📞</a>
                </div>
            </div>
            <div class="footer-col">
                <h4 style="border-bottom: 2px solid #059669; display: inline-block; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Quick Links</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}resources.html">Learning Resources</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}pricing.html">Services & Pricing</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}case-studies.html">Case Studies</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}self-assessment.html">Free Self-Assessment</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}team.html">Our Team</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}faq.html">FAQ</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}contact.html">Contact Us</a></li>
                    <li style="margin-bottom: 0.8rem;"><a href="${ROOT}donate.html" style="color: #10b981; font-weight: 700;">Contribute to Mission</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 style="border-bottom: 2px solid #059669; display: inline-block; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Stay Connected</h4>
                <p style="opacity: 0.7; font-size: 0.9rem; margin-bottom: 1rem;">Get monthly wellness tips and insights.</p>
                <form class="footer-newsletter" onsubmit="handleNewsletterSignup(event)">
                    <input type="email" placeholder="Your email address" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); color: white; font-size: 0.9rem; margin-bottom: 0.5rem; outline: none;">
                    <button type="submit" style="width: 100%; padding: 0.75rem; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s;">Subscribe Free</button>
                </form>
                <div class="footer-emergency" style="margin-top: 1.5rem;">
                    <span style="display: block; font-size: 0.75rem; text-transform: uppercase; opacity: 0.5; margin-bottom: 0.3rem;">Crisis Line</span>
                    <span style="color: #fb7185; font-weight: 700;">Kenya Red Cross: 1199</span>
                    <a href="${ROOT}find-help.html" style="display: block; color: #10b981; font-weight: 600; margin-top: 0.3rem; font-size: 0.9rem;">Find Help Now →</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.05); padding: 2rem 0; text-align: center;">
            <p style="opacity: 0.5; font-size: 0.85rem;">© ${new Date().getFullYear()} ${SITE_CONFIG.name}. All Rights Reserved. | <a href="${ROOT}privacy.html" style="color: #94a3b8; text-decoration: underline;">Privacy Policy</a></p>
        </div>
    `;
}

function initMobileMenu() {
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
            btn.innerHTML = menu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link, .dropdown-item');

    links.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkFile = linkHref.split('/').pop();

        if (linkFile === currentPath) {
            link.classList.add('active');
            if (link.classList.contains('dropdown-item')) {
                const parent = link.closest('.nav-item');
                if (parent) {
                    const parentLink = parent.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        }
    });
}

function initScrollDynamics() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll-reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right').forEach(el => {
        observer.observe(el);
    });
}

// ── WhatsApp Floating Button ──
function injectWhatsAppButton() {
    const wa = document.createElement('a');
    wa.href = 'https://wa.me/254745710078?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20workplace%20wellness%20services.';
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.id = 'whatsapp-float';
    wa.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    `;
    Object.assign(wa.style, {
        position: 'fixed', bottom: '24px', right: '24px', zIndex: '9998',
        width: '60px', height: '60px', borderRadius: '50%',
        background: '#25D366', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s',
        textDecoration: 'none'
    });
    wa.addEventListener('mouseenter', () => { wa.style.transform = 'scale(1.1)'; wa.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)'; });
    wa.addEventListener('mouseleave', () => { wa.style.transform = 'scale(1)'; wa.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'; });
    document.body.appendChild(wa);
}

// ── Cookie Consent Banner ──
function injectCookieConsent() {
    if (localStorage.getItem('wwa_cookie_consent')) return;
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.innerHTML = `
        <div style="position:fixed; bottom:0; left:0; right:0; z-index:10000; background:#1e293b; color:white; padding:1rem 2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; font-size:0.9rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.2);">
            <p style="margin:0; flex:1; min-width:200px; opacity:0.9;">We use cookies to improve your experience. By continuing to use this site, you agree to our <a href="${ROOT}privacy.html" style="color:#10b981; text-decoration:underline;">Privacy Policy</a>.</p>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="acceptCookies()" style="padding:0.5rem 1.5rem; background:#059669; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Accept</button>
                <button onclick="acceptCookies()" style="padding:0.5rem 1.5rem; background:transparent; color:#94a3b8; border:1px solid #475569; border-radius:6px; cursor:pointer;">Dismiss</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
}

function acceptCookies() {
    localStorage.setItem('wwa_cookie_consent', 'true');
    const el = document.getElementById('cookie-consent');
    if (el) el.remove();
}

// ── Newsletter Signup Handler ──
function handleNewsletterSignup(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    // Store locally until email service is configured
    const subs = JSON.parse(localStorage.getItem('wwa_newsletter_subs') || '[]');
    if (!subs.includes(email)) subs.push(email);
    localStorage.setItem('wwa_newsletter_subs', JSON.stringify(subs));
    form.innerHTML = '<p style="color:#10b981; font-weight:600; padding:0.5rem 0;">✓ Subscribed! Thank you.</p>';
}

// ── Social Share Buttons (for article pages) ──
function injectShareButtons() {
    const articles = document.querySelectorAll('.article-content');
    articles.forEach(article => {
        const title = article.closest('details')?.querySelector('.summary-title span:first-child')?.textContent || document.title;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(title);
        const shareBar = document.createElement('div');
        shareBar.className = 'share-bar';
        shareBar.innerHTML = `
            <span style="font-size:0.85rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Share this article:</span>
            <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                <a href="https://wa.me/?text=${text}%20${url}" target="_blank" rel="noopener" style="padding:0.4rem 0.8rem; background:#25D366; color:white; border-radius:6px; font-size:0.8rem; text-decoration:none; font-weight:500;">WhatsApp</a>
                <a href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener" style="padding:0.4rem 0.8rem; background:#1DA1F2; color:white; border-radius:6px; font-size:0.8rem; text-decoration:none; font-weight:500;">Twitter</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener" style="padding:0.4rem 0.8rem; background:#0077B5; color:white; border-radius:6px; font-size:0.8rem; text-decoration:none; font-weight:500;">LinkedIn</a>
                <a href="mailto:?subject=${text}&body=Check%20this%20out:%20${url}" style="padding:0.4rem 0.8rem; background:#64748b; color:white; border-radius:6px; font-size:0.8rem; text-decoration:none; font-weight:500;">Email</a>
            </div>
        `;
        shareBar.style.cssText = 'margin-top:2rem; padding-top:1.5rem; border-top:1px solid #e2e8f0;';
        article.appendChild(shareBar);
    });
}

// Inject share buttons on pages with articles
if (document.querySelectorAll('.article-content').length > 0) {
    document.addEventListener('DOMContentLoaded', injectShareButtons);
}

// ── tawk.to Live Chat ──
function injectTawkTo() {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6996b9ce3a5ba51c3b8904a3/1jhqcbkk8';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
}
