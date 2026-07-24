(() => {
  const progress = document.querySelector('.progress-rail span');
  const filterInput = document.getElementById('filtro-guia');
  const clearButton = document.getElementById('limpar-filtro');
  const status = document.getElementById('status-filtro');
  const emptyState = document.getElementById('sem-resultados');
  const selectorLinks = Array.from(document.querySelectorAll('.chip[href^="#"]'));
  const filterSections = Array.from(document.querySelectorAll('section[id]'));
  const areaCards = Array.from(document.querySelectorAll('.area-card'));

  const normalize = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const getSectionText = (section) => normalize(section.textContent || '');

  const updateProgress = () => {
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const value = Math.min(Math.max(window.scrollY / max, 0), 1);
    progress.style.width = `${value * 100}%`;
  };

  const setActiveChip = (id) => {
    selectorLinks.forEach((link) => {
      const target = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', target === id);
    });
  };

  const updateStatus = (visibleCount, term) => {
    status.textContent = term
      ? `${visibleCount} área(s) encontrada(s) para “${term}”`
      : 'Mostrando tudo';
  };

  const applyFilter = () => {
    const rawTerm = filterInput.value.trim();
    const term = normalize(rawTerm);

    filterSections.forEach((section) => {
      const matches = term.length === 0 || getSectionText(section).includes(term);
      section.classList.toggle('is-hidden', !matches);
    });

    const filteredCards = areaCards.filter((card) => !card.classList.contains('is-hidden'));
    emptyState.style.display = filteredCards.length === 0 ? 'block' : 'none';
    updateStatus(filteredCards.length, rawTerm);
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveChip(visible.target.id);
    }
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: [0.08, 0.25, 0.5, 0.75],
  });

  filterSections.forEach((section) => observer.observe(section));

  filterInput.addEventListener('input', applyFilter);
  clearButton.addEventListener('click', () => {
    filterInput.value = '';
    filterInput.focus();
    applyFilter();
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  applyFilter();
  updateProgress();
})();