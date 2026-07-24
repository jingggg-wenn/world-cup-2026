// ── Banner Frames (shared) ────────────────────────────────────────────────────
const BANNER_FRAMES = [
  [
    "                                                    ",
    "    o                                               ",
    "   /|\\      WORLD CUP 2026                         ",
    "   / \\                                             ",
    "  /   \\                                            ",
    "=========================================           "
  ],
  [
    "                                                    ",
    "   \\o       WORLD CUP 2026                         ",
    "    |\\                                              ",
    "   / \\  _                                          ",
    "  /     (@)                                        ",
    "=========================================           "
  ],
  [
    "                                                    ",
    "   \\o/      WORLD CUP 2026                         ",
    "    |                                               ",
    "   / \\      _                                      ",
    "  /        (@)                                     ",
    "=========================================           "
  ],
  [
    "                                                    ",
    "   \\o/      WORLD CUP 2026                         ",
    "    |                                               ",
    "   / \\            _                                ",
    "  /              (@)                               ",
    "=========================================           "
  ],
  [
    "                                                    ",
    "    o        WORLD CUP 2026                         ",
    "   /|\\                                             ",
    "   / \\                 _                           ",
    "  /                   (@)                          ",
    "=========================================           "
  ],
  [
    "                                                    ",
    "    o        WORLD CUP 2026                         ",
    "   /|\\                        __|__                ",
    "   / \\                       |     |               ",
    "  /                   (@)    |     |               ",
    "==============================     =================="
  ],
  [
    "                                                    ",
    "    o        WORLD CUP 2026                         ",
    "   /|\\                         __|__               ",
    "   / \\                (@)     |     |              ",
    "  /                          |     |               ",
    "==============================     =================="
  ],
  [
    "                                          GOOOAL!   ",
    "   \\o/      WORLD CUP 2026                __|__    ",
    "    |                          (@)        |     |   ",
    "   / \\                                   |     |   ",
    "  /                                      |     |   ",
    "==========================================     ====="
  ]
];

function startBannerAnimation(el) {
  let frame = 0;
  function animate() {
    el.textContent = BANNER_FRAMES[frame].join('\n');
    frame = (frame + 1) % BANNER_FRAMES.length;
  }
  animate();
  return setInterval(animate, 500);
}

// Start animation on login banner immediately
const loginBannerEl = document.getElementById('login-banner');
if (loginBannerEl) startBannerAnimation(loginBannerEl);

// ── Auth Gate ─────────────────────────────────────────────────────────────────
const BT_PASS = 'worldcup2026';

(function authGate() {
  if (localStorage.getItem('bt-auth') === 'true') {
    showApp();
    return;
  }
  const loginBtn = document.getElementById('login-btn');
  const loginPw = document.getElementById('login-pw');
  const loginErr = document.getElementById('login-error');

  function attempt() {
    if (loginPw.value === BT_PASS) {
      localStorage.setItem('bt-auth', 'true');
      showApp();
    } else {
      loginErr.textContent = 'Wrong password';
      loginPw.value = '';
    }
  }

  loginBtn.addEventListener('click', attempt);
  loginPw.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') attempt();
  });
})();

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-content').style.display = 'block';
  initApp();
}

