function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
  }

  function filterMenu(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
    });
  }

  function openWA() {
    document.getElementById('waOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeWA() {
    document.getElementById('waOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  function overlayClose(e) {
    if (e.target === document.getElementById('waOverlay')) closeWA();
  }
  function sendWA() {
    const msg = encodeURIComponent(
      "Hello Food Ever Cafe! 👋\n\nI'd like to place an order.\n\nMy order:\n" +
      "• (Please type your items here)\n\n" +
      "📍 Delivery address: \n📞 My number: \n\nThank you!"
    );
    window.open('https://wa.me/9178410 28217?text=' + msg, '_blank');
  }

  // Scroll fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-item, .info-card, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });