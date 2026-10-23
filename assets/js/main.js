(function () {
  'use strict';

  const list = document.getElementById('checklist');
  if (!list) return;

  const KEY = 'wcag22-checklista';
  const boxes = Array.from(list.querySelectorAll('input[type="checkbox"]'));
  const progress = document.getElementById('progress');
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');

  const update = () => {
    const done = boxes.filter((b) => b.checked).length;
    progress.textContent = 'Ukończono ' + done + ' z ' + boxes.length + ' punktów.';
  };

  boxes.forEach((box) => {
    box.checked = Boolean(saved[box.id]);
    box.addEventListener('change', () => {
      saved[box.id] = box.checked;
      localStorage.setItem(KEY, JSON.stringify(saved));
      update();
    });
  });

  document.getElementById('reset-checklist').addEventListener('click', () => {
    boxes.forEach((b) => { b.checked = false; });
    localStorage.removeItem(KEY);
    Object.keys(saved).forEach((k) => delete saved[k]);
    update();
  });

  update();
})();
