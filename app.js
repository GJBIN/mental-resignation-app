const reasons = [
  { id: "paint", label: "老板画饼", phrase: "持续供应无法兑现的未来感", boost: 12 },
  { id: "blame", label: "同事甩锅", phrase: "精准承接了别人的锅", boost: 10 },
  { id: "overtime", label: "临时加班", phrase: "下班线被临时拉长", boost: 14 },
  { id: "meeting", label: "无效会议", phrase: "在循环讨论里消耗生命", boost: 9 },
  { id: "client", label: "客户折磨", phrase: "需求以随机数方式变更", boost: 11 },
  { id: "kpi", label: "KPI 压顶", phrase: "数字不大，压强很高", boost: 8 },
  { id: "message", label: "消息轰炸", phrase: "每个红点都在敲门", boost: 7 },
  { id: "boundary", label: "边界消失", phrase: "私人时间被公域化", boost: 13 }
];

const toneMeta = {
  decent: { name: "体面版", label: "体面", state: "体面撤离" },
  sharp: { name: "阴阳版", label: "阴阳", state: "礼貌反击" },
  wild: { name: "疯感版", label: "疯感", state: "灵魂出逃" },
  poetic: { name: "文学版", label: "文学", state: "精神远行" }
};

const bossReplies = [
  "你先把这版方案再改一下，我们晚点开个短会。",
  "公司现在正是关键阶段，你要有主人翁意识。",
  "这个事情不复杂，你同步一下大家的想法就行。",
  "年轻人多承担一点，成长会很快。",
  "需求又微调了一下，不影响整体进度吧。",
  "你先别急，咱们拉个会对齐一下。",
  "这不是加班，这是项目节奏比较紧。",
  "你的想法很好，但我们还是按原方案推进。"
];

const selfReplies = [
  "已读，灵魂离线。",
  "收到，精神层面已交接完毕。",
  "明白，内耗账户已冻结。",
  "好的，本人仅保留肉身在线。",
  "确认，今日情绪已下班。"
];

const defaultLine = "会议可以开，但我的灵魂先撤退。";
const storageKey = "mental-resignation-history";

const elements = {
  reasonGrid: document.querySelector("#reasonGrid"),
  stressInput: document.querySelector("#stressInput"),
  stressValue: document.querySelector("#stressValue"),
  stressBar: document.querySelector("#stressBar"),
  selectedCount: document.querySelector("#selectedCount"),
  customLine: document.querySelector("#customLine"),
  generateButton: document.querySelector("#generateButton"),
  letterOutput: document.querySelector("#letterOutput"),
  letterTone: document.querySelector("#letterTone"),
  bossReply: document.querySelector("#bossReply"),
  selfReply: document.querySelector("#selfReply"),
  shuffleBossButton: document.querySelector("#shuffleBossButton"),
  bossLineInput: document.querySelector("#bossLineInput"),
  crushButton: document.querySelector("#crushButton"),
  crushResult: document.querySelector("#crushResult"),
  shareCard: document.querySelector("#shareCard"),
  cardDate: document.querySelector("#cardDate"),
  cardTitle: document.querySelector("#cardTitle"),
  cardSubtitle: document.querySelector("#cardSubtitle"),
  releaseScore: document.querySelector("#releaseScore"),
  stateLabel: document.querySelector("#stateLabel"),
  greeting: document.querySelector("#greeting"),
  clockText: document.querySelector("#clockText"),
  copyButton: document.querySelector("#copyButton"),
  copyCardButton: document.querySelector("#copyCardButton"),
  saveButton: document.querySelector("#saveButton"),
  refreshCardButton: document.querySelector("#refreshCardButton"),
  resetButton: document.querySelector("#resetButton"),
  themeButton: document.querySelector("#themeButton"),
  historyList: document.querySelector("#historyList"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),
  savedCount: document.querySelector("#savedCount"),
  toast: document.querySelector("#toast")
};

let activeTone = "decent";
let currentLetter = "";
let currentSummary = "";
let toastTimer = 0;

