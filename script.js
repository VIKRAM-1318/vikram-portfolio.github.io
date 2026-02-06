// ===== Typing Effect =====
const typedTexts = ['Embedded Systems Developer', 'Full-Stack Developer', 'IoT Enthusiast', 'AI Builder'];
let textIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
    const current = typedTexts[textIdx];
    typedEl.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);

    if (!isDeleting && charIdx === current.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        textIdx = (textIdx + 1) % typedTexts.length;
    }
    setTimeout(type, isDeleting ? 50 : 100);
}
type();

// ===== Navbar =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const top = section.offsetTop - 100, height = section.offsetHeight;
        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link?.classList.add('active');
        }
    });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');
const animateCounter = (el) => {
    const target = +el.dataset.count;
    const duration = 2000, step = target / (duration / 16);
    let current = 0;
    const update = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    };
    update();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// ===== Form Handling with Backend API =====
// Backend API URL - change this when deploying
const API_URL = 'http://localhost:3000';

document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalBtn = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.reset();

            // Show success notification
            showNotification('✅ ' + data.message, 'success');
        } else {
            throw new Error(data.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        btn.innerHTML = '<span>Error! Try again</span>';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

        // Show error notification
        showNotification('❌ ' + error.message, 'error');
    }

    setTimeout(() => {
        btn.innerHTML = originalBtn;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});

// Notification helper function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(notificationStyle);

// ===== Particles =====
const particles = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:${Math.random() * 4 + 1}px;height:${Math.random() * 4 + 1}px;background:rgba(99,102,241,${Math.random() * 0.3});border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float ${Math.random() * 10 + 10}s linear infinite`;
    particles.appendChild(p);
}
const style = document.createElement('style');
style.textContent = '@keyframes float{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-20px) translateX(10px)}}';
document.head.appendChild(style);

// ===== Reveal on Scroll =====
const revealEls = document.querySelectorAll('.glass-card, .section-header');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    revealObserver.observe(el);
});
