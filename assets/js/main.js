(function () {
    const wireCopy = () => {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.closest('.code-frame')?.querySelector('pre.code');
                if (!target) return;
                const lines = target.innerText.split('\n');
                const text = lines.map(l => l.replace(/^\s*\d+\s*/, '')).join('\n').trim();
                navigator.clipboard.writeText(text).then(() => {
                    const lab = btn.querySelector('.lab');
                    const original = btn.dataset.label || (lab ? lab.textContent : 'Copy');
                    btn.dataset.label = original;
                    btn.classList.add('done');
                    if (lab) lab.textContent = 'Copied';
                    setTimeout(() => {
                        btn.classList.remove('done');
                        if (lab) lab.textContent = original;
                    }, 1400);
                });
            });
        });
    };

    const wireToc = () => {
        const headings = document.querySelectorAll('main.docs-main h2[id], main.docs-main h3[id]');
        const links = document.querySelectorAll('aside.toc a');
        if (!headings.length || !links.length) return;

        const map = new Map();
        links.forEach(a => {
            const id = a.getAttribute('href').replace('#', '');
            map.set(id, a);
        });

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(l => l.classList.remove('active'));
                    const a = map.get(entry.target.id);
                    if (a) a.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

        headings.forEach(h => obs.observe(h));
    };

    const wireSpotlight = () => {
        const cards = document.querySelectorAll('.spotlight-card');
        if (!cards.length) return;
        cards.forEach(card => {
            card.addEventListener('pointermove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
        });
    };

    const ready = (fn) => {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    };

    const renderIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({ attrs: { 'stroke-width': 1.6 } });
        }
    };

    ready(() => {
        renderIcons();
        wireCopy();
        wireToc();
        wireSpotlight();
    });
})();
