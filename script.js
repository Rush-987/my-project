(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');
  const typed = document.querySelector('#typed-command');

  if (year) year.textContent = new Date().getFullYear();

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const command = 'lab run --track cybersecurity';
  let i = 0;
  const typeCommand = () => {
    if (!typed) return;
    typed.textContent = command.slice(0, i++);
    if (i <= command.length) window.setTimeout(typeCommand, 45);
  };
  window.setTimeout(typeCommand, 850);

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealItems.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
      observer.observe(el);
    });
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }
})();
