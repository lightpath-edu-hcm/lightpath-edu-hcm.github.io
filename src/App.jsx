import { useEffect, useMemo, useRef, useState } from 'react'
import { programManifest, activeProgram } from './data/programManifest'
import { moduleManifest } from './data/moduleManifest'
import { lessonManifest, publishedLessons } from './data/lessonManifest'
import './App.css'

const readinessPath = '/hanh-trang-vao-lop-1'
const logoPath = '/brand/light-path-logo.webp'
const navigate = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }
function usePathname() { const [path, setPath] = useState(window.location.pathname); useEffect(() => { const listener = () => setPath(window.location.pathname); window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener) }, []); return path }
function LinkButton({ to, children, className = '', label, onClick }) { return <button type="button" className={className} onClick={() => { onClick?.(); navigate(to) }} aria-label={label}>{children}</button> }
function ContactIcon({ kind }) {
  const paths = {
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
    email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-2 2 10 7L22 6',
    facebook: 'M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v8',
    contact: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 1 1 19 0ZM7 10h10M7 14h6',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[kind]} /></svg>
}
function SiteHeader() {
  const [contactsOpen, setContactsOpen] = useState(false)
  return <header className="site-header simple-header contact-header">
    <LinkButton to="/" className="brand" label="Light Path - Trang chủ"><img className="brand-logo" src={logoPath} alt="" /><span>Light Path</span></LinkButton>
    <button type="button" className="header-contact-toggle" aria-expanded={contactsOpen} aria-controls="header-contacts" onClick={() => setContactsOpen((open) => !open)}><ContactIcon kind="contact" /><span>Liên hệ</span></button>
    <nav id="header-contacts" className={'header-contact-links' + (contactsOpen ? ' is-open' : '')} aria-label="Liên hệ Light Path">
      <a className="header-contact-phone" href="tel:0348537158"><ContactIcon kind="phone" /><span>0348 537 158</span></a>
      <a className="header-contact-email" href="mailto:lightpath.edu.vn@gmail.com"><ContactIcon kind="email" /><span>lightpath.edu.vn@gmail.com</span></a>
      <a className="header-contact-facebook" href="https://www.facebook.com/profile.php?id=61595187590395" target="_blank" rel="noopener noreferrer"><ContactIcon kind="facebook" /><span>Lightpath</span></a>
    </nav>
  </header>
}
function Breadcrumb({ items }) { return <nav className="breadcrumb" aria-label="Đường dẫn">{items.map((item, index) => <span key={item.label}>{item.path ? <LinkButton to={item.path}>{item.label}</LinkButton> : item.label}{index < items.length - 1 && <b>›</b>}</span>)}</nav> }
function Status({ status }) { return <span className={`status ${status}`}>{status === 'published' || status === 'active' ? 'Sẵn sàng' : 'Sắp ra mắt'}</span> }
function HomePage() { return <><SiteHeader /><main className="page home-page"><section className="hero"><p>Khơi nguồn trí tuệ, mở lối tương lai.</p><p className="hero-message"><strong>Hãy để mỗi ngày học toán là một câu chuyện thành công của con.</strong></p></section><section className="program-grid" aria-label="Các chương trình">{programManifest.map((p) => p.status === 'active' ? <LinkButton key={p.id} to={`/${p.slug}`} className="program-card"><strong>{p.titleVi}</strong><small>{p.descriptionVi}</small><Status status="active" /></LinkButton> : <article key={p.id} className="program-card coming"><strong>{p.titleVi}</strong><small>{p.descriptionVi}</small><Status status="coming-soon" /></article>)}</section></main></> }
function ProgramPage() {
  const modules = moduleManifest.filter((module) => module.programId === activeProgram.id)
  return <><SiteHeader /><main className="page readiness-page"><Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: activeProgram.titleVi }]} /><section className="page-heading compact-program-heading"><p>{activeProgram.descriptionVi}</p></section><section className="module-grid">{modules.map((module) => module.status === 'active' ? <LinkButton to={`${readinessPath}/${module.slug}`} className="module-card" key={module.id}><span>Chủ đề {module.order}</span><strong>{module.titleVi}</strong><Status status="active" /></LinkButton> : <article className="module-card coming" key={module.id}><span>Chủ đề {module.order}</span><strong>{module.titleVi}</strong><Status status="coming-soon" /></article>)}</section></main></>
}
function LessonCard({ lesson }) { const available = lesson.status === 'published'; const body = <><span className="lesson-number">{String(lesson.order).padStart(2, '0')}</span><span className="lesson-copy"><strong>{lesson.titleVi}</strong>{lesson.titleEn && <small>{lesson.titleEn}</small>}</span><Status status={lesson.status} /></>; return available ? <LinkButton to={`${readinessPath}/${lesson.slug}`} className="lesson-card" label={`Mở Bài ${lesson.order}: ${lesson.titleVi}`}>{body}</LinkButton> : <article className="lesson-card coming">{body}</article> }
function ModulePage({ module }) {
  const lessons = lessonManifest.filter((lesson) => lesson.moduleId === module.id)
  return <><SiteHeader /><main className="page module-lesson-page"><Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: activeProgram.titleVi, path: readinessPath }, { label: module.titleVi }]} /><p className="module-description">{module.descriptionVi}</p><section className="lesson-grid">{lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</section></main></>
}
function ComingSoonPage({ program }) { return <><SiteHeader /><main className="page coming-page"><Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: program.titleVi }]} /><section><h1>{program.titleVi}</h1><p>{program.descriptionVi}</p><Status status="coming-soon" /></section></main></> }
function HomeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1v-9Z" /></svg> }
function prepareLessonViewport(frame) {
  const doc = frame.contentDocument
  if (!doc?.head) return
  if (doc.getElementById('light-path-embed-layout')) return
  const stylesheet = doc.createElement('link')
  stylesheet.id = 'light-path-embed-layout'
  stylesheet.rel = 'stylesheet'
  stylesheet.href = '/lesson-embed.css'
  doc.head.append(stylesheet)
}