function initApp() {

// ── State ──────────────────────────────────────────────────────────────────
let editingId = null;
let nextId = 10;
let openGroups = {};

let bets = [
  { id: 1,  match: 'Mexico vs Korea',        date: '2025-06-19', pick: 'Korea wins',          stake: 3,  odds: 3.40, status: 'lost'    },
  { id: 2,  match: 'Mexico vs Korea',        date: '2025-06-19', pick: 'Draw',                stake: 3,  odds: 3.05, status: 'lost'    },
  { id: 3,  match: 'Mexico vs Korea',        date: '2025-06-19', pick: 'Both teams to score', stake: 2,  odds: 1.55, status: 'lost'    },
  { id: 4,  match: 'Mexico vs Korea',        date: '2025-06-19', pick: 'Over 2.5 goals',      stake: 2,  odds: 1.93, status: 'lost'    },
  { id: 5,  match: 'Turkey vs Paraguay',     date: '2025-06-20', pick: 'Paraguay wins',       stake: 5,  odds: 2.05, status: 'won'     },
  { id: 6,  match: 'Germany vs Ivory Coast', date: '2025-06-21', pick: 'Germany wins',        stake: 110, odds: 1.30, status: 'won' },
  { id: 7,  match: 'Spain vs Saudi Arabia', date: '2026-06-22', pick: 'Saudi Arabia wins',   stake: 1,   odds: 12.00, status: 'lost' },
  { id: 8,  match: 'New Zealand vs Egypt',  date: '2026-06-22', pick: '4 Goals',              stake: 10,  odds: 1.30, status: 'won' },
  { id: 9,  match: 'South Africa vs Korea', date: '2026-06-25', pick: 'Korea wins',           stake: 10,  odds: 1.50, status: 'lost' },
  { id: 17, match: 'South Africa vs Korea', date: '2026-06-25', pick: 'Draw halftime',        stake: 1,   odds: 1.17, status: 'won' },
  { id: 18, match: 'South Africa vs Korea', date: '2026-06-25', pick: 'Draw',                 stake: 1,   odds: 3.50, status: 'lost' },
  { id: 19, match: 'South Africa vs Korea', date: '2026-06-25', pick: 'Both teams score',     stake: 1,   odds: 2.90, status: 'lost' },
  { id: 10, match: 'Argentina vs Austria',  date: '2026-06-23', pick: 'Argentina scores last', stake: 5,   odds: 1.20, status: 'won' },
  { id: 11, match: 'Argentina vs Austria',  date: '2026-06-23', pick: '2 Goals',               stake: 1,   odds: 2.65, status: 'won' },
  { id: 12, match: 'Norway vs Senegal',    date: '2026-06-23', pick: 'Over 4.5 goals',        stake: 2,   odds: 1.72, status: 'won' },
  { id: 13, match: 'Portugal vs Uzbekistan', date: '2026-06-24', pick: 'Portugal wins',       stake: 50,  odds: 1.10, status: 'won' },
  { id: 14, match: 'Portugal vs Uzbekistan', date: '2026-06-24', pick: 'Portugal - Portugal', stake: 10,  odds: 1.40, status: 'won' },
  { id: 15, match: 'Panama vs Croatia',      date: '2026-06-24', pick: 'Croatia wins',        stake: 10,  odds: 1.33, status: 'won' },
  { id: 16, match: 'England vs Ghana',       date: '2026-06-24', pick: 'England wins',        stake: 22,  odds: 1.15, status: 'lost' },
  { id: 20, match: 'New Zealand vs Belgium', date: '2026-06-27', pick: 'Belgium scores last', stake: 5,   odds: 1.10, status: 'won' },
  { id: 21, match: 'Egypt vs Iran',          date: '2026-06-27', pick: 'Draw',                stake: 2,   odds: 1.82, status: 'won' },
  { id: 22, match: 'Double',                date: null,         pick: 'England (1.05x) + Argentina (1.03x)', stake: 10, odds: 1.082, status: 'won' },
  { id: 23, match: 'Jordan vs Argentina',   date: '2026-06-28', pick: 'Argentina scores 3rd goal', stake: 1, odds: 1.25, status: 'lost' },
  { id: 24, match: 'Jordan vs Argentina',   date: '2026-06-28', pick: 'Argentina -3.5',            stake: 1, odds: 2.02, status: 'lost' },
  { id: 25, match: 'Spain vs Argentina',    date: '2026-07-20', pick: 'Spain wins',               stake: 8, odds: 2.25, status: 'lost' },
  { id: 26, match: 'Spain vs Argentina',    date: '2026-07-20', pick: 'Argentina wins',           stake: 8, odds: 2.80, status: 'lost' },
  { id: 27, match: 'Spain vs Argentina',    date: '2026-07-20', pick: 'Under 2.5 goals',          stake: 2, odds: 2.03, status: 'lost' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n)       { return '$' + Math.abs(n).toFixed(2); }
function fmtS(n)      { return (n >= 0 ? '+' : '-') + fmt(n); }

function fmtDate(d) {
  if (!d) return '';
  const [, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return parseInt(day) + ' ' + months[parseInt(m) - 1];
}

function calcPL(bet) {
  if (bet.status === 'lost') return -bet.stake;
  if (bet.status === 'won' && bet.odds) return parseFloat(((bet.odds * bet.stake) - bet.stake).toFixed(2));
  return null;
}

function calcReturn(bet) {
  if (bet.status === 'won' && bet.odds) return parseFloat((bet.odds * bet.stake).toFixed(2));
  if (bet.status === 'lost') return 0;
  return null;
}

function groupBets() {
  const keys = [], groups = {};
  bets.forEach(bet => {
    const key = bet.match + '|' + (bet.date || '');
    if (!groups[key]) { keys.push(key); groups[key] = { key, match: bet.match, date: bet.date, bets: [] }; }
    groups[key].bets.push(bet);
  });
  return keys.map(k => groups[k]).sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return 1;
    return a.date.localeCompare(b.date);
  });
}

function safeKey(key) { return key.replace(/[^a-z0-9]/gi, '_'); }

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  const groups = groupBets();
  groups.forEach(g => { if (openGroups[g.key] === undefined) openGroups[g.key] = false; });

  const list = document.getElementById('match-list');
  list.innerHTML = '';

  groups.forEach(group => {
    const isOpen = openGroups[group.key];
    const allPending = group.bets.every(b => b.status === 'pending');
    const groupPL = group.bets.reduce((s, b) => { const pl = calcPL(b); return s + (pl !== null ? pl : 0); }, 0);
    const potPL   = group.bets.reduce((s, b) => b.status === 'pending' && b.odds ? s + parseFloat((b.odds * b.stake - b.stake).toFixed(2)) : s, 0);
    const groupStake = group.bets.reduce((s, b) => s + b.stake, 0);

    const displayPL = allPending ? potPL : groupPL;
    const plClass   = allPending ? 'pending' : displayPL >= 0 ? 'pos' : 'neg';
    const plLabel   = allPending ? fmtS(potPL) + ' if all win' : fmtS(groupPL) + ' net';

    const block = document.createElement('div');
    block.className = 'match-block';
    block.innerHTML = `
      <div class="match-toggle" onclick="toggleGroup('${group.key.replace(/'/g, "\\'")}')">
        <div class="match-toggle-left">
          <svg class="chevron ${isOpen ? 'open' : ''}" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="match-title">${group.match}</span>
          ${group.date ? `<span class="match-date">${fmtDate(group.date)}</span>` : ''}
        </div>
        <div class="match-toggle-right">
          <span class="match-stake">${fmt(groupStake)} staked</span>
          <span class="match-net ${plClass}">${plLabel}</span>
        </div>
      </div>
      <div class="match-body ${isOpen ? 'open' : ''}" id="body-${safeKey(group.key)}">
        <table>
          <thead>
            <tr>
              <th style="width:30%">Pick</th>
              <th style="width:10%">Stake</th>
              <th style="width:9%">Odds</th>
              <th style="width:14%">Return</th>
              <th style="width:12%">P/L</th>
              <th style="width:11%">Status</th>
              <th style="width:14%"></th>
            </tr>
          </thead>
          <tbody id="tbody-${safeKey(group.key)}"></tbody>
        </table>
      </div>
    `;
    list.appendChild(block);
    renderGroupRows(group);
  });

  updateMetrics();
}

