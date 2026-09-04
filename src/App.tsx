import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BriefcaseBusiness, Check, ExternalLink, Globe2, Linkedin, Mail, MessageCircle, Phone, Save, Share2, Sparkles } from 'lucide-react';
import { SiViber } from 'react-icons/si';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
const logoPath = `${import.meta.env.BASE_URL}gzr-logo.png`;
const portraitPath = `${import.meta.env.BASE_URL}ghrazielle-headshot.jpg`;

const queryClient = new QueryClient();
type Employee = {
  firstName: string; lastName: string; title: string; department: string; company: string; phone: string; email: string;
  website: string; linkedin: string; location: string;
};
const employeeSlug = 'ghrazielle_deramos';
const initialEmployee: Employee = {
  firstName: 'Ghrazielle Rei',
  lastName: 'de Ramos',
  title: 'Only Anak',
  department: 'Lahat Department',
  company: 'GZR Enterprises',
  phone: '(+63) 933 862 0716',
  email: 'ghrazielle_deramos@gzrenterprises.com',
  website: 'https://gzrenterprises.com',
  linkedin: 'https://www.linkedin.com/company/gzr-enterprises',
  location: 'Antipolo City, Philippines',
};
type EmployeeCard = {
  slug: string;
  employee: Employee;
  portrait: string;
  alt: string;
};
const employeeCards: EmployeeCard[] = [{
  slug: employeeSlug,
  employee: initialEmployee,
  portrait: portraitPath,
  alt: 'Ghrazielle Rei de Ramos, Only Anak at GZR Enterprises',
}];

function LinkPill({ href, icon, label, testId, iconOnly = false }: { href: string; icon: ReactNode; label: string; testId: string; iconOnly?: boolean }) {
  const tone = 'border-white/80 bg-white text-[#164779] shadow-[0_4px_10px_rgba(255,255,255,.14)] hover:border-[#82bde8] hover:bg-white';
  const sizing = iconOnly ? 'h-10 w-10 shrink-0 justify-center px-0 sm:h-11 sm:w-11' : 'shrink-0 gap-1.5 px-2.5 text-xs sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm';
  return <a data-testid={testId} aria-label={label} title={label} href={href} target="_blank" rel="noreferrer" className={`action-link inline-flex min-h-10 items-center rounded-full border font-semibold ${sizing} ${tone}`}>
    {icon}<span className={iconOnly ? 'sr-only' : 'whitespace-nowrap'}>{label}</span>{!iconOnly && <ExternalLink size={13} className="shrink-0 text-current/60" />}
  </a>;
}

