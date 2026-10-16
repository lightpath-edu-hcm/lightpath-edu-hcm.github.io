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
function SiteHeader() {
  return <header className="site-header simple-header"><LinkButton to="/" className="brand" label="Light Path - Trang chủ"><img className="brand-logo" src={logoPath} alt="" /><span>Light Path</span></LinkButton></header>
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
