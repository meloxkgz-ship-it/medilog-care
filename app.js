const STORAGE_KEY = "medilog-state-v1";
const VAULT_KEY = "medilog-vault-v1";
const FREE_MEDICINE_LIMIT = 2;
const YEARLY_PREMIUM_PRODUCT_ID = "com.medilog.care.premium.yearly";
const MONTHLY_PREMIUM_PRODUCT_ID = "com.medilog.care.premium.monthly";
const DEFAULT_PREMIUM_PRODUCTS = [
  {
    id: YEARLY_PREMIUM_PRODUCT_ID,
    displayName: "Jaehrlich",
    description: "Bester Wert fuer Alltag, Pflege und Export.",
    displayPrice: "29,99 €",
    period: "pro Jahr",
    featured: true,
    badge: "Bester Wert",
  },
  {
    id: MONTHLY_PREMIUM_PRODUCT_ID,
    displayName: "Monatlich",
    description: "Flexibel starten und jederzeit kuendbar.",
    displayPrice: "3,99 €",
    period: "pro Monat",
    featured: false,
    badge: "Flexibel",
  },
];

const medilogNative = (() => {
  const callbacks = new Map();
  let sequence = 0;

  window.__medilogNativeResolve = (id, result, error) => {
    const callback = callbacks.get(id);
    if (!callback) return;
    callbacks.delete(id);
    if (error) callback.reject(new Error(error));
    else callback.resolve(result);
  };

  return {
    get available() {
      return Boolean(window.webkit?.messageHandlers?.medilogNative);
    },
    call(action, payload = {}) {
      if (!this.available) return Promise.reject(new Error("Native Bridge nicht verfuegbar"));

      return new Promise((resolve, reject) => {
        const id = `native-${Date.now()}-${sequence++}`;
        callbacks.set(id, { resolve, reject });
        window.webkit.messageHandlers.medilogNative.postMessage({ id, action, payload });
        window.setTimeout(() => {
          if (!callbacks.has(id)) return;
          callbacks.delete(id);
          reject(new Error("Native Antwort hat zu lange gedauert"));
        }, 12000);
      });
    },
  };
})();

let nativeCapabilities = {
  platform: "web",
  secureStorage: false,
  notifications: "web",
  cameraScan: false,
  biometrics: false,
};
let nativeSecureStorageReady = false;
let nativeSaveTimer = null;