function ContactCard({ card }: { card: EmployeeCard }) {
  const employee = card.employee;
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const phoneValue = employee.phone.replace(/[^\d+]/g, '');
  const [emailUsername, emailDomain] = employee.email.split('@');
  const viberHref = `viber://chat?number=${encodeURIComponent(phoneValue)}`;

  const downloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `N:${employee.lastName};${employee.firstName};;;`, `FN:${fullName}`,
      `ORG:${employee.company};${employee.department}`, `TITLE:${employee.title}`,
      `TEL;TYPE=WORK,VOICE:${phoneValue}`, `EMAIL;TYPE=WORK:${employee.email}`,
      employee.website ? `URL:${employee.website}` : '',
      employee.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${employee.linkedin}` : '',
      employee.location ? `ADR;TYPE=WORK:;;${employee.location};;;;` : '',
      'END:VCARD',
    ].filter(Boolean).join('\r\n');
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${fullName.replace(/\s+/g, '-')}.vcf`; anchor.click();
    URL.revokeObjectURL(url);
    setSaved(true); window.setTimeout(() => setSaved(false), 2600);
  };

  const shareCard = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: fullName, text: `${fullName} — ${employee.title}, ${employee.company}`, url });
      else await navigator.clipboard.writeText(url);
      setShared(true); window.setTimeout(() => setShared(false), 2200);
    } catch { /* The share sheet was dismissed. */ }
  };

  return <main className="card-page min-h-[100dvh] px-4 py-5 sm:px-8 sm:py-8 lg:py-4">
    <div className="mx-auto max-w-[1080px]">
      <header className="fade-up flex items-center justify-between px-1 pb-5 sm:px-2">
        <div className="flex items-center gap-2.5">
          <img data-testid="img-gzr-logo-header" src={logoPath} alt="GZR Enterprises mark" className="logo-mark h-9 w-9 rounded-full" />
            <div className="leading-none">
             <div data-testid="text-company-wordmark" className="display-font text-[18px] font-bold tracking-[.12em] text-[#064798] sm:text-[19px]">GZR <span className="font-normal tracking-[.18em] text-[#6b89aa]">ENTERPRISES</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-[#c4ddec] bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#266095] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#18b6d3] shadow-[0_0_8px_rgba(24,182,211,.95)]" /> Digital card</span>
          <button data-testid="button-share-card" onClick={shareCard} aria-label="Share contact card" className="action-link rounded-full border border-[#c4ddec] bg-white/70 p-2.5 text-[#164779] hover:bg-white">{shared ? <Check size={17} /> : <Share2 size={17} />}</button>
        </div>
      </header>

      <section className="navy-shadow fade-up-1 relative overflow-hidden rounded-[2rem] bg-[#072d61] text-white">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[32rem] w-[32rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-16 h-[25rem] w-[25rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-[35%] h-56 w-56 rounded-full bg-[#1684c4]/20 blur-3xl" />
        <div className="relative grid gap-10 p-8 sm:gap-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:p-10">
          <div className="flex min-w-0 flex-col justify-center">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-stretch sm:gap-7">
              <div className="portrait-slot portrait-grid relative aspect-[4/5] w-48 shrink-0 self-center rounded-[1.65rem] border-4 border-white/15 shadow-lg max-[380px]:w-44 sm:aspect-auto sm:self-stretch sm:w-44">
                <img data-testid="img-employee-headshot" src={card.portrait} alt={card.alt} className="portrait-image absolute inset-0 h-full w-full rounded-[1.35rem]" />
              </div>
              <div className="w-full min-w-0 text-center sm:flex-1 sm:text-left">
                <p className="mb-3 whitespace-nowrap text-sm font-semibold uppercase tracking-[.18em] text-[#8eb7d9] sm:text-xs">Hello, I'm</p>
                <h1 data-testid="text-employee-name" className="display-font max-w-[620px] break-words text-[clamp(1.6rem,8vw,5.4rem)] font-semibold leading-[.92] tracking-[-.075em] sm:text-[clamp(2.25rem,6.8vw,5.4rem)] lg:text-[clamp(2.25rem,5.2vw,5.4rem)]"><span className="whitespace-nowrap">{employee.firstName}</span>{' '}<span className="whitespace-nowrap">{employee.lastName}</span></h1>
                <p data-testid="text-employee-title" className="mt-3 text-[clamp(.72rem,3.8vw,1.125rem)] font-medium leading-6 text-[#b9dbf4] sm:mt-5 sm:text-lg"><span className="whitespace-nowrap">{employee.title}</span> <span className="mx-2 text-[#5286b4]">/</span> <span data-testid="text-employee-department" className="whitespace-nowrap">{employee.department}</span></p>
              </div>
            </div>
            <span className="mt-3 inline-flex self-center items-center gap-1.5 rounded-full border border-[#4d8bb2]/70 bg-[#0b4e87]/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#bdf8ff] sm:hidden"><span className="h-1.5 w-1.5 rounded-full bg-[#2de8ff] shadow-[0_0_8px_rgba(45,232,255,.95)]" /> Digital card</span>
            <p className="mt-7 w-full text-center text-sm leading-6 text-[#c2d9ec] sm:mt-9 sm:text-left lg:max-w-xl">The person to call when a project needs a clear path up. Let’s connect and move the work forward.</p>
          </div>
          <div className="w-full lg:flex lg:flex-col lg:items-center lg:justify-self-center lg:self-center">
            <div className="grid w-full gap-2 lg:mx-auto lg:w-[300px]">
              <button data-testid="button-save-contact" onClick={downloadVCard} className="action-link inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border border-transparent bg-white px-6 py-4 text-base font-bold text-[#07366f] shadow-[0_6px_14px_rgba(169,226,244,.24)] ring-1 ring-[#b9e3f2] hover:border-[#82bde8]"><Save size={20} />{saved ? 'Contact saved' : 'Save to Contacts'}</button>
              <a data-testid="link-call-hero" href={`tel:${phoneValue}`} className="action-link inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border border-[#9fc5ed] bg-[#cce2ff] px-6 py-4 text-base font-bold text-[#004aad] shadow-[0_5px_12px_rgba(204,226,255,.2)] hover:border-[#82bde8]"><Phone size={19} /> Call {employee.firstName}</a>
              <a data-testid="link-viber-hero" aria-label={`Send ${employee.firstName} a text message`} href={`sms:${phoneValue}`} className="action-link inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border border-[#4c83d2] bg-[#004aad] px-6 py-4 text-base font-bold text-white shadow-[0_5px_12px_rgba(0,74,173,.18)] hover:border-[#82bde8]"><MessageCircle size={20} /> Send a Text Message</a>
            </div>
            <div className="mt-6 flex w-full flex-nowrap justify-center gap-1.5 lg:mx-auto lg:mt-8 lg:w-[300px] lg:gap-2">
              {employee.website && <LinkPill href={employee.website} label="GZR Website" testId="link-website-hero" icon={<Globe2 size={15} />} />}
              {employee.linkedin && <LinkPill href={employee.linkedin} label="LinkedIn" iconOnly testId="link-linkedin-hero" icon={<Linkedin size={17} />} />}
              {employee.phone && <LinkPill href={viberHref} label="Viber" iconOnly testId="link-viber-shortcut" icon={<SiViber size={18} />} />}
            </div>
          </div>
        </div>
      </section>

      <section className="fade-up-2 mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="soft-shadow rounded-[1.5rem] border border-[#d5e4ef] bg-[#f8fbfd] p-5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4 lg:mb-4"><div className="lg:flex lg:items-baseline lg:gap-3"><p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] text-[#3975a7] lg:text-lg lg:tracking-[.08em]">Reach me directly</p><h2 className="display-font mt-2 whitespace-nowrap text-2xl font-semibold tracking-[-.04em] text-[#0d315b] lg:mt-0 lg:text-base lg:font-medium lg:tracking-[-.02em]">Keep this card close.</h2></div><div className="rounded-xl bg-[#dceefd] p-3 text-[#1463a1] lg:p-2.5"><Sparkles size={19} className="lg:h-4 lg:w-4" /></div></div>
          <div className="grid gap-3 lg:gap-2">
            <a data-testid="link-phone" href={`tel:${phoneValue}`} className="action-link group flex min-h-[72px] items-center gap-3 rounded-xl border border-[#d2e2ee] bg-white px-4 hover:border-[#82bde8] lg:min-h-[72px] lg:px-5"><span className="rounded-lg bg-[#e7f3fc] p-2.5 text-[#1164a6] lg:p-2.5"><Phone size={18} /></span><span><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Phone</span><span data-testid="text-phone" className="mt-1 block text-sm font-semibold text-[#123d68]">{employee.phone}</span></span></a>
            <a data-testid="link-email" href={`mailto:${employee.email}`} className="action-link group flex min-h-[72px] items-center gap-3 rounded-xl border border-[#d2e2ee] bg-white px-4 hover:border-[#82bde8] lg:min-h-[72px] lg:px-5"><span className="rounded-lg bg-[#e7f3fc] p-2.5 text-[#1164a6] lg:p-2.5"><Mail size={18} /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Email</span><span data-testid="text-email" className="mt-1 block break-normal text-sm font-semibold text-[#123d68]"><span className="inline-block whitespace-nowrap">{emailUsername}</span><wbr /><span className="inline-block whitespace-nowrap">@{emailDomain}</span></span></span></a>
          </div>
        </div>
        <div className="soft-shadow rounded-[1.5rem] border border-[#d5e4ef] bg-white p-5 sm:p-7 lg:p-6">
          <div className="flex items-start justify-between"><div className="lg:translate-y-1 lg:flex lg:items-baseline lg:gap-3"><p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] text-[#3975a7] lg:text-lg lg:tracking-[.08em]">A note from GZR</p><h2 className="display-font mt-2 whitespace-nowrap text-2xl font-semibold tracking-[-.04em] text-[#0d315b] lg:mt-0 lg:text-base lg:font-medium lg:tracking-[-.02em]">Built for the way up.</h2></div><BriefcaseBusiness size={21} className="text-[#3975a7] lg:h-6 lg:w-6" /></div>
          <p className="mt-6 text-sm leading-6 text-slate-600 lg:mt-7 lg:translate-y-1.5">GZR Enterprises partners with teams that value precision, progress, and a job done right. {employee.firstName} is here to make every next step feel straightforward.</p>
          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 lg:mt-7 lg:pt-4"><img src={logoPath} alt="" className="h-10 w-10 rounded-full" /><div><div className="display-font text-[13px] font-bold tracking-[.1em] text-[#14519a]">GZR <span className="font-normal text-[#7a95b3]">ENTERPRISES</span></div><p className="mt-1 text-[10px] uppercase tracking-[.12em] text-slate-400">Elevators · Escalators · Expertise</p></div></div>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-2 px-2 py-7 text-center text-[10px] font-bold uppercase tracking-[.16em] text-slate-400 sm:flex-row sm:text-left lg:py-5"><span data-testid="text-footer-brand" className="order-2 whitespace-nowrap sm:order-1">© 2026 GZR Enterprises. <span className="whitespace-nowrap">All rights reserved.</span></span><span className="order-1 whitespace-nowrap text-center sm:order-2 sm:text-right">Official Personnel <span className="whitespace-nowrap">– Virtual Business Card</span></span></footer>
    </div>
  </main>;
}

function CardDirectory() {
  return <main className="card-page min-h-[100dvh] px-4 py-5 sm:px-8 sm:py-8 lg:py-4">
    <div className="mx-auto max-w-[880px]">
      <header className="fade-up flex items-center px-1 pb-5 sm:px-2">
        <div className="flex items-center gap-2.5">
          <img src={logoPath} alt="GZR Enterprises mark" className="logo-mark h-9 w-9 rounded-full" />
          <div className="leading-none">
            <div className="display-font whitespace-nowrap text-[18px] font-bold tracking-[.12em] text-[#064798] sm:text-[19px]">GZR <span className="font-normal tracking-[.18em] text-[#6b89aa]">ENTERPRISES</span></div>
          </div>
        </div>
      </header>

      <section className="navy-shadow fade-up-1 relative overflow-hidden rounded-[2rem] bg-[#072d61] text-white">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[32rem] w-[32rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -left-40 -bottom-48 h-[34rem] w-[34rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-[35%] h-56 w-56 rounded-full bg-[#1684c4]/20 blur-3xl" />
        <div className="relative px-7 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#8eb7d9]">Official GZR contact cards</p>
          <h1 className="display-font mt-4 text-[clamp(2.5rem,8vw,5.4rem)] font-semibold leading-[.94] tracking-[-.075em]">Connect directly.</h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#c2d9ec] sm:text-base">Find a direct digital business card for the GZR Enterprises team.</p>
        </div>
      </section>

      <section className="fade-up-2 mt-5">
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] text-[#3975a7]">Employee cards</p>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#c4ddec] bg-white/70 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#266095] sm:px-3 sm:text-[10px] sm:tracking-[.12em]"><span className="h-1.5 w-1.5 rounded-full bg-[#18b6d3] shadow-[0_0_8px_rgba(24,182,211,.95)]" /> Digital cards</span>
        </div>
        <div className="grid gap-3">
          {employeeCards.map((card) => {
            return <a key={card.slug} href={`${import.meta.env.BASE_URL}${card.slug}/`} className="action-link group flex items-center gap-4 rounded-[1.5rem] border border-[#d2e2ee] bg-white p-4 shadow-[0_12px_32px_rgba(33,77,120,.1)] hover:border-[#82bde8] sm:p-5">
              <img src={card.portrait} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover object-[center_27%] sm:h-20 sm:w-20" />
              <span className="min-w-0 flex-1">
                <span className="display-font block text-xl font-semibold tracking-[-.04em] text-[#0d315b] sm:text-2xl"><span className="whitespace-nowrap">{card.employee.firstName}</span>{' '}<span className="whitespace-nowrap">{card.employee.lastName}</span></span>
                 <span className="mt-1 block text-sm text-slate-500"><span className="whitespace-nowrap">{card.employee.title}</span> <span className="mx-1 text-[#82a9c9]">/</span> <span className="whitespace-nowrap">{card.employee.department}</span></span>
              </span>
              <ExternalLink size={18} className="shrink-0 text-[#3975a7] transition-transform group-hover:translate-x-0.5" />
            </a>;
          })}
        </div>
      </section>

      <footer className="px-2 py-8 text-center text-[10px] font-bold uppercase tracking-[.16em] text-slate-400 lg:py-6">© 2026 GZR Enterprises. <span className="whitespace-nowrap">All rights reserved.</span></footer>
    </div>
  </main>;
}

function EmployeeCardRoute({ params }: { params: { slug: string } }) {
  const card = employeeCards.find((entry) => entry.slug === params.slug);
  return card ? <ContactCard card={card} /> : <NotFound />;
}

function restoreFallbackRoute() {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) return;

  const target = new URL(redirect, window.location.origin);
  if (target.origin !== window.location.origin) return;

  window.history.replaceState({}, '', `${target.pathname}${target.search}${target.hash}`);
}

function Router() {
  return <Switch><Route path="/:slug/" component={EmployeeCardRoute} /><Route path="/:slug" component={EmployeeCardRoute} /><Route path="/" component={CardDirectory} /><Route component={NotFound} /></Switch>;
}
function PageTitle() {
  const [location] = useLocation();
  useEffect(() => {
    const slug = location.split('/').filter(Boolean).at(-1);
    const card = employeeCards.find((entry) => entry.slug === slug);
    document.title = card ? `GZR Card | ${card.employee.firstName} ${card.employee.lastName}` : 'GZR Enterprises | Cards';
  }, [location]);
  return null;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  restoreFallbackRoute();
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><PageTitle /><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
