/* ATHION MOBILE NAV — accessible, keyboard-friendly menu */
(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  if (!toggle || !menu) return;
  const links = [...menu.querySelectorAll('a')];
  const close = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation menu');
    document.body.classList.remove('mobile-menu-open');
  };
  const open = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close navigation menu');
    document.body.classList.add('mobile-menu-open');
  };
  toggle.addEventListener('click', () => menu.classList.contains('is-open') ? close() : open());
  links.forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) { close(); toggle.focus(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); });
})();

/* Athion Direction — lightweight homepage direction experience. */
const escapeHtml = value => String(value ?? '').replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char]));
(() => {
  const box = document.querySelector('.selector-box');
  if (!box || document.querySelector('.dedicated-ai')) return;

  const steps = [...box.querySelectorAll('.selector-step')];
  const suggestions = [...box.querySelectorAll('.suggestions button')];
  const input = box.querySelector('#direction-input');
  const next = box.querySelector('#selector-next');
  const back = box.querySelector('#selector-back');
  const stepLabel = box.querySelector('#selector-step');
  const status = box.querySelector('#selector-status');
  const result = box.querySelector('#selector-result');
  const step2Label = box.querySelector('#step2-label');
  const step2Choices = box.querySelector('#step2-choices');

  let current = 1;
  const answers = {};

  function inferCapability(text) {
    const value = text.toLowerCase();
    const matches = [];
    if (/\b(website|web site|web development|web platform|online presence|site)\b/.test(value)) matches.push('Web Development');
    if (/\b(app|application|mobile|ios|android)\b/.test(value)) matches.push('Mobile Application Development');
    if (/\b(brand|branding|identity|logo|visual identity|rebrand|brand identity)\b/.test(value)) matches.push('Digital Branding');
    if (/\b(complete digital presence|new business|launching a business)\b/.test(value) && !matches.length) matches.push('Web Development', 'Digital Branding');
    return matches.length ? [...new Set(matches)] : ['Web Development'];
  }

  function buildRefinement() {
    const caps = answers.capabilities || [];
    if (caps.includes('Digital Branding') && !caps.includes('Web Development') && !caps.includes('Mobile Application Development')) {
      step2Label.textContent = 'One quick refinement — what do you need most?';
      step2Choices.innerHTML = `
        <button type="button" data-value="new-brand">Create a new identity</button>
        <button type="button" data-value="refresh">Refresh what we already have</button>
        <button type="button" data-value="digital">Build a stronger digital brand</button>`;
    } else if (caps.includes('Mobile Application Development') && !caps.includes('Web Development')) {
      step2Label.textContent = 'One quick refinement — what matters most?';
      step2Choices.innerHTML = `
        <button type="button" data-value="focused">Keep the product focused</button>
        <button type="button" data-value="developed">Build a more developed experience</button>
        <button type="button" data-value="tailored">Shape it specifically around us</button>`;
    } else if (caps.includes('Web Development') && !caps.includes('Mobile Application Development')) {
      step2Label.textContent = 'One quick refinement — what matters most?';
      step2Choices.innerHTML = `
        <button type="button" data-value="focused">Keep it focused and straightforward</button>
        <button type="button" data-value="developed">Give it more depth and refinement</button>
        <button type="button" data-value="signature">Create something more distinctive</button>
        <button type="button" data-value="tailored">Shape it specifically around us</button>`;
    } else {
      step2Label.textContent = 'One quick refinement — what matters most?';
      step2Choices.innerHTML = `
        <button type="button" data-value="presence">Build a stronger digital presence</button>
        <button type="button" data-value="product">Build a product people can use</button>
        <button type="button" data-value="brand">Strengthen our identity</button>
        <button type="button" data-value="tailored">Shape the experience around us</button>`;
    }
    step2Choices.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        answers.refinement = btn.dataset.value;
        step2Choices.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === btn));
        showRecommendation();
      });
    });
  }

  function renderStep() {
    steps.forEach(step => step.classList.toggle('is-active', Number(step.dataset.step) === current));
    stepLabel.textContent = `0${current} / 02`;
    status.textContent = current === 1 ? 'Tell us what you’re building' : 'One quick refinement';
    back.disabled = current === 1;
    next.textContent = current === 1 ? 'Continue →' : 'Find my direction →';
    result.style.display = 'none';
  }

  suggestions.forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.prompt || '';
    input.focus();
  }));

  next.addEventListener('click', () => {
    if (current === 1) {
      const text = input.value.trim();
      if (!text) {
        input.classList.add('needs-answer');
        setTimeout(() => input.classList.remove('needs-answer'), 500);
        return;
      }
      answers.brief = text;
      answers.capabilities = inferCapability(text);
      buildRefinement();
      current = 2;
      renderStep();
      return;
    }
    if (!answers.refinement) {
      showRecommendation();
      return;
    }
    showRecommendation();
  });



  back.addEventListener('click', () => {
    if (current > 1) {
      current -= 1;
      renderStep();
    }
  });

  function webDirection() {
    const r = answers.refinement;
    if (r === 'tailored') return { system: 'Athion Crafted', level: 'Tailored experience', why: 'Your description suggests a website experience that needs to be shaped specifically around your business.' };
    if (r === 'signature') return { system: 'Athion Curated', level: 'Signature', why: 'Your direction points toward a richer, more distinctive website experience.' };
    if (r === 'developed') return { system: 'Athion Curated', level: 'Premium', why: 'Your direction points toward a more developed website experience with greater depth and refinement.' };
    return { system: 'Athion Curated', level: 'Launch', why: 'Your direction points toward a focused website system designed to establish a clear digital presence.' };
  }

  function appDirection() {
    const r = answers.refinement;
    if (r === 'tailored') return { system: 'Athion Crafted', level: 'Tailored app experience', why: 'Your app idea appears to need a product experience shaped specifically around your requirements.' };
    if (r === 'developed') return { system: 'Athion Curated', level: 'Premium', why: 'Your direction points toward a more developed application experience.' };
    return { system: 'Athion Curated', level: 'Launch', why: 'Your direction points toward a focused application experience built around a clear product journey.' };
  }

  function brandingDirection() {
    const map = {
      'new-brand': ['New digital identity', 'A new identity direction built around a coherent digital foundation.'],
      refresh: ['Brand refresh', 'A refined identity direction for an existing brand that needs to feel more current and consistent.'],
      digital: ['Digital brand system', 'A digital-first identity direction designed for consistent expression across digital touchpoints.']
    };
    const chosen = map[answers.refinement] || map.digital;
    return { system: 'Digital Branding', level: chosen[0], why: chosen[1] };
  }

  function getExploreUrl(direction) {
    const name = direction.name;
    const inServices = /\/services\//.test(window.location.pathname);
    const prefix = inServices ? '' : 'services/';
    if (name === 'Web Development') return direction.system === 'Athion Crafted' ? `${prefix}web-development.html#crafted` : `${prefix}web-development.html#systems`;
    if (name === 'Mobile Application Development') return direction.system === 'Athion Crafted' ? `${prefix}mobile-application-development.html#crafted` : `${prefix}mobile-application-development.html#systems`;
    return `${prefix}digital-branding.html#systems`;
  }

  function showRecommendation() {
    const capabilities = answers.capabilities || [];
    const directions = [];
    if (capabilities.includes('Web Development')) directions.push({ name: 'Web Development', ...webDirection() });
    if (capabilities.includes('Mobile Application Development')) directions.push({ name: 'Mobile Application Development', ...appDirection() });
    if (capabilities.includes('Digital Branding')) directions.push({ name: 'Digital Branding', ...brandingDirection() });

    const primary = directions[0] || { name: 'Web Development', ...webDirection() };
    const supporting = directions.slice(1);
    const supportingText = supporting.length ? supporting.map(d => `<span>${d.name}</span>`).join('') : '<span>Focused on your primary need</span>';
    const exploreUrl = getExploreUrl(primary);

    result.innerHTML = `
      <div class="recommendation-kicker">YOUR ATHION DIRECTION</div>
      <div class="recommendation-primary">${primary.name}</div>
      <h3>${primary.system} · ${primary.level}</h3>
      <p>${primary.why}</p>
      <div class="recommendation-meta">
        <div><small>PRIMARY</small><span>${primary.name}</span></div>
        <div><small>SUPPORTING</small><span>${supportingText}</span></div>
      </div>
      <div class="recommendation-rule">Athion Direction filters the conversation through Athion's own service systems — not a global marketplace.</div>
      <a class="dark-btn recommendation-cta" href="${exploreUrl}">Explore →</a>
    `;
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.querySelector('.selector-actions').style.display = 'none';
  }

})();