const seedState = {
  activeFilter: "all",
  activeProfileId: "profile-self",
  settings: {
    onboarded: false,
    remindersEnabled: false,
    reminderDelayMinutes: 15,
    vaultEnabled: false,
    seniorMode: false,
    waterGoal: 2000,
    premiumActive: false,
    premiumPreview: false,
    premiumSource: "none",
    premiumUntil: null,
    privacyConsentAt: null,
  },
  profiles: [
    { id: "profile-self", name: "Ich", role: "Selbst" },
    { id: "profile-care", name: "Mama", role: "Pflege" },
  ],
  medicines: [
    { id: "med-ramipril", profileId: "profile-self", name: "Ramipril", dose: "5 mg", time: "08:00", stock: 6, refillAt: 7 },
    { id: "med-vitamin-d", profileId: "profile-self", name: "Vitamin D", dose: "1000 IE", time: "09:00", stock: 31, refillAt: 10 },
    { id: "med-abend", profileId: "profile-care", name: "Abendmedikation", dose: "laut eigenem Plan", time: "21:30", stock: 18, refillAt: 7 },
  ],
  completedToday: {},
  hydration: {},
  history: [
    { type: "done", title: "Vitamin D dokumentiert", detail: "09:04", date: new Date().toISOString() },
    { type: "done", title: "Ramipril dokumentiert", detail: "08:06", date: new Date().toISOString() },
    {
      type: "note",
      title: "Hinweis",
      detail: "Nur eigene Angaben, keine automatische medizinische Bewertung.",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

let state = loadState();
let activeVaultPin = null;
let premiumProducts = DEFAULT_PREMIUM_PRODUCTS.map((product) => ({ ...product }));
let selectedPremiumProductId = YEARLY_PREMIUM_PRODUCT_ID;

const elements = {
  title: document.querySelector("#view-title"),
  date: document.querySelector("#current-date"),
  searchButton: document.querySelector("#search-button"),
  searchPanel: document.querySelector("#search-panel"),
  searchInput: document.querySelector("#search-input"),
  doseList: document.querySelector("#dose-list"),
  doseEmpty: document.querySelector("#dose-empty"),
  completionText: document.querySelector("#completion-text"),
  completionBar: document.querySelector("#completion-bar"),
  adherencePill: document.querySelector("#adherence-pill"),
  nextDose: document.querySelector("#next-dose"),
  nextDoseName: document.querySelector("#next-dose-name"),
  lowStockCount: document.querySelector("#low-stock-count"),
  medicineGrid: document.querySelector("#medicine-grid"),
  medicineEmpty: document.querySelector("#medicine-empty"),
  historyScore: document.querySelector("#history-score"),
  historyBars: document.querySelector("#history-bars"),
  historyList: document.querySelector("#history-list"),
  calendarStrip: document.querySelector("#calendar-strip"),
  careDashboard: document.querySelector("#care-dashboard"),
  profileList: document.querySelector("#profile-list"),
  stockList: document.querySelector("#stock-list"),
  reminderStatus: document.querySelector("#reminder-status"),
  reminderDelay: document.querySelector("#reminder-delay"),
  openDoseCount: document.querySelector("#open-dose-count"),
  settingWaterGoal: document.querySelector("#setting-water-goal"),
  settingReminderDelay: document.querySelector("#setting-reminder-delay"),
  settingRemindersEnabled: document.querySelector("#setting-reminders-enabled"),
  settingSeniorMode: document.querySelector("#setting-senior-mode"),
  refillSettingsList: document.querySelector("#refill-settings-list"),
  premiumStatus: document.querySelector("#premium-status"),
  premiumPlans: document.querySelector("#premium-plans"),
  premiumButton: document.querySelector("#premium-button"),
  premiumButtonLabel: document.querySelector("#premium-button-label"),
  privacyConsentStatus: document.querySelector("#privacy-consent-status"),
  waterFill: document.querySelector("#water-fill"),
  waterTotal: document.querySelector("#water-total"),
  waterGoal: document.querySelector("#water-goal"),
  waterDots: document.querySelector("#water-dots"),
  vaultStatus: document.querySelector("#vault-status"),
  vaultPin: document.querySelector("#vault-pin"),
  quickSheet: document.querySelector("#quick-sheet"),
  onboardingSheet: document.querySelector("#onboarding-sheet"),
  reportSheet: document.querySelector("#report-sheet"),
  reportPreview: document.querySelector("#report-preview"),
  reportRange: document.querySelector("#report-range"),
  medicineSheet: document.querySelector("#medicine-sheet"),
  noteSheet: document.querySelector("#note-sheet"),
  profileSheet: document.querySelector("#profile-sheet"),
  scanSheet: document.querySelector("#scan-sheet"),
  medicineForm: document.querySelector("#medicine-form"),
  noteForm: document.querySelector("#note-form"),
  profileForm: document.querySelector("#profile-form"),
  scanForm: document.querySelector("#scan-form"),
  onboardingForm: document.querySelector("#onboarding-form"),
  toast: document.querySelector("#toast"),
};

function loadState() {
  if (localStorage.getItem(VAULT_KEY)) {
    return { ...structuredClone(seedState), medicines: [], history: [] };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(seedState);

  try {
    return hydrateState(JSON.parse(stored));
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  if (nativeSecureStorageReady) {
    localStorage.removeItem(STORAGE_KEY);
    scheduleNativeStateSave();
    return;
  }

  if (!state.settings?.vaultEnabled) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (state.settings?.vaultEnabled && activeVaultPin) {
    void encryptVault(activeVaultPin).catch(() => showToast("Vault konnte nicht aktualisiert werden"));
  }
}

function hydrateState(incoming) {
  const merged = { ...structuredClone(seedState), ...incoming };
  merged.settings = { ...seedState.settings, ...incoming.settings };
  merged.settings.premiumActive = Boolean(incoming.settings?.premiumActive || incoming.settings?.premiumPreview);
  merged.settings.premiumSource = incoming.settings?.premiumSource || (merged.settings.premiumActive ? "legacy" : "none");
  merged.settings.premiumUntil = incoming.settings?.premiumUntil || null;
  merged.profiles = incoming.profiles?.length ? incoming.profiles : seedState.profiles;
  merged.medicines = (incoming.medicines || seedState.medicines).map((medicine) => ({
    refillAt: 7,
    profileId: merged.activeProfileId || "profile-self",
    ...medicine,
  }));
  return merged;
}

function scheduleNativeStateSave() {
  if (!medilogNative.available || !nativeSecureStorageReady) return;
  window.clearTimeout(nativeSaveTimer);
  nativeSaveTimer = window.setTimeout(() => {
    medilogNative.call("saveSecureState", { state }).catch(() => {
      nativeSecureStorageReady = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });
  }, 80);
}

async function bootstrapNative() {
  if (!medilogNative.available) return;

  try {
    nativeCapabilities = { ...nativeCapabilities, ...(await medilogNative.call("environment")) };
    nativeSecureStorageReady = Boolean(nativeCapabilities.secureStorage);

    const [stored, entitlement, productsEnvelope] = await Promise.all([
      medilogNative.call("loadSecureState"),
      medilogNative.call("premiumStatus"),
      medilogNative.call("premiumProducts").catch(() => null),
    ]);

    if (stored?.exists && stored.state) {
      state = hydrateState(stored.state);
      localStorage.removeItem(STORAGE_KEY);
    }

    applyPremiumEntitlement(entitlement, { silent: true });
    setPremiumProducts(productsEnvelope?.products);

    if (nativeSecureStorageReady) {
      localStorage.removeItem(STORAGE_KEY);
      scheduleNativeStateSave();
    }

    await syncNativeReminders({ silent: true });
    render();
  } catch {
    showToast("Native iOS-Funktionen nicht voll verfuegbar");
  }
}

function applyPremiumEntitlement(entitlement, options = {}) {
  if (entitlement?.pending) {
    if (!options.silent) showToast("Kauf wartet auf Bestaetigung");
    return false;
  }
  if (!entitlement?.active) return false;
  state.settings.premiumActive = true;
  state.settings.premiumPreview = false;
  state.settings.premiumSource = entitlement.source || "ios";
  state.settings.premiumUntil = entitlement.expiresAt || null;
  if (!options.silent) showToast("Premium ist aktiv");
  return true;
}

function isPremium() {
  return Boolean(state.settings.premiumActive);
}

function setPremiumProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return;

  const defaultsById = new Map(DEFAULT_PREMIUM_PRODUCTS.map((product) => [product.id, product]));
  premiumProducts = products
    .filter((product) => product?.id && defaultsById.has(product.id))
    .map((product) => {
      const fallback = defaultsById.get(product.id);
      return { ...fallback, ...product, displayName: fallback.displayName, storeDisplayName: product.displayName || fallback.displayName };
    })
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  if (!premiumProducts.some((product) => product.id === selectedPremiumProductId)) {
    selectedPremiumProductId = premiumProducts[0]?.id || YEARLY_PREMIUM_PRODUCT_ID;
  }
}

function getSelectedPremiumProduct() {
  return premiumProducts.find((product) => product.id === selectedPremiumProductId) || premiumProducts[0] || DEFAULT_PREMIUM_PRODUCTS[0];
}

function requirePremium(feature) {
  if (isPremium()) return true;
  showToast(`Premium erforderlich: ${feature}`);
  switchView("schutz");
  return false;
}

function routeToHash(hashValue = location.hash.slice(1)) {
  const route = hashValue || "home";
  const views = new Set(["home", "plaene", "bibliothek", "verlauf", "schutz"]);

  if (views.has(route)) {
    switchView(route, { updateHash: false });
    return;
  }

  if (route === "premium") {
    switchView("schutz", { updateHash: false });
    document.querySelector(".premium-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (route === "water") {
    switchView("home", { updateHash: false });
    document.querySelector(".hydration-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (route === "dose") {
    switchView("home", { updateHash: false });
    window.setTimeout(() => elements.quickSheet.showModal(), 180);
  }
}

function requirePrivacyConsent(feature) {
  if (state.settings.privacyConsentAt) return true;
  showToast(`Bitte Datenschutz bestaetigen: ${feature}`);
  switchView("schutz");
  return false;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDone(medicineId) {
  return Boolean(state.completedToday[todayKey()]?.[medicineId]);
}

function setDone(medicineId, done) {
  const key = todayKey();
  state.completedToday[key] = state.completedToday[key] || {};
  state.completedToday[key][medicineId] = done;
}

function getVisibleMedicines() {
  const query = elements.searchInput.value.trim().toLowerCase();
  return getProfileMedicines().filter((medicine) => {
    const matchesQuery = [medicine.name, medicine.dose, medicine.time].some((value) =>
      value.toLowerCase().includes(query),
    );
    const matchesFilter =
      state.activeFilter === "all" ||
      (state.activeFilter === "open" && !isDone(medicine.id)) ||
      (state.activeFilter === "low" && Number(medicine.stock) <= Number(medicine.refillAt || 7));

    return matchesQuery && matchesFilter;
  });
}

function getProfileMedicines() {
  return state.medicines.filter((medicine) => medicine.profileId === state.activeProfileId);
}

function render() {
  renderDate();
  renderDoses();
  renderMedicines();
  renderHistory();
  renderCalendar();
  renderProfiles();
  renderCareDashboard();
  renderStock();
  renderSettings();
  renderHydration();
  updateMetrics();
  document.body.classList.toggle("senior", Boolean(state.settings.seniorMode));
  refreshIcons();
}

function renderCareDashboard() {
  const profiles = isPremium() ? state.profiles : state.profiles.filter((profile) => profile.id === state.activeProfileId).slice(0, 1);
  elements.careDashboard.innerHTML = profiles
    .map((profile) => {
      const medicines = state.medicines.filter((medicine) => medicine.profileId === profile.id);
      const open = medicines.filter((medicine) => !isDone(medicine.id)).length;
      const low = medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)).length;
      const done = medicines.length > 0 && open === 0;
      return `
        <button class="care-card ${profile.id === state.activeProfileId ? "active" : ""}" type="button" data-profile-id="${profile.id}">
          <span class="care-avatar">${escapeHtml(profile.name.slice(0, 1))}</span>
          <span>
            <strong>${escapeHtml(profile.name)}</strong>
            <small>${done ? "alles erledigt" : `${open} offen`} · ${low} Vorrat niedrig</small>
          </span>
          <i data-lucide="${done ? "circle-check" : "clock-3"}"></i>
        </button>
      `;
    })
    .join("");

  if (!isPremium()) {
    elements.careDashboard.innerHTML += `<button class="care-card locked" type="button" data-premium-feature="Pflege-Cockpit">
      <span class="care-avatar"><i data-lucide="lock"></i></span>
      <span><strong>Pflege-Cockpit</strong><small>Mehrere Personen nur mit Premium</small></span>
      <i data-lucide="sparkles"></i>
    </button>`;
  }
}

function renderDate() {
  elements.date.textContent = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
}

function renderDoses() {
  const medicines = getVisibleMedicines().sort((a, b) => a.time.localeCompare(b.time));
  elements.doseEmpty.classList.toggle("hidden", medicines.length > 0);
  elements.doseList.innerHTML = medicines
    .map((medicine, index) => {
      const done = isDone(medicine.id);
      return `
        <button class="dose-item ${done ? "done" : ""}" type="button" data-dose-id="${medicine.id}" style="animation-delay:${index * 45}ms">
          <span class="dose-check" aria-hidden="true">${done ? '<i data-lucide="check"></i>' : ""}</span>
          <span class="dose-main">
            <strong>${escapeHtml(medicine.name)}</strong>
            <span>${escapeHtml(medicine.dose)}</span>
          </span>
          <span class="dose-meta">${medicine.time}</span>
          <i class="dose-chevron" data-lucide="chevron-right"></i>
        </button>
      `;
    })
    .join("");
}

function renderMedicines() {
  const medicines = getProfileMedicines();
  elements.medicineEmpty.classList.toggle("hidden", medicines.length > 0);
  elements.medicineGrid.innerHTML = medicines
    .map((medicine) => {
      const low = Number(medicine.stock) <= Number(medicine.refillAt || 7);
      return `
        <article class="med-card">
          <div class="med-visual" aria-hidden="true"></div>
          <div>
            <h3>${escapeHtml(medicine.name)}</h3>
            <p>${escapeHtml(medicine.dose)} · ${medicine.time}</p>
          </div>
          <span class="stock-pill ${low ? "low" : ""}">${medicine.stock} Einheiten</span>
        </article>
      `;
    })
    .join("");
}

function renderProfiles() {
  const profiles = isPremium() ? state.profiles : state.profiles.filter((profile) => profile.id === state.activeProfileId).slice(0, 1);
  elements.profileList.innerHTML = profiles
    .map(
      (profile) => `
        <button class="profile-card ${profile.id === state.activeProfileId ? "active" : ""}" type="button" data-profile-id="${profile.id}">
          <i data-lucide="${profile.id === "profile-self" ? "user-round" : "heart-handshake"}"></i>
          <span><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.role)}</small></span>
        </button>
      `,
    )
    .join("");

  if (!isPremium()) {
    elements.profileList.innerHTML += `<button class="profile-card locked" type="button" data-premium-feature="Pflegeprofile">
      <i data-lucide="lock"></i>
      <span><strong>Weitere Profile</strong><small>Nur mit Premium</small></span>
    </button>`;
  }
}

function renderStock() {
  if (!isPremium()) {
    elements.stockList.innerHTML = `<div class="stock-row locked" data-premium-feature="Vorratsmanagement"><i data-lucide="lock"></i><span><strong>Vorratsmanagement</strong><small>Nachkauf, Grenzen und Liste sind Premium.</small></span></div>`;
    return;
  }

  const low = getProfileMedicines().filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7));
  elements.stockList.innerHTML =
    low.length > 0
      ? low
          .map(
            (medicine) => `
              <div class="stock-row">
                <i data-lucide="shopping-bag"></i>
                <span><strong>${escapeHtml(medicine.name)}</strong><small>${medicine.stock} uebrig · Schwelle ${medicine.refillAt}</small></span>
                <button type="button" data-restock-id="${medicine.id}">+14</button>
              </div>
            `,
          )
          .join("")
      : `<div class="stock-row calm"><i data-lucide="circle-check"></i><span><strong>Alles im gruenen Bereich</strong><small>Keine Nachkauf-Erinnerung fuer dieses Profil.</small></span></div>`;
}

function renderPremiumPlans() {
  const selected = getSelectedPremiumProduct();
  elements.premiumPlans.innerHTML = premiumProducts
    .map((product) => {
      const active = product.id === selected.id;
      return `
        <button class="plan-option ${active ? "active" : ""}" type="button" role="radio" aria-checked="${active}" data-premium-product-id="${escapeHtml(product.id)}">
          <span>
            <strong>${escapeHtml(product.displayName)}</strong>
            <small>${escapeHtml(product.badge || product.description || "")}</small>
          </span>
          <span class="plan-price">
            <b>${escapeHtml(product.displayPrice)}</b>
            <em>${escapeHtml(product.period || "")}</em>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSettings() {
  renderPremiumPlans();
  elements.settingWaterGoal.value = Number(state.settings.waterGoal || 2000);
  elements.settingReminderDelay.value = String(state.settings.reminderDelayMinutes || 15);
  elements.settingRemindersEnabled.checked = Boolean(state.settings.remindersEnabled);
  elements.settingSeniorMode.checked = Boolean(state.settings.seniorMode);
  elements.premiumStatus.textContent = isPremium()
    ? `Premium aktiv${state.settings.premiumSource && state.settings.premiumSource !== "none" ? ` · ${state.settings.premiumSource}` : ""}`
    : `Free: Mini-Modus (${FREE_MEDICINE_LIMIT} Medis)`;
  elements.premiumButtonLabel.textContent = isPremium()
    ? "Premium aktiv"
    : nativeCapabilities.platform === "ios"
    ? `${getSelectedPremiumProduct().displayName} kaufen`
    : `${getSelectedPremiumProduct().displayName} Webvorschau`;
  elements.privacyConsentStatus.textContent = state.settings.privacyConsentAt ? "bestaetigt" : "offen";
  document.querySelector("#native-status").textContent =
    nativeCapabilities.platform === "ios" ? "iOS: Keychain, lokale Notifications, QR-Scan" : "Web/PWA: Browser-Funktionen";
  document.querySelector("#privacy-storage-status").textContent = nativeSecureStorageReady
    ? "Verschluesselter iOS-Speicher. Schluessel liegt in der Keychain dieses Geraets."
    : "Lokaler Browser-Speicher. Optionaler PIN-Vault nutzt Web Crypto.";

  const medicines = getProfileMedicines();
  elements.refillSettingsList.innerHTML =
    !isPremium()
      ? `<div class="stock-row locked" data-premium-feature="Nachkaufgrenzen"><i data-lucide="lock"></i><span><strong>Nachkaufgrenzen</strong><small>Vorratsmanagement ist Premium.</small></span></div>`
      : medicines.length > 0
      ? medicines
          .map(
            (medicine) => `
              <label class="refill-row">
                <span><strong>${escapeHtml(medicine.name)}</strong><small>Aktuell ${medicine.stock} Einheiten</small></span>
                <input type="number" min="0" max="99" step="1" value="${medicine.refillAt || 7}" data-refill-setting-id="${medicine.id}" />
              </label>
            `,
          )
          .join("")
      : `<div class="stock-row calm"><i data-lucide="pill"></i><span><strong>Noch keine Medikamente</strong><small>Erfasse Medikamente, um Nachkaufgrenzen zu setzen.</small></span></div>`;
}

function renderHydration() {
  const entry = getHydrationEntry();
  const percent = Math.min(100, Math.round((entry.amount / entry.goal) * 100));
  elements.waterFill.style.height = `${percent}%`;
  elements.waterTotal.textContent = `${(entry.amount / 1000).toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} L`;
  elements.waterGoal.textContent = `von ${(entry.goal / 1000).toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} L Tagesziel`;
  const glasses = Math.round(entry.goal / 250);
  const done = Math.min(glasses, Math.floor(entry.amount / 250));
  elements.waterDots.innerHTML = Array.from({ length: glasses }, (_, index) => `<span class="${index < done ? "done" : ""}"></span>`).join("");
}

function addWater(amount = 250) {
  if (!requirePrivacyConsent("Wasser dokumentieren")) return;
  const entry = getHydrationEntry();
  entry.amount = Math.min(4000, Number(entry.amount) + amount);
  addHistory("water", "Wasser getrunken", `${amount} ml dokumentiert`);
  saveState();
  render();
  showToast("Wasser dokumentiert");
}

function getHydrationEntry() {
  const key = todayKey();
  state.hydration[key] = state.hydration[key] || {};
  if (state.hydration[key].amount !== undefined) {
    state.hydration[key] = { [state.activeProfileId]: state.hydration[key] };
  }
  state.hydration[key][state.activeProfileId] = state.hydration[key][state.activeProfileId] || {
    amount: 0,
    goal: Number(state.settings.waterGoal || 2000),
  };
  state.hydration[key][state.activeProfileId].goal = Number(state.settings.waterGoal || state.hydration[key][state.activeProfileId].goal || 2000);
  return state.hydration[key][state.activeProfileId];
}

function renderHistory() {
  const adherence = getAdherence();
  elements.historyScore.textContent = `${adherence}%`;
  elements.historyBars.innerHTML = getSevenDayStats()
    .map((value) => `<span class="bar" style="height:${Math.max(12, value)}%"></span>`)
    .join("");

  elements.historyList.innerHTML = state.history
    .slice(0, 10)
    .map((entry) => {
      const icon = entry.type === "note" ? "notebook-pen" : "check";
      const time = new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(entry.date));
      return `
        <div class="history-row">
          <i data-lucide="${icon}"></i>
          <div>
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.detail)}</span>
          </div>
          <time>${time}</time>
        </div>
      `;
    })
    .join("");
}

function renderCalendar() {
  const formatter = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
  const now = new Date();
  elements.calendarStrip.innerHTML = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - 3 + offset);
    const key = day.toISOString().slice(0, 10);
    const profileMedicineIds = new Set(getProfileMedicines().map((medicine) => medicine.id));
    const doneCount = Object.entries(state.completedToday[key] || {}).filter(
      ([medicineId, done]) => profileMedicineIds.has(medicineId) && done,
    ).length;
    return `
      <div class="day-pill ${doneCount > 0 ? "done" : ""}">
        <span>${formatter.format(day)}</span>
        <strong>${String(day.getDate()).padStart(2, "0")}</strong>
      </div>
    `;
  }).join("");
}

function updateMetrics() {
  const medicines = getProfileMedicines();
  const total = medicines.length;
  const done = medicines.filter((medicine) => isDone(medicine.id)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  elements.completionText.textContent = `${done} von ${total} erledigt`;
  elements.completionBar.style.width = `${percent}%`;
  elements.adherencePill.textContent = `${getAdherence()}% diese Woche`;

  const next = medicines
    .filter((medicine) => !isDone(medicine.id))
    .sort((a, b) => a.time.localeCompare(b.time))[0];
  elements.nextDose.textContent = next?.time || "--:--";
  elements.nextDoseName.textContent = next?.name || "Keine offene Einnahme";

  const open = medicines.filter((medicine) => !isDone(medicine.id)).length;
  elements.lowStockCount.textContent = medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)).length;
  elements.openDoseCount.textContent = open;
  elements.reminderStatus.textContent = getReminderStatus();
  elements.reminderDelay.textContent = `${state.settings.reminderDelayMinutes} min`;
  elements.vaultStatus.textContent = nativeSecureStorageReady
    ? state.settings.vaultEnabled
      ? "iOS + PIN"
      : "iOS verschluesselt"
    : state.settings.vaultEnabled
    ? "aktiv"
    : localStorage.getItem(VAULT_KEY)
    ? "gesperrt"
    : "aus";
}

function getAdherence() {
  const stats = getSevenDayStats();
  return Math.round(stats.reduce((sum, value) => sum + value, 0) / stats.length);
}

function getSevenDayStats() {
  const now = new Date();
  const profileMedicineIds = new Set(getProfileMedicines().map((medicine) => medicine.id));
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - 6 + offset);
    const key = day.toISOString().slice(0, 10);
    const entries = state.completedToday[key] || {};
    const total = getProfileMedicines().length || 1;
    const done = Object.entries(entries).filter(([medicineId, value]) => profileMedicineIds.has(medicineId) && value).length;
    return Math.round((done / total) * 100);
  });
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getRangeKeys(days) {
  const now = new Date();
  return Array.from({ length: days }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - offset));
    return getDateKey(day);
  });
}

function getHydrationForKey(key, profileId = state.activeProfileId) {
  const entry = state.hydration[key];
  if (!entry) return { amount: 0, goal: Number(state.settings.waterGoal || 2000) };
  if (entry.amount !== undefined) return entry;
  return entry[profileId] || { amount: 0, goal: Number(state.settings.waterGoal || 2000) };
}

function getReportData(days = 7) {
  const profile = state.profiles.find((item) => item.id === state.activeProfileId);
  const medicines = getProfileMedicines();
  const keys = getRangeKeys(days);
  const totalPossible = medicines.length * keys.length;
  const doneTotal = keys.reduce((sum, key) => {
    const entries = state.completedToday[key] || {};
    return sum + medicines.filter((medicine) => entries[medicine.id]).length;
  }, 0);
  const adherence = totalPossible ? Math.round((doneTotal / totalPossible) * 100) : 0;
  const waterTotal = keys.reduce((sum, key) => sum + Number(getHydrationForKey(key).amount || 0), 0);
  const since = new Date();
  since.setDate(since.getDate() - days);
  const events = state.history
    .filter((entry) => new Date(entry.date) >= since)
    .filter((entry) => !entry.profileId || entry.profileId === state.activeProfileId)
    .slice(0, 14);

  return {
    days,
    profile,
    medicines,
    adherence,
    doneTotal,
    totalPossible,
    waterTotal,
    events,
    lowStock: medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)),
    createdAt: new Date(),
  };
}

function renderReport() {
  const data = getReportData(Number(elements.reportRange.value || 7));
  elements.reportPreview.innerHTML = buildReportHtml(data);
  refreshIcons();
}

function buildReportHtml(data) {
  const created = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(data.createdAt);
  const profileName = data.profile?.name || "Unbekannt";
  const profileRole = data.profile?.role || "-";
  const waterLiters = (data.waterTotal / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const todayEntries = state.completedToday[todayKey()] || {};

  return `
    <header class="report-doc-header">
      <div>
        <span>MediLog</span>
        <h1>Arzt- und Apothekenbericht</h1>
        <p>Privates Protokoll fuer ${data.days} Tage · erstellt am ${created}</p>
      </div>
      <strong>${escapeHtml(profileName.slice(0, 1))}</strong>
    </header>

    <section class="report-warning">
      Dieser Bericht ist eine private Dokumentation. Er ersetzt keine aerztliche, pharmazeutische oder notfallmedizinische Einschaetzung.
    </section>

    <section class="report-grid">
      <div><span>Profil</span><strong>${escapeHtml(profileName)}</strong><small>${escapeHtml(profileRole)}</small></div>
      <div><span>Einnahmetreue</span><strong>${data.adherence}%</strong><small>${data.doneTotal} von ${data.totalPossible || 0}</small></div>
      <div><span>Wasser</span><strong>${waterLiters} L</strong><small>im Zeitraum</small></div>
      <div><span>Vorrat</span><strong>${data.lowStock.length}</strong><small>niedrig</small></div>
    </section>

    <section class="report-section">
      <h2>Medikamente laut eigener Dokumentation</h2>
      <table>
        <thead><tr><th>Name</th><th>Angabe</th><th>Zeit</th><th>Heute</th><th>Vorrat</th></tr></thead>
        <tbody>
          ${
            data.medicines.length
              ? data.medicines
                  .map((medicine) => {
                    const low = Number(medicine.stock) <= Number(medicine.refillAt || 7);
                    return `<tr>
                      <td>${escapeHtml(medicine.name)}</td>
                      <td>${escapeHtml(medicine.dose)}</td>
                      <td>${medicine.time}</td>
                      <td>${todayEntries[medicine.id] ? "dokumentiert" : "offen"}</td>
                      <td>${medicine.stock} ${low ? "· niedrig" : ""}</td>
                    </tr>`;
                  })
                  .join("")
              : `<tr><td colspan="5">Keine Medikamente fuer dieses Profil erfasst.</td></tr>`
          }
        </tbody>
      </table>
    </section>

    <section class="report-section">
      <h2>Protokollauszug</h2>
      <div class="report-events">
        ${
          data.events.length
            ? data.events
                .map(
                  (entry) => `<div>
                    <time>${new Date(entry.date).toLocaleString("de-DE")}</time>
                    <strong>${escapeHtml(entry.title)}</strong>
                    <span>${escapeHtml(entry.detail)}</span>
                  </div>`,
                )
                .join("")
            : `<p>Keine Protokolleintraege im ausgewaehlten Zeitraum.</p>`
        }
      </div>
    </section>

    <footer class="report-footer">
      Lokal erstellt mit MediLog. Keine automatische Wechselwirkungs-, Diagnose- oder Dosierungsbewertung.
    </footer>
  `;
}

function getReportDocumentHtml() {
  return `<!doctype html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MediLog Bericht</title>
        <style>${getReportPrintCss()}</style>
      </head>
      <body>
        <main class="report-document print">${elements.reportPreview.innerHTML}</main>
      </body>
    </html>`;
}

function getReportPrintCss() {
  return `
    body { margin: 0; background: #f4f6f2; color: #101312; font-family: Arial, sans-serif; }
    .report-document { max-width: 860px; margin: 24px auto; padding: 34px; background: #fff; border-radius: 24px; box-shadow: 0 18px 50px rgba(20, 30, 24, .12); }
    .report-doc-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; border-bottom: 1px solid #dfe6df; padding-bottom: 22px; }
    .report-doc-header span { color: #347044; font-weight: 800; text-transform: uppercase; font-size: 12px; }
    .report-doc-header h1 { margin: 6px 0 8px; font-size: 30px; line-height: 1.05; }
    .report-doc-header p, .report-footer, .report-events span, .report-grid small { color: #66716b; }
    .report-doc-header strong { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 18px; background: #050706; color: #fff; font-size: 22px; }
    .report-warning { margin: 22px 0; padding: 14px 16px; border-radius: 16px; background: #fff8ef; color: #715039; font-weight: 700; line-height: 1.4; }
    .report-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; }
    .report-grid div { padding: 14px; border-radius: 16px; background: #f4f7f2; }
    .report-grid span { display: block; color: #66716b; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .report-grid strong { display: block; margin-top: 8px; font-size: 22px; }
    .report-grid small { display: block; margin-top: 3px; font-weight: 700; }
    .report-section { margin-top: 24px; }
    .report-section h2 { font-size: 17px; margin: 0 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 11px 9px; border-bottom: 1px solid #e5ebe5; text-align: left; }
    th { color: #66716b; font-size: 12px; text-transform: uppercase; }
    .report-events { display: grid; gap: 9px; }
    .report-events div { padding: 12px; border-radius: 14px; background: #f8faf7; }
    .report-events time { display: block; color: #66716b; font-size: 12px; font-weight: 700; }
    .report-events strong, .report-events span { display: block; margin-top: 3px; }
    .report-footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #dfe6df; font-size: 12px; }
    @media print {
      body { background: #fff; }
      .report-document { margin: 0; box-shadow: none; border-radius: 0; }
    }
  `;
}

function addHistory(type, title, detail) {
  state.history.unshift({ type, title, detail, profileId: state.activeProfileId, date: new Date().toISOString() });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function switchView(viewName, options = {}) {
  const targetView = document.getElementById(`${viewName}-view`);
  if (!targetView) return;

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view === targetView);
    if (view === targetView) elements.title.textContent = view.dataset.title;
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  if (options.updateHash !== false && location.hash.slice(1) !== viewName) {
    history.replaceState(null, "", `#${viewName}`);
  }
  document.querySelector(".screen").scrollTo({ top: 0, behavior: "smooth" });
}

function openMedicineForm() {
  elements.medicineForm.reset();
  elements.medicineForm.elements.time.value = "08:00";
  elements.medicineSheet.showModal();
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `med-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getReminderStatus() {
  if (!state.settings.remindersEnabled) return "In-App";
  if (nativeCapabilities.notifications === "native") return "iOS aktiv";
  if (!("Notification" in window)) return "Nur In-App";
  return Notification.permission === "granted" ? "Push aktiv" : "Bereit";
}

async function syncNativeReminders(options = {}) {
  if (!medilogNative.available || nativeCapabilities.notifications !== "native") return;

  try {
    if (!state.settings.remindersEnabled) {
      await medilogNative.call("cancelReminders");
      return;
    }

    const profile = state.profiles.find((item) => item.id === state.activeProfileId);
    const result = await medilogNative.call("scheduleReminders", {
      delayMinutes: Number(state.settings.reminderDelayMinutes || 15),
      daysAhead: 14,
      profileName: profile?.name || "Profil",
      completed: state.completedToday,
      medicines: getProfileMedicines().map((medicine) => ({
        id: medicine.id,
        name: medicine.name,
        dose: medicine.dose,
        time: medicine.time,
      })),
    });

    if (!result?.granted) {
      state.settings.remindersEnabled = false;
      saveState();
      if (!options.silent) showToast("iOS-Erinnerungen wurden nicht erlaubt");
      return;
    }

    if (!options.silent) showToast(`${result.scheduled || 0} iOS-Erinnerungen geplant`);
  } catch (error) {
    if (!options.silent) showToast(error.message || "iOS-Erinnerungen nicht verfuegbar");
  }
}

function minutesSinceMidnight(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function checkReminders() {
  if (!state.settings.remindersEnabled) return;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  getProfileMedicines().forEach((medicine) => {
    const overdue = current - minutesSinceMidnight(medicine.time);
    if (overdue < state.settings.reminderDelayMinutes || isDone(medicine.id)) return;
    const reminderKey = `${todayKey()}-${medicine.id}`;
    if (sessionStorage.getItem(reminderKey)) return;
    sessionStorage.setItem(reminderKey, "sent");
    showToast(`${medicine.name}: Einnahme noch offen`);
    if (state.settings.remindersEnabled && Notification.permission === "granted") {
      new Notification("MediLog Erinnerung", { body: `${medicine.name} ist noch offen. Bitte nur laut eigenem Plan handeln.` });
    }
  });
}

async function deriveKey(pin, salt) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptVault(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(state)));
  localStorage.setItem(
    VAULT_KEY,
    JSON.stringify({
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    }),
  );
  localStorage.removeItem(STORAGE_KEY);
}

async function decryptVault(pin) {
  const vault = JSON.parse(localStorage.getItem(VAULT_KEY));
  const salt = Uint8Array.from(atob(vault.salt), (char) => char.charCodeAt(0));
  const iv = Uint8Array.from(atob(vault.iv), (char) => char.charCodeAt(0));
  const data = Uint8Array.from(atob(vault.data), (char) => char.charCodeAt(0));
  const key = await deriveKey(pin, salt);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return hydrateState(JSON.parse(new TextDecoder().decode(decrypted)));
}

function refreshIcons() {
  if (!globalThis.lucide?.createIcons) return;
  lucide.createIcons();
  document.querySelectorAll("svg.lucide").forEach((icon) => {
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const premiumFeature = event.target.closest("[data-premium-feature]");
  if (premiumFeature) {
    requirePremium(premiumFeature.dataset.premiumFeature);
    return;
  }

  const premiumPlan = event.target.closest("[data-premium-product-id]");
  if (premiumPlan) {
    selectedPremiumProductId = premiumPlan.dataset.premiumProductId;
    renderSettings();
    refreshIcons();
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) switchView(viewButton.dataset.view);

  const actionButton = event.target.closest("[data-action]");
  if (actionButton?.dataset.action === "open-medicine-form") {
    if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
      requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
    } else {
      openMedicineForm();
    }
  }
  if (actionButton?.dataset.action === "open-dose-form") elements.quickSheet.showModal();
  if (actionButton?.dataset.action === "open-profile-form" && requirePremium("mehrere Pflegeprofile")) elements.profileSheet.showModal();
  if (actionButton?.dataset.action === "open-scan-sheet" && requirePremium("Medikationsplan-QR-Import")) elements.scanSheet.showModal();

  const doseButton = event.target.closest("[data-dose-id]");
  if (doseButton) {
    if (!requirePrivacyConsent("Einnahme dokumentieren")) return;
    const medicine = state.medicines.find((item) => item.id === doseButton.dataset.doseId);
    const nextState = !isDone(medicine.id);
    setDone(medicine.id, nextState);
    medicine.stock = Math.max(0, Number(medicine.stock) + (nextState ? -1 : 1));
    addHistory(nextState ? "done" : "note", medicine.name, nextState ? `${medicine.time} dokumentiert` : "Markierung entfernt");
    saveState();
    void syncNativeReminders({ silent: true });
    render();
    showToast(nextState ? "Einnahme dokumentiert" : "Einnahme wieder offen");
  }

  const profileButton = event.target.closest("[data-profile-id]");
  if (profileButton) {
    if (profileButton.dataset.profileId !== state.activeProfileId && !requirePremium("mehrere Profile")) return;
    state.activeProfileId = profileButton.dataset.profileId;
    saveState();
    void syncNativeReminders({ silent: true });
    render();
    showToast("Profil gewechselt");
  }

  const restockButton = event.target.closest("[data-restock-id]");
  if (restockButton) {
    if (!requirePremium("Vorratsmanagement")) return;
    if (!requirePrivacyConsent("Vorrat aktualisieren")) return;
    const medicine = state.medicines.find((item) => item.id === restockButton.dataset.restockId);
    medicine.stock = Number(medicine.stock) + 14;
    addHistory("note", `${medicine.name} Vorrat aktualisiert`, `${medicine.stock} Einheiten`);
    saveState();
    render();
    showToast("Vorrat aktualisiert");
  }

  const closeButton = event.target.closest("[data-close]");
  if (closeButton) document.querySelector(`#${closeButton.dataset.close}`).close();
});

document.querySelector("#quick-add").addEventListener("click", () => {
  elements.quickSheet.showModal();
});

document.querySelector("#add-water").addEventListener("click", () => addWater());

elements.searchButton.addEventListener("click", () => {
  elements.searchPanel.classList.toggle("hidden");
  if (!elements.searchPanel.classList.contains("hidden")) elements.searchInput.focus();
});

elements.searchInput.addEventListener("input", render);

document.querySelector("#enable-reminders").addEventListener("click", async () => {
  if (!requirePremium("erweiterte Erinnerungen")) return;
  if (!requirePrivacyConsent("Erinnerungen aktivieren")) return;
  state.settings.remindersEnabled = true;
  if (nativeCapabilities.notifications === "native") {
    await syncNativeReminders();
  } else if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  saveState();
  render();
  checkReminders();
  showToast(getReminderStatus() === "iOS aktiv" ? "iOS-Erinnerungen aktiv" : getReminderStatus() === "Push aktiv" ? "Push-Erinnerungen aktiv" : "In-App-Erinnerungen aktiv");
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.activeFilter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    render();
  });
});

document.querySelector("#quick-sheet form").addEventListener("submit", (event) => {
  const action = event.submitter?.value;
  if (action === "medicine") {
    if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
      requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
      return;
    }
    window.setTimeout(openMedicineForm, 80);
    return;
  }

  if (action === "note") {
    if (!requirePrivacyConsent("Notiz erfassen")) return;
    window.setTimeout(() => elements.noteSheet.showModal(), 80);
    return;
  }

  if (action === "water") {
    addWater();
    return;
  }

  if (!requirePrivacyConsent("Einnahme dokumentieren")) return;
  const next = state.medicines.find((medicine) => !isDone(medicine.id));
  if (!next) {
    showToast("Heute ist bereits alles dokumentiert");
    return;
  }

  setDone(next.id, true);
  next.stock = Math.max(0, Number(next.stock) - 1);
  addHistory("done", next.name, `${next.time} dokumentiert`);
  saveState();
  void syncNativeReminders({ silent: true });
  render();
  showToast("Naechste offene Einnahme dokumentiert");
});

elements.medicineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Medikament speichern")) {
    elements.medicineSheet.close();
    return;
  }
  if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
    elements.medicineSheet.close();
    requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
    return;
  }
  const data = new FormData(elements.medicineForm);
  const medicine = {
    id: createId(),
    name: data.get("name").trim(),
    dose: data.get("dose").trim(),
    time: data.get("time"),
    stock: Number(data.get("stock")),
    refillAt: 7,
    profileId: state.activeProfileId,
  };

  state.medicines.push(medicine);
  addHistory("note", `${medicine.name} erfasst`, "Eigene Angabe gespeichert");
  saveState();
  void syncNativeReminders({ silent: true });
  elements.medicineSheet.close();
  render();
  showToast("Medikament lokal gespeichert");
});

elements.onboardingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.onboardingForm);
  if (!data.get("privacyConsent")) {
    showToast("Bitte Datenschutz-Bestaetigung setzen");
    return;
  }
  const mode = data.get("mode");
  const profileName = data.get("profileName").trim();
  const profileId = mode === "care" ? "profile-care-primary" : "profile-self";
  const existingProfile = state.profiles.find((profile) => profile.id === profileId);

  if (existingProfile) {
    existingProfile.name = profileName;
    existingProfile.role = mode === "care" ? "Pflege" : "Selbst";
  } else {
    state.profiles.unshift({ id: profileId, name: profileName, role: mode === "care" ? "Pflege" : "Selbst" });
  }

  state.activeProfileId = profileId;
  state.settings.waterGoal = Number(data.get("waterGoal")) || 2000;
  state.settings.onboarded = true;
  state.settings.privacyConsentAt = new Date().toISOString();

  const medicineName = data.get("medicineName").trim();
  if (medicineName) {
    state.medicines.push({
      id: createId(),
      profileId,
      name: medicineName,
      dose: "laut eigenem Plan",
      time: data.get("medicineTime") || "08:00",
      stock: 14,
      refillAt: 7,
    });
  }

  addHistory("note", "Onboarding abgeschlossen", mode === "care" ? "Pflege-Modus eingerichtet" : "Eigenes Profil eingerichtet");
  saveState();
  void syncNativeReminders({ silent: true });
  elements.onboardingSheet.close();
  render();
  showToast("MediLog ist eingerichtet");
});

document.querySelector("#skip-onboarding").addEventListener("click", () => {
  state.settings.onboarded = true;
  saveState();
  elements.onboardingSheet.close();
  render();
  showToast("Demo gestartet");
});

elements.onboardingForm.elements.mode.forEach((input) => {
  input.addEventListener("change", () => {
    elements.onboardingForm.elements.profileName.value = input.value === "care" ? "Mama" : "Ich";
  });
});

elements.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Profil speichern")) {
    elements.profileSheet.close();
    return;
  }
  const data = new FormData(elements.profileForm);
  const profile = {
    id: createId(),
    name: data.get("name").trim(),
    role: data.get("role").trim(),
  };
  state.profiles.push(profile);
  state.activeProfileId = profile.id;
  addHistory("note", `${profile.name} Profil angelegt`, profile.role);
  saveState();
  void syncNativeReminders({ silent: true });
  elements.profileSheet.close();
  elements.profileForm.reset();
  render();
  showToast("Profil lokal gespeichert");
});

elements.scanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Medikationsplan speichern")) {
    elements.scanSheet.close();
    return;
  }
  const plan = new FormData(elements.scanForm).get("plan").trim();
  addHistory("note", "Medikationsplan importiert", plan.slice(0, 120));
  saveState();
  elements.scanSheet.close();
  elements.scanForm.reset();
  render();
  showToast("Planinhalt als private Notiz gespeichert");
});

document.querySelector("#native-scan-button").addEventListener("click", async () => {
  if (!requirePremium("nativer Medikationsplan-Scan")) return;
  if (!requirePrivacyConsent("Medikationsplan scannen")) return;
  if (!medilogNative.available) {
    showToast("Kamera-Scan ist in der Web-Vorschau nicht verfuegbar");
    return;
  }

  try {
    const result = await medilogNative.call("startPlanScan");
    if (!result?.value) {
      showToast("Kein QR-Inhalt erkannt");
      return;
    }
    elements.scanForm.elements.plan.value = result.value;
    showToast("QR-Inhalt erkannt");
  } catch (error) {
    showToast(error.message || "Kamera-Scan nicht verfuegbar");
  }
});

document.querySelector("#qr-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!requirePrivacyConsent("Medikationsplan einlesen")) return;
  if (!("BarcodeDetector" in window)) {
    showToast("Dieser Browser kann QR-Bilder nicht direkt lesen");
    return;
  }

  try {
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const bitmap = await createImageBitmap(file);
    const codes = await detector.detect(bitmap);
    const value = codes[0]?.rawValue;
    if (!value) {
      showToast("Kein QR-Code erkannt");
      return;
    }
    elements.scanForm.elements.plan.value = value;
    showToast("QR-Inhalt erkannt");
  } catch {
    showToast("QR-Erkennung nicht verfuegbar");
  }
});

elements.noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Notiz speichern")) {
    elements.noteSheet.close();
    return;
  }
  const note = new FormData(elements.noteForm).get("note").trim();
  addHistory("note", "Private Notiz", note);
  saveState();
  elements.noteSheet.close();
  elements.noteForm.reset();
  render();
  showToast("Notiz lokal gespeichert");
});

document.querySelector("#export-button").addEventListener("click", () => {
  if (!requirePremium("Arzt-/Apothekenbericht")) return;
  renderReport();
  elements.reportSheet.showModal();
});

elements.reportRange.addEventListener("change", renderReport);

document.querySelector("#download-report").addEventListener("click", () => {
  if (!requirePremium("Bericht exportieren")) return;
  renderReport();
  const blob = new Blob([getReportDocumentHtml()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const profile = state.profiles.find((item) => item.id === state.activeProfileId);
  link.href = url;
  link.download = `medilog-bericht-${profile?.name || "profil"}-${todayKey()}.html`.replaceAll(" ", "-").toLowerCase();
  link.click();
  URL.revokeObjectURL(url);
  showToast("Bericht gespeichert");
});

document.querySelector("#print-report").addEventListener("click", () => {
  if (!requirePremium("PDF-/Druckbericht")) return;
  renderReport();
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Druckfenster wurde blockiert");
    return;
  }
  printWindow.document.write(getReportDocumentHtml());
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});

document.querySelector("#reset-button").addEventListener("click", async () => {
  const confirmed = window.confirm("Lokale Demo-Daten wirklich loeschen? Diese Aktion entfernt gespeicherte Gesundheitsdaten aus diesem Browser.");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VAULT_KEY);
  if (medilogNative.available) {
    await medilogNative.call("resetSecureState").catch(() => {});
  }
  state = structuredClone(seedState);
  render();
  showToast("Demo-Daten zurueckgesetzt");
});

document.querySelector("#privacy-export").addEventListener("click", () => {
  const payload = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      purpose: "DSGVO-Auskunft / lokale Datenkopie",
      storage: nativeSecureStorageReady
        ? "iOS Application Support, AES-GCM verschluesselt; Schluessel in iOS Keychain"
        : "Browser localStorage / optional verschluesselter Web-Crypto-Vault",
      categories: ["profile", "medicines", "dose log", "hydration", "notes", "settings"],
      state,
    },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medilog-dsgvo-export-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("DSGVO-Export erstellt");
});

document.querySelector("#privacy-consent").addEventListener("click", () => {
  state.settings.privacyConsentAt = new Date().toISOString();
  saveState();
  render();
  showToast("Einwilligung lokal dokumentiert");
});

document.querySelector("#copy-shopping-list").addEventListener("click", async () => {
  if (!requirePremium("Nachkaufliste")) return;
  const low = getProfileMedicines().filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7));
  const list = low.length ? low.map((medicine) => `${medicine.name} (${medicine.dose})`).join("\n") : "Keine Nachkaeufe offen";
  try {
    await navigator.clipboard?.writeText(list);
    showToast("Nachkaufliste kopiert");
  } catch {
    showToast(list);
  }
});

document.querySelector("#senior-mode")?.addEventListener("click", () => {
  state.settings.seniorMode = !state.settings.seniorMode;
  saveState();
  render();
  showToast(state.settings.seniorMode ? "Einfach-Modus aktiv" : "Einfach-Modus aus");
});

elements.settingWaterGoal.addEventListener("change", () => {
  state.settings.waterGoal = Number(elements.settingWaterGoal.value) || 2000;
  getHydrationEntry().goal = state.settings.waterGoal;
  saveState();
  render();
  showToast("Wasserziel gespeichert");
});

elements.settingReminderDelay.addEventListener("change", () => {
  state.settings.reminderDelayMinutes = Number(elements.settingReminderDelay.value) || 15;
  saveState();
  void syncNativeReminders({ silent: true });
  render();
  showToast("Reminder-Abstand gespeichert");
});

elements.settingRemindersEnabled.addEventListener("change", async () => {
  if (elements.settingRemindersEnabled.checked && !requirePremium("zuverlaessige Erinnerungen")) {
    elements.settingRemindersEnabled.checked = false;
    return;
  }
  if (elements.settingRemindersEnabled.checked && !requirePrivacyConsent("Erinnerungen aktivieren")) {
    elements.settingRemindersEnabled.checked = false;
    return;
  }
  state.settings.remindersEnabled = elements.settingRemindersEnabled.checked;
  if (nativeCapabilities.notifications === "native") {
    await syncNativeReminders();
  } else if (state.settings.remindersEnabled && "Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  saveState();
  render();
  showToast(state.settings.remindersEnabled ? "Erinnerungen aktiv" : "Erinnerungen aus");
});

elements.settingSeniorMode.addEventListener("change", () => {
  state.settings.seniorMode = elements.settingSeniorMode.checked;
  saveState();
  render();
  showToast(state.settings.seniorMode ? "Einfach-Modus aktiv" : "Einfach-Modus aus");
});

elements.refillSettingsList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-refill-setting-id]");
  if (!input) return;
  if (!requirePremium("Nachkaufgrenzen")) return;

  const medicine = state.medicines.find((item) => item.id === input.dataset.refillSettingId);
  medicine.refillAt = Number(input.value) || 0;
  saveState();
  render();
  showToast("Nachkaufgrenze gespeichert");
});

