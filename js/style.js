const Dialogue = (() => {
  const box = document.getElementById('dialog');
  const nameEl = document.getElementById('dialog-name');
  const textEl = document.getElementById('dialog-text');
  const hintEl = document.getElementById('dialog-hint');

  let queue = [];
  let typing = null;     // interval id while typewriter is running
  let currentFullText = '';

  function showLine(line) {
    const { name = '', text = '' } = typeof line === 'string' ? { text: line } : line;

    nameEl.textContent = name;
    nameEl.classList.toggle('has-name', !!name);

    textEl.textContent = '';
    hintEl.classList.remove('show');
    currentFullText = text;

    let i = 0;
    clearInterval(typing);
    typing = setInterval(() => {
      textEl.textContent += currentFullText[i];
      i++;
      if (i >= currentFullText.length) {
        clearInterval(typing);
        typing = null;
        hintEl.classList.add('show');
      }
    }, 30); // typing speed in ms per character
  }

  function advance() {
    if (typing) {
      // skip to end of current line instead of advancing
      clearInterval(typing);
      typing = null;
      textEl.textContent = currentFullText;
      hintEl.classList.add('show');
      return;
    }
    queue.shift();
    if (queue.length) {
      showLine(queue[0]);
    } else {
      close();
    }
  }

  function say(lines) {
    queue = Array.isArray(lines) ? lines.slice() : [lines];
    box.classList.add('active');
    showLine(queue[0]);
  }

  function close() {
    box.classList.remove('active');
    clearInterval(typing);
    typing = null;
  }

  function isOpen() {
    return box.classList.contains('active');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b' && isOpen()) {
      advance();
    }
  });

  // click/tap to advance too, handy for testing without a controller
  box.addEventListener('click', () => { if (isOpen()) advance(); });

  return { say, advance, close, isOpen };
})();