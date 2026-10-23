(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Formularze ---------- */
  const badForm = $('#bad-form');
  if (badForm) {
    $('#bad-form-submit').addEventListener('click', () => {
      $$('input', badForm).forEach((input) => {
        input.style.borderColor = input.value.trim() ? '' : 'red';
      });
    });
  }

  const goodForm = $('#good-form');
  if (goodForm) {
    goodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const summary = $('#good-form-summary');
      const list = $('ul', summary);
      list.innerHTML = '';
      const errors = [];

      const checks = [
        { id: 'g-name', test: (v) => v.trim().length > 0, msg: 'Podaj imię.' },
        { id: 'g-email', test: (v) => /^\S+@\S+\.\S+$/.test(v), msg: 'Podaj adres e-mail w formacie nazwa@domena.pl.' },
      ];

      checks.forEach(({ id, test, msg }) => {
        const input = $('#' + id);
        const err = $('#' + id + '-error');
        if (!test(input.value)) {
          input.setAttribute('aria-invalid', 'true');
          err.textContent = 'Błąd: ' + msg;
          errors.push({ id, msg });
        } else {
          input.removeAttribute('aria-invalid');
          err.textContent = '';
        }
      });

      const contact = $('input[name="g-contact"]:checked', goodForm);
      const contactErr = $('#g-contact-error');
      if (!contact) {
        contactErr.textContent = 'Błąd: wybierz preferowany sposób kontaktu.';
        errors.push({ id: 'g-contact-email', msg: 'Wybierz preferowany sposób kontaktu.' });
      } else {
        contactErr.textContent = '';
      }

      if (errors.length) {
        errors.forEach(({ id, msg }) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#' + id;
          a.textContent = msg;
          a.addEventListener('click', (ev) => { ev.preventDefault(); $('#' + id).focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        $('h3', summary).textContent = 'Formularz zawiera błędy (' + errors.length + ')';
        summary.focus();
        $('#good-form-success').textContent = '';
      } else {
        summary.hidden = true;
        $('#good-form-success').textContent = 'Dziękujemy! Formularz został wysłany.';
      }
    });
  }

  /* ---------- Fałszywy przycisk vs prawdziwy ---------- */
  $$('[data-demo-click]').forEach((el) => {
    el.addEventListener('click', () => {
      const out = $('#' + el.dataset.demoClick);
      out.textContent = 'Kliknięto: ' + new Date().toLocaleTimeString('pl-PL');
    });
  });

  /* ---------- Modal zły ---------- */
  const badModalOpen = $('#bad-modal-open');
  if (badModalOpen) {
    const backdrop = $('#bad-modal');
    badModalOpen.addEventListener('click', () => { backdrop.hidden = false; });
    $('#bad-modal-close').addEventListener('click', () => { backdrop.hidden = true; });
  }

  /* ---------- Modal dobry (natywny <dialog>) ---------- */
  const goodModalOpen = $('#good-modal-open');
  if (goodModalOpen) {
    const dialog = $('#good-modal');
    goodModalOpen.addEventListener('click', () => dialog.showModal());
    $$('[data-close-dialog]', dialog).forEach((b) =>
      b.addEventListener('click', () => dialog.close())
    );
    dialog.addEventListener('close', () => goodModalOpen.focus());
  }

  /* ---------- Zakładki (wzorzec APG) ---------- */
  $$('[role="tablist"]').forEach((tablist) => {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); }
      });
    });
  });

  /* ---------- Akordeon ---------- */
  $$('.accordion button[aria-expanded]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      $('#' + btn.getAttribute('aria-controls')).hidden = open;
    });
  });

  /* ---------- Komunikaty (live region) ---------- */
  let counter = 0;
  const badCart = $('#bad-cart');
  if (badCart) {
    badCart.addEventListener('click', () => {
      counter++;
      $('#bad-cart-msg').textContent = 'Dodano do koszyka (' + counter + ')';
    });
    $('#good-cart').addEventListener('click', () => {
      counter++;
      $('#good-cart-msg').textContent = 'Dodano do koszyka (' + counter + ')';
    });
  }

  /* ---------- Przycisk przełączający ---------- */
  $$('button[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    });
  });

  /* ---------- Animacja ---------- */
  const animToggle = $('#anim-toggle');
  if (animToggle) {
    const spinner = $('#good-spinner');
    animToggle.addEventListener('click', () => {
      const paused = spinner.classList.toggle('paused');
      animToggle.textContent = paused ? 'Wznów animację' : 'Zatrzymaj animację';
    });
  }

  /* ---------- Tester kontrastu ---------- */
  const fg = $('#c-fg');
  if (fg) {
    const bg = $('#c-bg');
    const lum = (hex) => {
      const rgb = hex.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16) / 255);
      const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const update = () => {
      const l1 = lum(fg.value);
      const l2 = lum(bg.value);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const preview = $('#c-preview');
      preview.style.color = fg.value;
      preview.style.background = bg.value;
      $('#c-fg-val').textContent = fg.value;
      $('#c-bg-val').textContent = bg.value;
      $('#c-ratio').textContent = ratio.toFixed(2) + ':1';
      const rows = [
        ['c-aa-normal', 4.5], ['c-aa-large', 3], ['c-aaa-normal', 7], ['c-aaa-large', 4.5], ['c-ui', 3],
      ];
      rows.forEach(([id, min]) => {
        const cell = $('#' + id);
        const ok = ratio >= min;
        cell.textContent = ok ? '✓ Spełnia' : '✗ Nie spełnia';
        cell.className = ok ? 'result-pass' : 'result-fail';
      });
    };
    fg.addEventListener('input', update);
    bg.addEventListener('input', update);
    update();
  }

  /* ---------- Sortowanie: przeciąganie + przyciski ---------- */
  const enableDrag = (list) => {
    let dragged = null;
    list.addEventListener('dragstart', (e) => { dragged = e.target.closest('li'); });
    list.addEventListener('dragover', (e) => e.preventDefault());
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      const target = e.target.closest('li');
      if (dragged && target && dragged !== target) {
        const after = target.compareDocumentPosition(dragged) & Node.DOCUMENT_POSITION_PRECEDING;
        target.parentNode.insertBefore(dragged, after ? target.nextSibling : target);
      }
    });
  };
  $$('.sortable').forEach(enableDrag);

  const goodSort = $('#good-sort');
  if (goodSort) {
    const status = $('#good-sort-status');
    goodSort.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-move]');
      if (!btn) return;
      const li = btn.closest('li');
      const name = $('.item-name', li).textContent;
      if (btn.dataset.move === 'up' && li.previousElementSibling) {
        li.parentNode.insertBefore(li, li.previousElementSibling);
      } else if (btn.dataset.move === 'down' && li.nextElementSibling) {
        li.parentNode.insertBefore(li.nextElementSibling, li);
      } else {
        status.textContent = name + ' jest już na skraju listy.';
        return;
      }
      btn.focus();
      const pos = $$('li', goodSort).indexOf(li) + 1;
      status.textContent = name + ': pozycja ' + pos + ' z ' + goodSort.children.length + '.';
    });
  }

  /* ---------- Zbędne wprowadzanie ---------- */
  const sameAddr = $('#same-address');
  if (sameAddr) {
    sameAddr.addEventListener('change', () => {
      $('#billing-fields').hidden = sameAddr.checked;
    });
  }

  /* ---------- Uwierzytelnianie ---------- */
  const badPass = $('#bad-pass');
  if (badPass) {
    badPass.addEventListener('paste', (e) => {
      e.preventDefault();
      $('#bad-pass-msg').textContent = 'Wklejanie jest zablokowane!';
    });
  }
  const showPass = $('#show-pass');
  if (showPass) {
    showPass.addEventListener('click', () => {
      const input = $('#good-pass');
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      showPass.setAttribute('aria-pressed', String(!visible));
    });
  }
})();