elements.premiumButton.addEventListener("click", async () => {
  if (isPremium()) {
    showToast("Premium ist bereits aktiv");
    return;
  }

  try {
    if (medilogNative.available) {
      const entitlement = await medilogNative.call("purchasePremium", { productId: getSelectedPremiumProduct().id });
      if (!applyPremiumEntitlement(entitlement)) return;
    } else {
      state.settings.premiumActive = true;
      state.settings.premiumPreview = false;
      state.settings.premiumSource = `web-preview:${getSelectedPremiumProduct().id}`;
      showToast("Premium-Webvorschau aktiv");
    }
  } catch (error) {
    showToast(error.message || "Premium konnte nicht aktiviert werden");
    return;
  }

  saveState();
  render();
});

document.querySelector("#premium-restore").addEventListener("click", async () => {
  if (!medilogNative.available) {
    showToast("Wiederherstellung ist nur in der iOS-App verfuegbar");
    return;
  }

  try {
    const entitlement = await medilogNative.call("restorePurchases");
    if (!applyPremiumEntitlement(entitlement)) {
      showToast("Kein Premium-Kauf gefunden");
      return;
    }
    saveState();
    render();
  } catch (error) {
    showToast(error.message || "Kauf konnte nicht wiederhergestellt werden");
  }
});

