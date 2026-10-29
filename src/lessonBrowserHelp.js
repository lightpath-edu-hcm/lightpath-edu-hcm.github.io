// Integration only: leave each approved lesson's content and layout untouched.
export function installLessonBrowserHelp(frame) {
  const doc = frame.contentDocument
  if (!doc?.head || doc.getElementById('light-path-browser-help')) return
  const script = doc.createElement('script')
  script.id = 'light-path-browser-help'
  script.src = '/lesson-browser-help/browser-help.js'
  doc.head.append(script)
}