/* ATHION DIRECTION — dedicated service directions (V1.50) */
(() => {
  const section = document.querySelector('#athion-ai[data-ai-service]');
  const box = section?.querySelector('.selector-box');
  if (!section || !box) return;
  const service = section.dataset.aiService;
  const steps=[...box.querySelectorAll('.selector-step')];
  const input=box.querySelector('#direction-input');
  const suggestions=[...box.querySelectorAll('.suggestions button')];
  const next=box.querySelector('#selector-next');
  const back=box.querySelector('#selector-back');
  const stepLabel=box.querySelector('#selector-step');
  const status=box.querySelector('#selector-status');
  const result=box.querySelector('#selector-result');
  const step2Label=box.querySelector('#step2-label');
  const step2Choices=box.querySelector('#step2-choices');
  let current=1;
  let answers={};

  const configs={
    web:{
      refinements:[['focused','Keep the experience focused'],['developed','Give the site more room to communicate'],['distinctive','Create a richer presentation'],['custom','Develop the experience around our requirements']],
      result:{focused:['Athion Curated','Launch','Your requirement points toward a focused website foundation with a clear, efficient structure.'],developed:['Athion Curated','Premium','Your requirement points toward a broader website experience with more room for content and creative depth.'],distinctive:['Athion Curated','Signature','Your requirement points toward a richer website experience within the controlled Athion system.'],custom:['Athion Crafted','Custom website direction','Your requirement suggests that the website needs its own architecture, functionality or technical foundation.']}
    },
    app:{
      refinements:[['focused','Keep the product journey focused'],['developed','Support several connected journeys'],['distinctive','Give the interface more interaction depth'],['custom','Develop the product specifically around us']],
      result:{focused:['Athion Curated','Launch','Your requirement points toward a focused application journey with a clear product purpose.'],developed:['Athion Curated','Premium','Your requirement points toward a more developed application experience with broader user journeys.'],distinctive:['Athion Curated','Signature','Your requirement points toward a richer application experience with greater controlled interaction depth.'],custom:['Athion Crafted','Custom application direction','Your requirement suggests that the product needs its own interface, flows, functionality or technical architecture.']}
    },
    branding:{
      refinements:[['foundation','Use an established creative foundation'],['depth','Build more creative depth around the brand'],['campaign','Create a richer communication system'],['custom','Develop the creative foundation specifically for us']],
      result:{foundation:['Athion Curated','Launch','Your requirement points toward a focused brand foundation using an established Athion creative system.'],depth:['Athion Curated','Premium','Your requirement points toward broader visual and content depth within the Athion system.'],campaign:['Athion Curated','Signature','Your requirement points toward a richer coordinated brand presence with greater creative depth.'],custom:['Athion Crafted','Custom brand direction','Your requirement suggests that the identity and communication system needs to be developed specifically for the brand.']}
    }
  };
  const cfg=configs[service];
  if(!cfg)return;

  suggestions.forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.prompt||'';input.focus();}));
  function render(){
    steps.forEach(step=>step.classList.toggle('is-active',Number(step.dataset.step)===current));
    stepLabel.textContent=`0${current} / 02`;
    status.textContent=current===1?'Define the service requirement':'Choose the depth that fits';
    back.disabled=current===1;
    next.textContent=current===1?'Continue →':'Find my direction →';
    result.style.display='none';
  }
  function buildChoices(){
    step2Label.textContent=service==='web'?'How much digital depth does the business need?':service==='app'?'How developed does the product experience need to be?':'How much creative development does the brand need?';
    step2Choices.innerHTML=cfg.refinements.map(([value,text])=>`<button type="button" data-value="${value}">${text}</button>`).join('');
    step2Choices.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      answers.refinement=btn.dataset.value;
      step2Choices.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===btn));
      show();
    }));
  }
  next.addEventListener('click',()=>{
    if(current===1){
      if(!input.value.trim()){input.classList.add('needs-answer');setTimeout(()=>input.classList.remove('needs-answer'),500);return;}
      answers.brief=input.value.trim();
      buildChoices();current=2;render();return;
    }
    show();
  });
  back.addEventListener('click',()=>{if(current>1){current--;render();}});
  function show(){
    const r=cfg.result[answers.refinement]||cfg.result.focused;
    const explore=service==='web'?'web-development.html':service==='app'?'mobile-application-development.html':'digital-branding.html';
    const anchor=r[0]==='Athion Crafted'?'#crafted':'#systems';
    result.innerHTML=`<div class="recommendation-kicker">YOUR ${service==='web'?'WEB':service==='app'?'APPLICATION':'BRAND'} DIRECTION</div><div class="recommendation-primary">${r[0]}</div><h3>${r[1]}</h3><p>${r[2]}</p><div class="recommendation-meta"><div><small>BASED ON YOUR REQUIREMENT</small><span>${escapeHtml(answers.brief)}</span></div></div><div class="recommendation-rule">Athion Direction is focused on ${service==='web'?'Web Development':service==='app'?'Mobile Application Development':'Digital Branding'} for this page.</div><a class="dark-btn recommendation-cta" href="${explore}${anchor}">Explore this direction →</a>`;
    result.style.display='block';
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
    box.querySelector('.selector-actions').style.display='none';
  }
  render();
})();