document.querySelector("#vault-button").addEventListener("click", async () => {
  if (!requirePremium("PIN-Vault")) return;
  const pin = elements.vaultPin.value.trim();
  if (pin.length < 4) {
    showToast("Bitte mindestens 4 Ziffern oder Zeichen verwenden");
    return;
  }

  try {
    if (nativeSecureStorageReady) {
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      await medilogNative.call("saveSecureState", { state });
      elements.vaultPin.value = "";
      render();
      showToast("iOS-Keychain-Vault aktiv");
      return;
    }

    if (localStorage.getItem(VAULT_KEY) && !state.settings.vaultEnabled) {
      state = await decryptVault(pin);
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      showToast("Vault entsperrt");
    } else {
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      await encryptVault(pin);
      showToast("Lokaler Vault verschluesselt");
    }
    elements.vaultPin.value = "";
    render();
  } catch {
    showToast("PIN konnte den Vault nicht entsperren");
  }
});

document.querySelector("#vault-biometric-button").addEventListener("click", async () => {
  if (!requirePremium("Face ID / Touch ID")) return;
  if (!medilogNative.available) {
    showToast("Biometrie ist nur in der iOS-App verfuegbar");
    return;
  }

  try {
    const result = await medilogNative.call("biometricUnlock");
    showToast(result?.unlocked ? "Biometrie bestaetigt" : "Biometrie ist auf diesem Simulator nicht verfuegbar");
  } catch (error) {
    showToast(error.message || "Biometrie konnte nicht verwendet werden");
  }
});

render();
void bootstrapNative();
if (location.hash.slice(1)) routeToHash();
window.addEventListener("hashchange", () => routeToHash());
checkReminders();
window.setInterval(checkReminders, 60000);

window.setTimeout(() => {
  if (!state.settings.onboarded && !localStorage.getItem(VAULT_KEY)) {
    elements.onboardingSheet.showModal();
    refreshIcons();
  }
}, 750);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      showToast("Offline-Modus konnte nicht aktiviert werden");
    });
  });
}
