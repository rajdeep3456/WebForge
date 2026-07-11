/**
 * Returns the inspector script as a string to be injected into iframe.
 * This script handles element selection and communicates via postMessage.
 */
export function getInspectorScript(): string {
  return `
<script>
(function() {
  let hoveredEl = null;
  let selectedEl = null;
  let selectedPath = null;

  // Generate a unique path to identify elements
  function getElementPath(el) {
    if (!el || el === document.body) return null;
    const path = [];
    while (el && el !== document.body) {
      let selector = el.tagName.toLowerCase();
      if (el.id) {
        selector += '#' + el.id;
        path.unshift(selector);
        break; // ID is unique, no need to go further
      } else {
        const siblings = Array.from(el.parentNode?.children || []);
        const sameTagSiblings = siblings.filter(s => s.tagName === el.tagName);
        if (sameTagSiblings.length > 1) {
          const index = sameTagSiblings.indexOf(el) + 1;
          selector += ':nth-of-type(' + index + ')';
        }
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(' > ');
  }

  // Find element by path
  function getElementByPath(path) {
    if (!path) return null;
    try {
      return document.querySelector(path);
    } catch { return null; }
  }

  document.body.addEventListener('mouseover', (e) => {
    if (selectedEl) return;
    const target = e.target;
    if (target === document.body) return;
    if (hoveredEl && hoveredEl !== target) {
      hoveredEl.style.outline = '';
    }
    hoveredEl = target;
    hoveredEl.style.outline = '2px dotted blue';
  });

  document.body.addEventListener('mouseout', (e) => {
    if (selectedEl) return;
    if (hoveredEl) {
      hoveredEl.style.outline = '';
      hoveredEl = null;
    }
  });

  document.body.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target === document.body) return;

    if (selectedEl && selectedEl !== target) {
      selectedEl.style.outline = '';
      selectedEl.removeAttribute('contenteditable');
    }

    selectedEl = target;
    selectedPath = getElementPath(target);
    selectedEl.style.outline = '2px solid red';
    selectedEl.setAttribute('contenteditable', 'true');
    selectedEl.focus();

    // Get computed styles for the settings panel
    const computedStyle = window.getComputedStyle(target);

    // Send selected element info to parent
    window.parent.postMessage({
      type: 'ELEMENT_SELECTED',
      tagName: target.tagName,
      path: selectedPath,
      innerText: target.innerText || '',
      innerHTML: target.innerHTML || '',
      src: target.src || null,
      alt: target.alt || null,
      className: target.className || '',
      computedStyle: {
        fontSize: computedStyle.fontSize,
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        textAlign: computedStyle.textAlign,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        borderRadius: computedStyle.borderRadius
      }
    }, '*');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedEl) {
      selectedEl.style.outline = '';
      selectedEl.removeAttribute('contenteditable');
      window.parent.postMessage({ type: 'ELEMENT_DESELECTED' }, '*');
      selectedEl = null;
      selectedPath = null;
    }
  });

  // Listen for input changes on contenteditable elements
  document.body.addEventListener('input', (e) => {
    if (selectedEl && e.target === selectedEl) {
      window.parent.postMessage({
        type: 'ELEMENT_CONTENT_CHANGED',
        path: selectedPath,
        innerText: selectedEl.innerText,
        innerHTML: selectedEl.innerHTML
      }, '*');
    }
  });

  // Listen for commands from parent
  window.addEventListener('message', (e) => {
    const data = e.data || {};
    const { type, path, property, value } = data;
    
    if (type === 'APPLY_STYLE') {
      const el = path ? getElementByPath(path) : selectedEl;
      if (el) {
        el.style[property] = value;
      }
    }
    
    if (type === 'SET_ATTRIBUTE') {
      const el = path ? getElementByPath(path) : selectedEl;
      if (el) {
        el.setAttribute(property, value);
      }
    }

    if (type === 'SET_CLASS') {
      const el = path ? getElementByPath(path) : selectedEl;
      if (el) {
        el.className = value;
      }
    }
    
    if (type === 'DESELECT') {
      if (selectedEl) {
        selectedEl.style.outline = '';
        selectedEl.removeAttribute('contenteditable');
      }
      selectedEl = null;
      selectedPath = null;
    }

    if (type === 'GET_HTML') {
      // Clone and clean up before sending
      const clone = document.documentElement.cloneNode(true);
      clone.querySelectorAll('*').forEach(el => {
        el.style.outline = '';
        el.removeAttribute('contenteditable');
      });
      // Remove the inspector script from the saved HTML
      const scripts = clone.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.textContent && script.textContent.includes('ELEMENT_SELECTED')) {
          script.remove();
        }
      });
      window.parent.postMessage({
        type: 'HTML_CONTENT',
        html: clone.outerHTML
      }, '*');
    }
  });

  console.log('[Inspector] Loaded and ready');
})();
</script>`;
}
