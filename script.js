const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const yearLabel = document.getElementById('year');
const heroSection = document.querySelector('.hero');
const revealItems = document.querySelectorAll('.reveal');

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = window.matchMedia('(pointer: fine) and (hover: hover)');

yearLabel.textContent = new Date().getFullYear();

function setInitialMenuState() {
  if (window.innerWidth <= 760) {
    siteNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  siteNav.hidden = false;
}

setInitialMenuState();

function closeMenu() {
  siteNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  siteNav.hidden = isExpanded;
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    siteNav.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  if (menuToggle.getAttribute('aria-expanded') !== 'true') {
    siteNav.hidden = true;
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 760) {
      closeMenu();
    }
  });
});

document.addEventListener('click', (event) => {
  if (window.innerWidth > 760 || siteNav.hidden) {
    return;
  }

  const clickedInsideNav = siteNav.contains(event.target) || menuToggle.contains(event.target);
  if (!clickedInsideNav) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !siteNav.hidden && window.innerWidth <= 760) {
    closeMenu();
    menuToggle.focus();
  }
});

function updateScrollUI() {
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? scrollY / documentHeight : 0;
  const nearPageBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

  document.documentElement.style.setProperty('--progress', progress.toFixed(4));
  header.classList.toggle('scrolled', scrollY > 8);

  let activeId = sections[0]?.id || '';

  if (nearPageBottom && sections.length > 0) {
    activeId = sections[sections.length - 1].id;
  } else {
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop - 220) {
        activeId = section.id;
      }
    });
  }

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', active);
  });
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

if (reducedMotionQuery.matches) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (desktopPointer.matches && heroSection && !reducedMotionQuery.matches) {
  document.body.classList.add('has-orb-effect');

  const moveOrb = (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    const xOffset = Math.max(-1, Math.min(1, relativeX)) * 20;
    const yOffset = Math.max(-1, Math.min(1, relativeY)) * 20;

    heroSection.style.setProperty('--orb-x', `${xOffset}px`);
    heroSection.style.setProperty('--orb-y', `${yOffset}px`);
  };

  heroSection.addEventListener('pointermove', moveOrb);
  heroSection.addEventListener('pointerleave', () => {
    heroSection.style.setProperty('--orb-x', '0px');
    heroSection.style.setProperty('--orb-y', '0px');
  });
}