function LessonPlayer({ lesson }) {
  const module = moduleManifest.find((m) => m.id === lesson.moduleId)
  const frameRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined
    const resize = () => prepareLessonViewport(frame)
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [lesson.id])

  useEffect(() => {
    const receiveLessonHome = (event) => {
      if (event.source !== frameRef.current?.contentWindow || event.data?.type !== 'lightpath:lesson-home') return
      navigate(module ? `${readinessPath}/${module.slug}` : readinessPath)
    }
    window.addEventListener('message', receiveLessonHome)
    return () => window.removeEventListener('message', receiveLessonHome)
  }, [lesson.id, module])

  const sharedMobileHome = true
  return <main className={`lesson-player ${sharedMobileHome ? 'lesson-player--shared-mobile-home' : ''}`}><div className="lesson-frame-wrap"><iframe ref={frameRef} onLoad={(event) => prepareLessonViewport(event.currentTarget)} className="lesson-frame" src={lesson.path} title={`Bài ${lesson.order}: ${lesson.titleVi}`} width="100%" height="100%" allow="autoplay; fullscreen" allowFullScreen /></div><div className="lesson-toolbar"><LinkButton to={module ? `${readinessPath}/${module.slug}` : readinessPath} className="player-home" label="Về nhóm bài học"><HomeIcon /></LinkButton></div></main>
}
function NotFound() { return <><SiteHeader /><main className="page coming-page"><h1>Không tìm thấy nội dung</h1><LinkButton className="primary-button" to="/">Về trang chủ</LinkButton></main></> }
export default function App() { const pathname = usePathname(); const lesson = useMemo(() => publishedLessons.find((l) => pathname === `${readinessPath}/${l.slug}`), [pathname]); const module = useMemo(() => moduleManifest.find((m) => pathname === `${readinessPath}/${m.slug}`), [pathname]); const program = useMemo(() => programManifest.find((p) => pathname === `/${p.slug}`), [pathname]); if (lesson) return <LessonPlayer lesson={lesson} />; if (pathname === '/' || pathname === '') return <HomePage />; if (pathname === readinessPath || pathname === `${readinessPath}/`) return <ProgramPage />; if (module) return <ModulePage module={module} />; if (program) return <ComingSoonPage program={program} />; return <NotFound /> }