/* Animated results — activates once when the results section enters the viewport. */
(() => {
  const section = document.querySelector('.results-panel');
  if (!section) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;
  const countNumbers = () => {
    section.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count) || 0;
      const prefix = el.dataset.prefix || '';
      if (reduceMotion) { el.textContent = `${prefix}${target}%`; return; }
      const start = performance.now();
      const duration = 1100;
      const tick = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}%`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const animateBars = () => section.querySelectorAll('.animated-bars i').forEach((bar, index) => {
    const value = bar.dataset.height || '10%';
    const scale = Math.max(0, Math.min(1, parseFloat(value) / 100));
    bar.style.height = value;
    bar.style.transform = reduceMotion ? 'scaleY(1)' : 'scaleY(0)';
    bar.style.transitionDelay = `${index * 70}ms`;
    if (!reduceMotion) requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.transform = `scaleY(${scale})`;
    }));
  });
  const animateRing = () => {
    const ring = section.querySelector('#result-ring');
    const text = section.querySelector('#ring-text');
    if (!ring || !text) return;
    if (reduceMotion) { ring.style.background = 'conic-gradient(var(--purple) 0 162deg,#edf0f4 162deg 360deg)'; text.textContent = '45%'; return; }
    const start = performance.now();
    const duration = 1200;
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const degrees = 162 * eased;
      ring.style.background = `conic-gradient(var(--purple) 0 ${degrees}deg,#edf0f4 ${degrees}deg 360deg)`;
      text.textContent = `${Math.round(45 * eased)}%`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const startAnimation = () => {
    if (started) return;
    started = true;
    section.classList.add('is-visible');
    countNumbers();
    animateBars();
    animateRing();
  };
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && startAnimation()), { threshold: 0.25 });
  observer.observe(section);
})();