function iconCheck() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`;
}

function renderReasons() {
  elements.reasonGrid.innerHTML = reasons.map((reason, index) => `
    <label class="reason-tile">
      <input type="checkbox" value="${reason.id}" ${index < 3 ? "checked" : ""}>
      ${iconCheck()}
      <span>${reason.label}</span>
    </label>
  `).join("");

  elements.reasonGrid.addEventListener("change", updateAll);
}

function getSelectedReasons() {
  const checked = [...elements.reasonGrid.querySelectorAll("input:checked")].map(input => input.value);
  const selected = reasons.filter(reason => checked.includes(reason.id));
  return selected.length ? selected : [reasons[0]];
}

function getStress() {
  return Number(elements.stressInput.value);
}

function getReleaseScore() {
  const reasonBoost = getSelectedReasons().reduce((sum, reason) => sum + reason.boost, 0);
  return Math.min(99, Math.round(28 + getStress() * 0.45 + reasonBoost * 0.65));
}

function makeLetter() {
  const selected = getSelectedReasons();
  const phrases = selected.map(reason => reason.phrase);
  const line = elements.customLine.value.trim() || defaultLine;
  const reasonText = phrases.join("、");
  const stress = getStress();

  const templates = {
    decent: [
      "尊敬的今日内耗管理处：",
      `由于本人在${reasonText}中持续投入情绪预算，现申请从本日的精神岗位上有序撤离。`,
      `我会保留基本礼貌、基础响应和必要体面，但不再追加无偿焦虑、反复自证与深夜复盘。`,
      `怨气值已记录为 ${stress}/100。${line}`,
      "特此申请今日精神离职。肉身照常在岗，灵魂准点下班。"
    ],
    sharp: [
      "尊敬的高效协同体验中心：",
      `感谢${reasonText}让我再次确认，人的成长确实可以通过反复沉默来完成。`,
      "考虑到本人目前的情绪带宽已经被充分调用，现决定停止无意义消耗，保留微笑，撤回真心。",
      `怨气值 ${stress}/100，数值健康，表达克制。${line}`,
      "本次离职仅发生在精神层面，不影响表格继续转来转去。"
    ],
    wild: [
      "通知：我的灵魂已经打卡下班。",
      `原因包括但不限于：${reasonText}。这些内容已经把我的脑内工位推到消防通道。`,
      "从此刻开始，我拒绝在同一口锅里反复翻炒自己，也拒绝把凌晨的焦虑命名为责任感。",
      `怨气值 ${stress}/100。${line}`,
      "今日精神离职成功。请把剩余内耗转交给空气处理。"
    ],
    poetic: [
      "致今日的工位与风：",
      `我曾在${reasonText}之间认真停留，也曾把一口气咽成一个新的待办。`,
      "现在我把键盘声留在桌面，把心跳带离会议室，把那些没有边界的请求交还给夜色。",
      `怨气值 ${stress}/100。${line}`,
      "今日我不真正辞职，只让精神离开一会儿，去一个没有红点的地方。"
    ]
  };

  return templates[activeTone].join("\n\n");
}

function renderLetter() {
  currentLetter = makeLetter();
  const [title, ...body] = currentLetter.split("\n\n");
  elements.letterOutput.innerHTML = `<h4>${escapeHtml(title)}</h4>${body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}`;
  elements.letterTone.textContent = toneMeta[activeTone].name;
}

function renderBossReply() {
  elements.bossReply.textContent = pick(bossReplies);
  elements.selfReply.textContent = pick(selfReplies);
}

function renderCard() {
  const selected = getSelectedReasons();
  const names = selected.map(reason => reason.label).join("、");
  const score = getReleaseScore();
  const date = new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date());

  elements.cardDate.textContent = date;
  elements.cardTitle.textContent = `${toneMeta[activeTone].state}成功`;
  elements.cardSubtitle.textContent = `从${names}中安全撤离，未发送给任何同事，现实成本保持为 0 元。`;
  elements.releaseScore.textContent = `${score}%`;
  elements.stateLabel.textContent = score >= 88 ? "灵魂已离线" : score >= 72 ? "精神已撤离" : "仍在岗位";
  elements.greeting.textContent = `${toneMeta[activeTone].label}模式，内耗释放 ${score}%`;
  currentSummary = `今日精神离职成功\n原因：${names}\n风格：${toneMeta[activeTone].name}\n内耗释放：${score}%\n现实成本：0 元\n发送状态：未发送`;
}

function updateControls() {
  const selectedLength = getSelectedReasons().length;
  const stress = getStress();
  elements.selectedCount.textContent = `已选 ${selectedLength} 项`;
  elements.stressValue.textContent = stress;
  elements.stressBar.style.width = `${stress}%`;
}

function updateAll() {
  updateControls();
  renderLetter();
  renderCard();
}

function copyText(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(successMessage)).catch(() => fallbackCopy(text, successMessage));
    return;
  }
  fallbackCopy(text, successMessage);
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast(successMessage);
}

function saveSession() {
  const selected = getSelectedReasons();
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    time: new Date().toISOString(),
    tone: toneMeta[activeTone].name,
    reasons: selected.map(reason => reason.label),
    score: getReleaseScore(),
    line: elements.customLine.value.trim() || defaultLine
  });
  localStorage.setItem(storageKey, JSON.stringify(history.slice(0, 12)));
  renderHistory();
  showToast("已存入本地记录");
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  elements.savedCount.textContent = history.length;
  if (!history.length) {
    elements.historyList.innerHTML = `<p class="empty-state">暂无记录。完成一次精神离职后会出现在这里。</p>`;
    return;
  }

  elements.historyList.innerHTML = history.map(item => {
    const date = new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(item.time));
    return `
      <article class="history-item">
        <div>
          <strong>${escapeHtml(item.reasons.join("、"))}</strong>
          <span>${date} · ${escapeHtml(item.tone)} · ${escapeHtml(item.line)}</span>
        </div>
        <em>${item.score}%</em>
      </article>
    `;
  }).join("");
}

function clearHistory() {
  localStorage.removeItem(storageKey);
  renderHistory();
  showToast("记录已清空");
}

function updateClock() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(18, 0, 0, 0);

  if (now > target) {
    elements.clockText.textContent = "今日已越过下班线，精神可提前退场。";
    return;
  }

  const diff = target - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  elements.clockText.textContent = `距离下班线 ${hours} 小时 ${minutes} 分钟`;
}

function crushBossLine() {
  const line = elements.bossLineInput.value.trim();
  if (!line) {
    elements.crushResult.textContent = "等待粉碎一句无效沟通。";
    return;
  }
  const endings = [
    "已粉碎为：这不是你的问题。",
    "已粉碎为：边界感正在恢复。",
    "已粉碎为：拒绝把焦虑包装成成长。",
    "已粉碎为：这句话不再进入你的夜晚。"
  ];
  elements.crushResult.textContent = `${line} ${pick(endings)}`;
  showToast("语录已粉碎");
}

function resetApp() {
  elements.reasonGrid.querySelectorAll("input").forEach((input, index) => {
    input.checked = index < 3;
  });
  elements.stressInput.value = 68;
  activeTone = "decent";
  document.querySelectorAll("[data-tone]").forEach(button => button.classList.toggle("is-active", button.dataset.tone === activeTone));
  elements.customLine.value = "";
  elements.bossLineInput.value = "";
  elements.crushResult.textContent = "等待粉碎一句无效沟通。";
  renderBossReply();
  updateAll();
  showToast("已重新开始");
}

function bindEvents() {
  elements.stressInput.addEventListener("input", updateAll);
  elements.customLine.addEventListener("input", updateAll);
  elements.generateButton.addEventListener("click", () => {
    renderBossReply();
    updateAll();
    showToast("精神离职已生成");
  });
  elements.shuffleBossButton.addEventListener("click", renderBossReply);
  elements.refreshCardButton.addEventListener("click", () => {
    renderCard();
    showToast("卡片已刷新");
  });
  elements.copyButton.addEventListener("click", () => copyText(currentLetter, "信件已复制"));
  elements.copyCardButton.addEventListener("click", () => copyText(currentSummary, "卡片文案已复制"));
  elements.saveButton.addEventListener("click", saveSession);
  elements.clearHistoryButton.addEventListener("click", clearHistory);
  elements.crushButton.addEventListener("click", crushBossLine);
  elements.resetButton.addEventListener("click", resetApp);
  elements.themeButton.addEventListener("click", () => document.body.classList.toggle("focus-mode"));

  document.querySelectorAll("[data-tone]").forEach(button => {
    button.addEventListener("click", () => {
      activeTone = button.dataset.tone;
      document.querySelectorAll("[data-tone]").forEach(item => item.classList.toggle("is-active", item === button));
      updateAll();
    });
  });

  document.querySelectorAll("[data-jump]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-jump]").forEach(item => item.classList.toggle("is-active", item === button));
      document.querySelector(`#${button.dataset.jump}`).scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[char]));
}

renderReasons();
bindEvents();
renderBossReply();
updateAll();
renderHistory();
updateClock();
setInterval(updateClock, 30000);
