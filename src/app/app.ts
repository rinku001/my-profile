import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, type FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  @ViewChild('testimonialTrack', { static: false }) testimonialTrack?: ElementRef<HTMLElement>;

  protected readonly year = new Date().getFullYear();

  protected readonly profile = {
    name: 'Rinku Nag',
    email: 'rinkunag629@email.com',
    location: 'Bangalore, India',
    resumeUrl: '/rinku_nag_resume.pdf'
  } as const;

  protected readonly navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ] as const;

  protected readonly heroStats = [
    { value: '10+ yrs', label: 'UI development' },
    { value: 'A11y', label: 'WCAG-first mindset' },
    { value: 'Perf', label: 'Core Web Vitals focus' }
  ] as const;

  protected readonly profileHighlights = [
    'Design systems',
    'Angular architecture',
    'Micro-interactions',
    'Performance tuning'
  ] as const;

  protected readonly strengths = [
    { title: 'UI/UX craft', desc: 'Polished layouts, spacing, typographic rhythm, and interaction design.' },
    { title: 'Angular expertise', desc: 'Signals, change detection strategy, state patterns, and scalable structure.' },
    { title: 'Performance', desc: 'Render & bundle optimization, audits, and practical Core Web Vitals improvements.' },
    { title: 'Accessibility', desc: 'Keyboard flows, focus management, ARIA basics, and inclusive defaults.' }
  ] as const;

  protected readonly skillCategories = [
    {
      title: 'Frontend',
      subtitle: 'Modern frameworks & fundamentals',
      items: [
        { name: 'HTML', level: 95 },
        { name: 'CSS / SCSS', level: 92 },
        { name: 'JavaScript / TypeScript', level: 90 },
        { name: 'Angular', level: 92 },
      ]
    },
    {
      title: 'UI/UX',
      subtitle: 'Design-to-dev precision',
      items: [
        { name: 'Design Systems', level: 88 },
        { name: 'Accessibility', level: 86 },
        { name: 'Motion / Micro-interactions', level: 84 },
        { name: 'Responsive UI', level: 92 },
        { name: 'Visual QA', level: 90 }
      ]
    },
    {
      title: 'Tools',
      subtitle: 'Speed + quality in delivery',
      items: [
        { name: 'Figma', level: 85 },
        { name: 'Git', level: 88 },
        { name: 'Jira / Agile', level: 80 }
      ]
    }
  ] as const;

  protected readonly projectFilters = ['All', 'Web Apps', 'UI Design'] as const;
  protected readonly activeFilter = signal<(typeof this.projectFilters)[number]>('All');

  protected readonly projects = [
    {
      title: 'Enterprise Dashboard',
      type: 'Web Apps',
      description: 'High-density analytics UI with reusable components, polished states, and fast rendering.',
      stack: ['Angular', 'TypeScript', 'SCSS', 'Html'],
      demoUrl: 'https://example.com',
      codeUrl: 'https://github.com',
      image: 'linear-gradient(135deg, rgba(124,58,237,.9), rgba(37,99,235,.8))'
    },
    {
      title: 'Design System Kit',
      type: 'UI Design',
      description: 'A component library with tokens, accessibility defaults, and consistent interaction patterns.',
      stack: ['Figma', 'Tokens', 'XD', 'Docs'],
      demoUrl: 'https://example.com',
      codeUrl: 'https://github.com',
      image: 'linear-gradient(135deg, rgba(34,211,238,.85), rgba(124,58,237,.8))'
    },
    {
      title: 'Performance Refresh',
      type: 'Web Apps',
      description: 'Core Web Vitals improvement: reduced JS, optimized rendering, and cleaner loading behavior.',
      stack: ['Angular', 'Best practices'],
      demoUrl: 'https://example.com',
      codeUrl: 'https://github.com',
      image: 'linear-gradient(135deg, rgba(37,99,235,.9), rgba(16,18,38,.8))'
    }
  ] as const;

  protected readonly filteredProjects = computed(() => {
    const f = this.activeFilter();
    if (f === 'All') return this.projects;
    return this.projects.filter(p => p.type === f);
  });

  protected readonly experience = [
    {
      company: 'Company A',
      role: 'Senior UI Developer',
      duration: '2021 — Present',
      achievements: [
        'Built scalable UI architecture and reusable component patterns.',
        'Improved page performance and responsiveness across key journeys.',
        'Partnered with design to standardize tokens and interaction guidelines.'
      ]
    },
    {
      company: 'Company B',
      role: 'UI Developer',
      duration: '2017 — 2021',
      achievements: [
        'Delivered pixel-perfect features across Angular applications.',
        'Introduced accessibility basics and reusable form components.',
        'Reduced CSS regression with better structure and review practices.'
      ]
    },
    {
      company: 'Company C',
      role: 'Frontend Developer',
      duration: '2013 — 2017',
      achievements: [
        'Shipped responsive UI for customer-facing web experiences.',
        'Implemented modern CSS patterns and reusable UI modules.',
        'Collaborated with QA to improve UI stability and cross-browser support.'
      ]
    }
  ] as const;

  protected readonly testimonials = [
    {
      name: 'Manager Name',
      title: 'Engineering Manager',
      quote: 'Consistently delivers premium UI with great judgment on trade-offs and performance.'
    },
    {
      name: 'Design Lead',
      title: 'Product Designer',
      quote: 'Brings designs to life with incredible fidelity and smooth, thoughtful interactions.'
    },
    {
      name: 'Tech Lead',
      title: 'Frontend Lead',
      quote: 'Strong Angular expertise, proactive about accessibility, and always performance-minded.'
    }
  ] as const;

  protected readonly socials = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rinku-nag-3372b4150', hint: 'Connect professionally' },
    { label: 'GitHub', href: 'https://github.com/rinku001/rinku-angular-portfolio.git', hint: 'Browse repositories' }
  ] as const;

  protected readonly theme = signal<'light' | 'dark'>('dark');
  protected readonly activeSection = signal<string>('top');
  protected readonly isSending = signal(false);
  protected contactForm!: FormGroup;

  private sectionObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;

  constructor(private readonly fb: FormBuilder) {
    this.contactForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? null;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    this.theme.set(saved ?? (prefersDark ? 'dark' : 'light'));
    this.applyTheme();
  }

  ngAfterViewInit(): void {
    this.setupRevealObserver();
    this.setupSectionObserver();
  }

  protected setFilter(f: (typeof this.projectFilters)[number]): void {
    this.activeFilter.set(f);
  }

  protected toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', this.theme());
    this.applyTheme();
  }

  protected scrollTo(id: string, ev?: Event): void {
    ev?.preventDefault();
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected scrollTestimonials(direction: -1 | 1): void {
    const track = this.testimonialTrack?.nativeElement;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.t-card');
    const delta = (card?.offsetWidth ?? 320) + 16;
    track.scrollBy({ left: direction * delta, behavior: 'smooth' });
  }

  protected async submitContact(): Promise<void> {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;

    this.isSending.set(true);
    try {
      // Demo behavior: keep it fast and non-blocking. Replace with real API/email integration.
      const payload = this.contactForm.getRawValue();
      // eslint-disable-next-line no-console
      console.log('Contact form submitted:', payload);
      await new Promise(r => setTimeout(r, 550));
      this.contactForm.reset();
    } finally {
      this.isSending.set(false);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(ev: MouseEvent): void {
    const x = Math.round((ev.clientX / window.innerWidth) * 100);
    const y = Math.round((ev.clientY / window.innerHeight) * 100);
    document.documentElement.style.setProperty('--mx', `${x}%`);
    document.documentElement.style.setProperty('--my', `${y}%`);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  private setupRevealObserver(): void {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-visible');
            this.revealObserver?.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => this.revealObserver?.observe(el));
  }

  private setupSectionObserver(): void {
    this.sectionObserver = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible?.target) return;
        this.activeSection.set((visible.target as HTMLElement).id || 'top');
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0.08, 0.12, 0.2, 0.3] }
    );

    const ids = ['top', ...this.navLinks.map(l => l.id)];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) this.sectionObserver.observe(el);
    }
  }
}