/* ATHION UNIVERSAL MOTION CONTROLLER V1.45 */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-enabled');

  // Intro appears only at the extreme start of a browsing session, not on every internal page.
  const introKey = 'athion-intro-seen-v145';
  const firstVisit = !sessionStorage.getItem(introKey);
  if (firstVisit && !reduce) {
    const intro = document.createElement('div');
    intro.className = 'athion-intro';
    intro.setAttribute('aria-hidden','true');
    intro.innerHTML = '<div class="athion-intro__name"><span class="athion-intro__athion">ATHION</span><span class="athion-intro__studio">STUDIO</span></div>';
    document.body.appendChild(intro);
    requestAnimationFrame(() => intro.classList.add('is-active'));
    window.setTimeout(() => intro.classList.add('is-hidden'), 1750);
    window.setTimeout(() => intro.remove(), 3000);
    sessionStorage.setItem(introKey, '1');
  }

  // Give each page the same calm one-time reveal language.
  const selectors = [
    '.hero-copy h1','.hero-copy p','.hero-actions','.hero-visual',
    '.page-hero h1','.page-hero p','.page-hero-visual',
    '.services-hero-copy h1','.services-hero-copy p','.services-hero-copy .hero-actions','.client-direction-card',
    '.section-head','.solution','.service-card-v3','.service-chart-card','.why-grid-v3 > *','.direction-map-v3 > *',
    '.studio-intro-card','.studio-method-chart','.method-legend',
    '.studio-hero-grid > div','.studio-principle','.studio-quote',
    '.contact-intro','.contact-form-card','.final-cta','.cta-band',
    '.work-hero .page-hero-grid > div','.project-top','.project-feature','.project-footer',
    '.project-gallery','.scope-section > .wrap','.work-chart-section > .wrap',
    '.work-chart-section .chart-shell','.work-chart-section .inner-head',
    '.inner-section > .wrap','.legal-copy > *',
    '.site > main > section'
  ];
  const nodes=[...document.querySelectorAll(selectors.join(','))].filter(el=>!el.closest('header,footer'));

  // Consistent interaction language across every page: cards lift subtly, images breathe, CTAs respond.
  const hoverTargets = document.querySelectorAll(
    '.solution,.service-card,.feature-card,.package-card,.package-card-v2,.system-card,.scope-card,.scope-item,.studio-intro-card,.studio-principle,.method-item,.meta-card,.project,.project-main-visual,.project-gallery img,.contact-form-card,.visual-panel,.direction-result,.cta-band,.chart-shell,.service-chart-card,.client-direction-card'
  );
  hoverTargets.forEach(el => el.classList.add('motion-hover'));
  document.querySelectorAll('.project-gallery img,.gallery-image').forEach(el => el.classList.add('motion-image'));
  document.querySelectorAll('a.dark-btn,a.light-btn,button').forEach(el => el.classList.add('motion-btn'));

  nodes.forEach((el,i)=>{
    el.classList.add('motion-reveal-safe');
    if(i%4===1) el.classList.add('motion-delay-1');
    if(i%4===2) el.classList.add('motion-delay-2');
    if(i%4===3) el.classList.add('motion-delay-3');
  });

  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach(n=>n.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  nodes.forEach(n=>observer.observe(n));
})();

/* Dedicated capability charts — one-time, calm reveal */
(() => {
  const items = document.querySelectorAll('.scope-chart, .athion-ai-card, .depth-graph');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(el => el.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }), {threshold:.22});
  items.forEach(el => observer.observe(el));
})();