function renderGroupRows(group) {
  const tbody = document.getElementById('tbody-' + safeKey(group.key));
  if (!tbody) return;
  tbody.innerHTML = '';

  group.bets.forEach(bet => {
    if (editingId === bet.id) {
      const tr = document.createElement('tr');
      tr.className = 'edit-row';
      tr.innerHTML = `
        <td><input class="edit-input" type="text" id="e-pick" value="${bet.pick}" /></td>
        <td><input class="edit-input mono" type="number" id="e-stake" value="${bet.stake}" step="0.01" min="0" /></td>
        <td><input class="edit-input mono" type="number" id="e-odds"  value="${bet.odds || ''}" step="0.01" min="1" placeholder="--" /></td>
        <td colspan="2" class="dim" style="font-size:11px">editing...</td>
        <td>
          <select class="edit-input" id="e-status">
            <option value="pending" ${bet.status === 'pending' ? 'selected' : ''}>Upcoming</option>
            <option value="won"     ${bet.status === 'won'     ? 'selected' : ''}>Won</option>
            <option value="lost"    ${bet.status === 'lost'    ? 'selected' : ''}>Lost</option>
          </select>
        </td>
        <td style="white-space:nowrap">
          <button class="icon-btn save"   onclick="saveEdit(${bet.id})"  aria-label="Save">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-btn cancel" onclick="cancelEdit()"         aria-label="Cancel">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
      return;
    }

    const pl      = calcPL(bet);
    const ret     = calcReturn(bet);
    const potRet  = bet.odds ? parseFloat((bet.odds * bet.stake).toFixed(2)) : null;
    const potBPL  = bet.odds ? parseFloat((bet.odds * bet.stake - bet.stake).toFixed(2)) : null;

    let badgeClass = 'b-pending', badgeLabel = 'Upcoming';
    if (bet.status === 'won')  { badgeClass = 'b-win';  badgeLabel = 'Won';  }
    if (bet.status === 'lost') { badgeClass = 'b-loss'; badgeLabel = 'Lost'; }

    let plCell = '<span class="dim">--</span>';
    if      (bet.status === 'pending' && potBPL !== null) plCell = `<span class="pos mono">${fmtS(potBPL)}</span>`;
    else if (pl !== null)                                 plCell = `<span class="${pl >= 0 ? 'pos' : 'neg'} mono">${fmtS(pl)}</span>`;

    let retCell = '<span class="dim">--</span>';
    if      (bet.status === 'pending' && potRet !== null) retCell = `<span class="dim mono">${fmt(potRet)}</span>`;
    else if (ret !== null)                                retCell = `<span class="mono">${fmt(ret)}</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="pick-cell">${bet.pick}</td>
      <td class="mono">${fmt(bet.stake)}</td>
      <td class="mono">${bet.odds ? bet.odds.toFixed(2) + 'x' : '<span class="dim">--</span>'}</td>
      <td>${retCell}</td>
      <td>${plCell}</td>
      <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
      <td style="white-space:nowrap">
        <button class="icon-btn"     onclick="startEdit(${bet.id})"  aria-label="Edit">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="icon-btn del" onclick="deleteBet(${bet.id})" aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4H12M5 4V2.5H9V4M5.5 6.5V10.5M8.5 6.5V10.5M3 4L3.8 11.5H10.2L11 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Actions ──────────────────────────────────────────────────────────────────
function toggleGroup(key) {
  openGroups[key] = !openGroups[key];
  render();
}

function startEdit(id)  { editingId = id;   render(); }
function cancelEdit()   { editingId = null; render(); }

function saveEdit(id) {
  const pick   = document.getElementById('e-pick').value.trim();
  const stake  = parseFloat(document.getElementById('e-stake').value);
  const odds   = parseFloat(document.getElementById('e-odds').value);
  const status = document.getElementById('e-status').value;
  const idx    = bets.findIndex(b => b.id === id);
  if (idx === -1 || isNaN(stake)) return;
  bets[idx] = { ...bets[idx], pick: pick || '--', stake, odds: isNaN(odds) ? null : odds, status };
  editingId = null;
  render();
}

function deleteBet(id) {
  bets = bets.filter(b => b.id !== id);
  if (editingId === id) editingId = null;
  render();
}

function addBet() {
  const match  = document.getElementById('f-match').value.trim();
  const date   = document.getElementById('f-date').value || null;
  const pick   = document.getElementById('f-pick').value.trim();
  const stake  = parseFloat(document.getElementById('f-stake').value);
  const odds   = parseFloat(document.getElementById('f-odds').value);
  const status = document.getElementById('f-status').value;
  if (!match || isNaN(stake) || stake <= 0) return;
  bets.push({ id: nextId++, match, date, pick: pick || '--', stake, odds: isNaN(odds) ? null : odds, status });
  document.getElementById('f-match').value = '';
  document.getElementById('f-date').value  = '';
  document.getElementById('f-pick').value  = '';
  document.getElementById('f-stake').value = '';
  document.getElementById('f-odds').value  = '';
  document.getElementById('f-status').value = 'pending';
  render();
}

// ── Metrics ──────────────────────────────────────────────────────────────────
function updateMetrics() {
  const settled       = bets.filter(b => b.status !== 'pending');
  const totalStaked   = settled.reduce((s, b) => s + b.stake, 0);
  const totalReturned = settled.reduce((s, b) => s + (calcReturn(b) || 0), 0);
  const realizedPL    = parseFloat((totalReturned - totalStaked).toFixed(2));
  const roi           = totalStaked > 0 ? parseFloat(((realizedPL / totalStaked) * 100).toFixed(1)) : 0;

  document.getElementById('metrics').innerHTML = `
    <div class="metric"><div class="metric-label">Total staked</div><div class="metric-value">${fmt(totalStaked)}</div></div>
    <div class="metric"><div class="metric-label">Total returned</div><div class="metric-value">${fmt(totalReturned)}</div></div>
    <div class="metric"><div class="metric-label">Realized P/L</div><div class="metric-value ${realizedPL >= 0 ? 'pos' : 'neg'}">${fmtS(realizedPL)}</div></div>
    <div class="metric"><div class="metric-label">ROI</div><div class="metric-value ${roi >= 0 ? 'pos' : 'neg'}">${roi >= 0 ? '+' : ''}${roi}%</div></div>
  `;
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('bt-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('bt-theme', 'light');
  }
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('bt-auth');
  location.reload();
});

// ── ASCII Banner Animation ───────────────────────────────────────────────────
startBannerAnimation(document.getElementById('ascii-banner'));

// Expose functions used by inline onclick handlers
window.toggleGroup = toggleGroup;
window.startEdit = startEdit;
window.cancelEdit = cancelEdit;
window.saveEdit = saveEdit;
window.deleteBet = deleteBet;

// ── Init ──────────────────────────────────────────────────────────────────────
render();

} // end initApp
