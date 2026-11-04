import { useEffect, useRef, useState } from 'react'
import catalog from './catalog.json'
import './Grade1Catalog.css'

const icons={
 addition:'<path d="M10 24h28M24 10v28"/>',
 subtraction:'<path d="M10 24h28"/>',
 clock:'<circle cx="24" cy="24" r="17"/><path d="M24 12v12l8 5"/>',
 numbers:'<text x="6" y="34" fill="currentColor" stroke="none" font-family="Georgia,serif" font-size="28" font-weight="bold">123</text>',
 compare:'<path d="m9 13 11 9-11 9m30-18-11 9 11 9"/><path d="M7 39h34" opacity=".3"/>',
 operations:'<path d="M8 20h14m-7-7v14m14 7h13"/><circle cx="33" cy="14" r="5" fill="currentColor" stroke="none" opacity=".3"/>',
 shapes:'<rect x="5" y="8" width="19" height="19" rx="4"/><circle cx="33" cy="31" r="11" fill="currentColor" stroke="none" opacity=".22"/><path d="m17 40 10-17 10 17Z"/>',
 measure:'<rect x="6" y="14" width="36" height="22" rx="4" transform="rotate(-18 24 25)"/><path d="m14 20 2 6m6-9 2 6m6-9 2 6"/>',
 pattern:'<circle cx="12" cy="16" r="6"/><rect x="27" y="10" width="12" height="12" rx="3" fill="currentColor" stroke="none" opacity=".25"/><circle cx="12" cy="35" r="6"/><path d="M29 35h10m-5-5v10"/>'
}
const readStage = () => { try { return window.location.hash.startsWith('#chang/') ? decodeURIComponent(window.location.hash.slice(7)) : '' } catch { return '__invalid__' } }
function go(event, path) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
function NavLink({ to, children, ...props }) { return <a href={to} onClick={event => go(event, to)} {...props}>{children}</a> }
function Icon({ kind }) { return <span className="g1-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[kind] || icons.numbers }} /></span> }
function Arrow({ back = false }) { return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back ? 'M36 24H12m12-12L12 24l12 12' : 'M12 24h24M24 12l12 12-12 12'} /></svg> }
function Unpublished() { return <span className="g1-status" data-status="coming-soon">Sắp ra mắt</span> }
function Hero({ stage, headingRef }) { return <section className={'g1-hero' + (stage ? ' g1-stage-hero' : '')}>
  <div><p className="g1-eyebrow">{stage ? 'CHẶNG ' + String(stage.order).padStart(2, '0') : 'MỖI CHẶNG NHỎ, MỘT KHÁM PHÁ MỚI'}</p>
    <h1 ref={headingRef} tabIndex={-1}>{stage ? stage.titleVi : 'Toán tư duy 1'}</h1>
    <p className="g1-subtitle">{stage ? stage.titleEn : 'Grade 1 Mathematics'}</p>
    <p className="g1-intro">{stage ? 'Các bài học trong chặng đang được chuẩn bị. Cùng xem những điều con sẽ khám phá.' : 'Cùng con khám phá toán học, từng bước nhỏ mỗi ngày. Chọn một chặng để xem các bài học bên trong.'}</p>
  </div>
  {stage ? <Icon kind={stage.icon} /> : <div className="g1-hero-art" aria-hidden="true"><span>1</span><span>2</span><span>3</span></div>}
</section> }
function StageCards() { return <><div className="g1-section-heading"><h2>Hành trình khám phá</h2><p>{catalog.stages.length} chặng · {catalog.lessons.length} bài học</p></div>
  <section className="g1-grid" aria-label="Danh sách chặng">{catalog.stages.map(stage => <NavLink key={stage.id} to={'/lop-1#chang/' + stage.id} className="g1-stage" data-stage-id={stage.id} aria-label={'Mở chặng ' + stage.id + ': ' + stage.titleVi}>
    <div className="g1-stage-top"><Icon kind={stage.icon} /><span className="g1-stage-code">CHẶNG {stage.id}</span></div>
    <h3>{stage.titleVi}</h3><p className="g1-stage-en">{stage.titleEn}</p>
    <div className="g1-card-bottom"><div className="g1-meta"><span>{stage.lessonIds.length} bài học</span><Unpublished /></div><span className="g1-arrow"><Arrow /></span></div>
  </NavLink>)}</section></> }
function LessonCards({ stage }) { return <><div className="g1-section-heading"><h2>Bài học trong chặng</h2><p>{stage.lessonIds.length} bài học</p></div>
  <section className="g1-lessons" aria-label="Danh sách bài học">{stage.lessonIds.map(id => { const lesson = catalog.lessons.find(item => item.id === id); return <article key={id} className="g1-lesson" data-source-order={lesson.order}><Icon kind={lesson.icon} /><div><p className="g1-lesson-code">{lesson.displayCode}</p><h3>{lesson.titleVi}</h3><p className="g1-lesson-en">{lesson.titleEn}</p><Unpublished /></div></article> })}</section></> }
export default function Grade1Catalog() {
  const [stageId, setStageId] = useState(readStage)
  const headingRef = useRef(null)
  const stage = catalog.stages.find(item => item.id === stageId)
  useEffect(() => { const update = () => setStageId(readStage()); window.addEventListener('popstate', update); window.addEventListener('hashchange', update); return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update) } }, [])
  useEffect(() => { window.scrollTo(0, 0); headingRef.current?.focus({ preventScroll: true }) }, [stageId])
  useEffect(() => { const previous = document.title; document.title = (stage ? stage.titleVi + ' | ' : '') + 'Toán tư duy 1 | Light Path'; return () => { document.title = previous } }, [stage])
  return <div className="g1-page"><main className="g1-shell"><nav className="g1-crumbs" aria-label="Đường dẫn"><NavLink to="/">Trang chủ</NavLink><span>›</span>{stageId ? <><NavLink to="/lop-1">Toán tư duy 1</NavLink><span>›</span><span aria-current="page">{stage ? stage.titleVi : 'Không tìm thấy chặng học'}</span></> : <span aria-current="page">Toán tư duy 1</span>}</nav>
    {stageId && <NavLink to="/lop-1" className="g1-back"><Arrow back /><span>Quay lại các chặng</span></NavLink>}
    {stageId && !stage ? <h1 ref={headingRef} tabIndex={-1}>Không tìm thấy chặng học</h1> : <><Hero stage={stage} headingRef={headingRef} />{stage ? <LessonCards stage={stage} /> : <StageCards />}</>}
    <p className="g1-note"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden="true"><rect x="12" y="21" width="24" height="20" rx="4" /><path d="M17 21v-7a7 7 0 0 1 14 0v7" /></svg><span>Chỉ bài học đã được duyệt và xuất bản mới mở học.</span></p>
  </main></div>
}
