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

// ===== Form Handling with Formspree =====
document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalBtn = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    try {
        const response = await fetch('https://formspree.io/f/rv367629@gmail.com', {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.reset();
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        btn.innerHTML = '<span>Error! Try again</span>';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }

    setTimeout(() => {
        btn.innerHTML = originalBtn;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});

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
