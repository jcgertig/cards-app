export function copyToClipboardSimple(str: string) {
  const el = document.createElement('textarea');
  el.style.opacity = '0';
  el.style.height = '0px';
  el.style.width = '0px';
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
