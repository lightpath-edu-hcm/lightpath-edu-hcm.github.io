/* Owner-approved Lesson 1 browser help, shared by the readiness Lesson Player.
   UI, intent, clipboard and dismissal behavior are frozen to that candidate. */
(() => {
  const ua = navigator.userAgent;
  if (!/Zalo|FBAN|FBAV|FB_IAB|FBIOS|YouTube/i.test(ua)) return;
  if (document.querySelector('dialog.browser-help')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./browser-help.css', document.currentScript.src).href;

  // Use the existing Player URL, including its route, rather than the iframe URL.
  let lessonUrl = location.href;
  try { lessonUrl = window.top.location.href; } catch { /* Standalone URL remains usable. */ }
  const url = new URL(lessonUrl);
  if (!/^https?:$/.test(url.protocol)) return;

  const android = /Android/i.test(ua);
  const apple = /iPhone|iPad|iPod/i.test(ua);
  const dialog = document.createElement('dialog');
  dialog.className = 'browser-help';
  dialog.setAttribute('aria-labelledby', 'browser-help-title');
  dialog.setAttribute('aria-describedby', 'browser-help-description');
  dialog.innerHTML = `
    <div class="browser-help-body">
      <h2 id="browser-help-title" class="browser-help-title">Mở bằng Chrome để học tốt hơn</h2>
      <p id="browser-help-description" class="browser-help-description">Mở bằng Chrome để nghe tiếng Anh và xem bài học tốt hơn.</p>
      <div class="browser-help-actions"></div>
      <p class="browser-help-fallback" role="status" hidden>Nếu Chrome chưa mở, hãy sao chép link và dán vào Chrome.</p>
      <label class="browser-help-link" hidden>Link bài học<input readonly type="text" aria-label="Liên kết bài học để sao chép"></label>
      <p class="browser-help-status" role="status" hidden></p>
    </div>
    <div class="browser-help-footer"><button type="button" class="browser-help-continue">Tiếp tục tại đây</button></div>`;
  const input = dialog.querySelector('input');
  input.value = url.href;
  input.addEventListener('click', () => input.select());
  const actions = dialog.querySelector('.browser-help-actions');
  const fallback = dialog.querySelector('.browser-help-fallback');
  let launchTimer;
  let leftPage = false;
  const cancelLaunchCheck = () => { clearTimeout(launchTimer); launchTimer = null; };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') { leftPage = true; cancelLaunchCheck(); }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', cancelLaunchCheck);
  dialog.addEventListener('close', () => {
    cancelLaunchCheck();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', cancelLaunchCheck);
  }, { once: true });
  if (android) {
    const chrome = document.createElement('a');
    chrome.textContent = 'Mở Chrome';
    chrome.target = '_top';
    chrome.href = `intent://${url.host}${url.pathname}${url.search}${url.hash}#Intent;scheme=${url.protocol.slice(0, -1)};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`;
    chrome.addEventListener('click', () => {
      cancelLaunchCheck(); leftPage = false; fallback.hidden = true;
      // There is no reliable intent result API. Offer help only after a launch
      // attempt when this page still remains visible; do not claim failure.
      launchTimer = setTimeout(() => {
        if (dialog.open && !leftPage && document.visibilityState === 'visible') fallback.hidden = false;
      }, 2000);
    });
    actions.append(chrome);
  }
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Sao chép link';
  copy.addEventListener('click', async () => {
    const status = dialog.querySelector('.browser-help-status');
    cancelLaunchCheck();
    try {
      await navigator.clipboard.writeText(url.href);
      if (!dialog.open) return;
      status.hidden = false;
      status.textContent = `Đã sao chép. Hãy dán vào ${apple ? 'Safari' : 'Chrome'}.`;
    } catch {
      if (!dialog.open) return;
      dialog.querySelector('.browser-help-link').hidden = false;
      status.hidden = false;
      status.textContent = 'Nhấn giữ link để sao chép thủ công.';
      input.focus(); input.select();
    }
  });
  actions.append(copy);
  dialog.querySelector('.browser-help-continue').addEventListener('click', () => dialog.close());
  document.body.append(dialog);
  // No automatic redirect and no persistent dismissal across separate visits.
  // Wait for CSS so WebViews never flash the large lesson typography here.
  stylesheet.addEventListener('load', () => dialog.showModal(), { once: true });
  stylesheet.addEventListener('error', () => {
    dialog.style.cssText = 'box-sizing:border-box;width:calc(100% - 24px);max-width:440px;max-height:calc(100dvh - 24px);overflow:auto;padding:16px;font:16px/1.4 Arial,sans-serif';
    dialog.showModal();
  }, { once: true });
  document.head.append(stylesheet);
})();
