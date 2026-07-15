// ===== HüseyinAI Ultra Pro Max =====
// Auth System + Pollinations AI (Ücretsiz, API Anahtarı Gerektirmez)

// ===== AUTH DOM =====
const authScreen = document.getElementById('authScreen');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authSwitchBtn = document.getElementById('authSwitchBtn');
const authSwitchText = document.getElementById('authSwitchText');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// ===== CHAT DOM =====
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chatHistory');
const newChatBtn = document.getElementById('newChatBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuBtn = document.getElementById('menuBtn');
const chatTitle = document.getElementById('chatTitle');
const charCount = document.getElementById('charCount');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// ===== STATE =====
let currentUser = null;
let conversations = {};
let currentConversationId = null;
let isTyping = false;
let abortCtrl = null;
let isLoginMode = true;

const SYSTEM_PROMPT = `Sen "HüseyinAI" adında, son derece zeki ve yardımsever bir Türkçe yapay zeka asistanısın.

Kuralların:
- Her zaman Türkçe yanıt ver.
- Cevapların detaylı, doğru, kapsamlı ve faydalı olsun.
- Markdown formatını aktif kullan: başlıklar (#, ##, ###), kalın (**metin**), italik (*metin*), kod blokları (\`\`\`dil), listeler (- veya 1.), tablolar, blockquote (>).
- Emoji kullanarak yanıtlarını sıcak ve okunabilir yap.
- Programlama sorularında çalışan, açıklamalı kod örnekleri ver.
- Matematik sorularında adım adım çözüm göster.
- Emin olmadığın bilgilerde bunu belirt.
- Kullanıcıya karşı samimi, kibar ve profesyonel ol.
- Yaratıcı içerik isteklerinde özgün ve etkileyici eserler üret.`;

// ================================================================
// ===== AUTH SİSTEMİ =====
// ================================================================
function getUsers() {
    try { return JSON.parse(localStorage.getItem('huseyinai_users') || '{}'); } catch(e) { return {}; }
}
function saveUsers(users) {
    localStorage.setItem('huseyinai_users', JSON.stringify(users));
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_huseyinai_salt_2024');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function initAuth() {
    // Check if user is already logged in
    const session = localStorage.getItem('huseyinai_session');
    if (session) {
        try {
            currentUser = JSON.parse(session);
            showApp();
            return;
        } catch(e) { localStorage.removeItem('huseyinai_session'); }
    }
    showAuth();
    setupAuthEvents();
}

function setupAuthEvents() {
    // Toggle login/register
    authSwitchBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            authSwitchText.textContent = 'Hesabınız yok mu?';
            authSwitchBtn.textContent = 'Kayıt Ol';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            authSwitchText.textContent = 'Zaten hesabınız var mı?';
            authSwitchBtn.textContent = 'Giriş Yap';
        }
        loginError.textContent = '';
        registerError.textContent = '';
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) { loginError.textContent = 'Tüm alanları doldurun.'; return; }

        const users = getUsers();
        const user = users[email];
        if (!user) { loginError.textContent = 'Bu e-posta ile kayıtlı hesap bulunamadı.'; return; }

        const hashed = await hashPassword(password);
        if (user.password !== hashed) { loginError.textContent = 'Şifre yanlış. Tekrar deneyin.'; return; }

        currentUser = { name: user.name, email: email };
        localStorage.setItem('huseyinai_session', JSON.stringify(currentUser));
        showApp();
    });

    // Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regPasswordConfirm').value;

        if (!name || !email || !password || !confirm) { registerError.textContent = 'Tüm alanları doldurun.'; return; }
        if (name.length < 2) { registerError.textContent = 'İsim en az 2 karakter olmalı.'; return; }
        if (password.length < 6) { registerError.textContent = 'Şifre en az 6 karakter olmalı.'; return; }
        if (password !== confirm) { registerError.textContent = 'Şifreler eşleşmiyor.'; return; }

        const users = getUsers();
        if (users[email]) { registerError.textContent = 'Bu e-posta zaten kayıtlı!'; return; }

        const hashed = await hashPassword(password);
        users[email] = { name, password: hashed, createdAt: Date.now() };
        saveUsers(users);

        currentUser = { name, email };
        localStorage.setItem('huseyinai_session', JSON.stringify(currentUser));
        showApp();
    });
}

function showAuth() {
    authScreen.classList.remove('hidden');
    authScreen.style.display = 'flex';
    appContainer.style.display = 'none';
}

function showApp() {
    authScreen.classList.add('hidden');
    authScreen.style.display = 'none';
    appContainer.style.display = 'flex';

    // Update user profile in sidebar
    if (currentUser) {
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }

    initChat();
}

function logout() {
    if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
    currentUser = null;
    conversations = {};
    currentConversationId = null;
    isTyping = false;
    localStorage.removeItem('huseyinai_session');
    showAuth();
    setupAuthEvents();
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    loginError.textContent = '';
    registerError.textContent = '';
    isLoginMode = true;
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    authSwitchText.textContent = 'Hesabınız yok mu?';
    authSwitchBtn.textContent = 'Kayıt Ol';
}

// ================================================================
// ===== CHAT SİSTEMİ =====
// ================================================================
function getUserKey() {
    return 'huseyinai_chats_' + (currentUser ? currentUser.email : 'guest');
}

function initChat() {
    try { conversations = JSON.parse(localStorage.getItem(getUserKey()) || '{}'); } catch(e) { conversations = {}; }
    setupChatEvents();
    renderHistory();
    if (Object.keys(conversations).length === 0) startNewChat();
    else { const ids = Object.keys(conversations).sort((a,b) => conversations[b].updatedAt - conversations[a].updatedAt); loadChat(ids[0]); }
}

function save() { try { localStorage.setItem(getUserKey(), JSON.stringify(conversations)); } catch(e) {} }

function setupChatEvents() {
    sendBtn.onclick = handleSend;
    messageInput.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    messageInput.oninput = () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
        const l = messageInput.value.trim().length;
        charCount.textContent = l;
        sendBtn.disabled = l === 0 || isTyping;
    };
    newChatBtn.onclick = startNewChat;
    clearChatBtn.onclick = clearChat;
    logoutBtn.onclick = logout;
    sidebarToggle.onclick = () => { sidebar.classList.add('collapsed'); rmOverlay(); };
    menuBtn.onclick = () => { sidebar.classList.remove('collapsed'); if (innerWidth <= 768) addOverlay(); };
}

function addOverlay() {
    let o = document.querySelector('.sidebar-overlay');
    if (!o) { o = document.createElement('div'); o.className = 'sidebar-overlay'; document.body.appendChild(o); }
    o.classList.add('active');
    o.onclick = () => { sidebar.classList.add('collapsed'); rmOverlay(); };
}
function rmOverlay() { const o = document.querySelector('.sidebar-overlay'); if (o) o.classList.remove('active'); }
function scrollDown() { requestAnimationFrame(() => chatContainer.scrollTop = chatContainer.scrollHeight); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmtTime(t) { return new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); }

// ===== CHAT MANAGEMENT =====
function startNewChat() {
    if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
    const id = 'c_' + Date.now();
    conversations[id] = { id, title: 'Yeni Sohbet', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    currentConversationId = id; isTyping = false;
    save(); renderHistory(); renderMsgs();
    chatTitle.textContent = 'Yeni Sohbet';
    messageInput.focus(); sendBtn.disabled = messageInput.value.trim().length === 0;
    if (innerWidth <= 768) { sidebar.classList.add('collapsed'); rmOverlay(); }
}

function loadChat(id) {
    if (!conversations[id]) return;
    if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
    isTyping = false; currentConversationId = id;
    chatTitle.textContent = conversations[id].title;
    renderMsgs(); renderHistory();
    sendBtn.disabled = messageInput.value.trim().length === 0;
}

function clearChat() {
    if (!currentConversationId) return;
    if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
    isTyping = false;
    conversations[currentConversationId].messages = [];
    conversations[currentConversationId].title = 'Yeni Sohbet';
    chatTitle.textContent = 'Yeni Sohbet';
    save(); renderMsgs(); renderHistory();
}

function deleteChat(id) {
    delete conversations[id]; save();
    if (currentConversationId === id) { const k = Object.keys(conversations); k.length ? loadChat(k[0]) : startNewChat(); }
    renderHistory();
}

// ===== RENDER =====
function renderHistory() {
    chatHistory.innerHTML = '';
    Object.values(conversations).sort((a,b) => b.updatedAt - a.updatedAt).forEach(c => {
        const d = document.createElement('div');
        d.className = 'chat-history-item' + (c.id === currentConversationId ? ' active' : '');
        d.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span>${esc(c.title)}</span><button class="delete-chat" title="Sil"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>`;
        d.onclick = e => {
            if (e.target.closest('.delete-chat')) { e.stopPropagation(); deleteChat(c.id); return; }
            loadChat(c.id);
            if (innerWidth <= 768) { sidebar.classList.add('collapsed'); rmOverlay(); }
        };
        chatHistory.appendChild(d);
    });
}

function renderMsgs() {
    const c = conversations[currentConversationId]; if (!c) return;
    chatMessages.innerHTML = '';
    if (c.messages.length === 0) { chatMessages.appendChild(makeWelcome()); return; }
    c.messages.forEach(m => chatMessages.appendChild(makeMsgEl(m)));
    scrollDown();
}

function makeWelcome() {
    const greeting = currentUser ? currentUser.name : 'Kullanıcı';
    const d = document.createElement('div'); d.className = 'welcome-screen';
    d.innerHTML = `
        <div class="welcome-icon"><div class="welcome-icon-inner"><svg viewBox="0 0 80 80" fill="none"><defs><linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7c3aed"/><stop offset="50%" style="stop-color:#06b6d4"/><stop offset="100%" style="stop-color:#10b981"/></linearGradient></defs><circle cx="40" cy="40" r="35" stroke="url(#wg)" stroke-width="2" fill="none" opacity="0.3"/><circle cx="40" cy="40" r="25" stroke="url(#wg)" stroke-width="2" fill="none" opacity="0.5"/><circle cx="40" cy="40" r="6" fill="url(#wg)"/><path d="M26 40C26 32.268 32.268 26 40 26C47.732 26 54 32.268 54 40" stroke="url(#wg)" stroke-width="2.5" stroke-linecap="round"/><path d="M40 46V56" stroke="url(#wg)" stroke-width="2.5" stroke-linecap="round"/></svg></div><div class="welcome-pulse"></div></div>
        <h2 class="welcome-title">Merhaba ${esc(greeting)}, Ben <span class="gradient-text">HüseyinAI</span></h2>
        <p class="welcome-subtitle">Ultra Pro Max yapay zekanız. Her soruyu yanıtlarım! 🚀</p>
        <div class="suggestion-cards">
            <button class="suggestion-card" data-prompt="Kuantum fiziği nedir? Basitçe açıkla."><div class="suggestion-icon">⚛️</div><div class="suggestion-text"><strong>Kuantum Fiziği</strong><span>Basitçe açıkla</span></div></button>
            <button class="suggestion-card" data-prompt="React ile modern bir todo uygulaması yaz, kodları ver."><div class="suggestion-icon">💻</div><div class="suggestion-text"><strong>React Todo App</strong><span>Komple kod yaz</span></div></button>
            <button class="suggestion-card" data-prompt="Bana uzayda geçen etkileyici bir kısa hikaye yaz."><div class="suggestion-icon">🚀</div><div class="suggestion-text"><strong>Uzay Hikayesi</strong><span>Yaratıcı bir hikaye</span></div></button>
            <button class="suggestion-card" data-prompt="İkinci Dünya Savaşı'nın sebeplerini ve sonuçlarını detaylı anlat."><div class="suggestion-icon">📜</div><div class="suggestion-text"><strong>Dünya Savaşı</strong><span>Detaylı tarih analizi</span></div></button>
        </div>`;
    d.querySelectorAll('.suggestion-card').forEach(c => c.onclick = () => {
        messageInput.value = c.dataset.prompt; charCount.textContent = c.dataset.prompt.length;
        sendBtn.disabled = false; handleSend();
    });
    return d;
}

function makeMsgEl(msg) {
    const d = document.createElement('div'); d.className = `message ${msg.role}`;
    d.innerHTML = `
        <div class="message-avatar">${msg.role === 'ai' ? 'AI' : (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'S')}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-name">${msg.role === 'ai' ? 'HüseyinAI' : (currentUser ? currentUser.name : 'Sen')}</span>
                <span class="message-time">${fmtTime(msg.timestamp)}</span>
            </div>
            <div class="message-body">${renderMarkdown(msg.content)}</div>
            <div class="message-actions">
                <button class="msg-action-btn copy-msg-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Kopyala</button>
                ${msg.role === 'ai' ? '<button class="msg-action-btn regen-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>Yeniden</button>' : ''}
            </div>
        </div>`;
    d.querySelector('.copy-msg-btn').onclick = function() {
        navigator.clipboard.writeText(msg.content).then(() => {
            this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Kopyalandı!';
            setTimeout(() => { this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Kopyala'; }, 2000);
        });
    };
    const rb = d.querySelector('.regen-btn');
    if (rb) rb.onclick = regenerate;
    return d;
}

async function regenerate() {
    if (isTyping) return;
    const conv = conversations[currentConversationId];
    if (!conv || conv.messages.length < 2) return;
    conv.messages.pop(); save(); renderMsgs();
    const lastQ = conv.messages[conv.messages.length - 1].content;
    await sendToAI(lastQ);
}

// ===== HANDLE SEND =====
async function handleSend() {
    const text = messageInput.value.trim();
    if (!text || isTyping) return;
    const w = chatMessages.querySelector('.welcome-screen'); if (w) w.remove();

    const um = { role: 'user', content: text, timestamp: Date.now() };
    conversations[currentConversationId].messages.push(um);
    chatMessages.appendChild(makeMsgEl(um));

    if (conversations[currentConversationId].messages.length === 1) {
        const t = text.length > 35 ? text.substring(0, 35) + '...' : text;
        conversations[currentConversationId].title = t;
        chatTitle.textContent = t; renderHistory();
    }

    messageInput.value = ''; charCount.textContent = '0'; messageInput.style.height = 'auto';
    scrollDown();
    await sendToAI(text);
}

// ================================================================
// ===== AI MOTORU — Pollinations AI =====
// ================================================================
const AI_MODELS = ['openai', 'mistral', 'llama', 'deepseek'];

async function sendToAI(userMessage) {
    isTyping = true; sendBtn.disabled = true;

    const ti = document.createElement('div'); ti.className = 'message ai'; ti.id = 'ti';
    ti.innerHTML = `<div class="message-avatar">AI</div><div class="message-content"><div class="message-header"><span class="message-name">HüseyinAI</span><span class="message-time">düşünüyor...</span></div><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(ti); scrollDown();

    let response = null;

    for (const model of AI_MODELS) {
        try {
            response = await callPollinationsAI(userMessage, model);
            if (response) break;
        } catch (err) {
            console.warn(`Model ${model} başarısız:`, err.message);
            if (err.message.includes('429')) await new Promise(r => setTimeout(r, 2000));
        }
    }

    if (!response) {
        response = `Üzgünüm, şu anda sunuculara ulaşamadım. 😔\n\n**Çözüm önerileri:**\n1. İnternet bağlantınızı kontrol edin\n2. Birkaç saniye bekleyip tekrar deneyin\n3. Sayfayı yenileyin (F5)`;
    }

    const indicator = document.getElementById('ti');
    if (indicator) indicator.remove();

    const am = { role: 'ai', content: response, timestamp: Date.now() };
    conversations[currentConversationId].messages.push(am);
    conversations[currentConversationId].updatedAt = Date.now();
    chatMessages.appendChild(makeMsgEl(am));
    save(); scrollDown();

    isTyping = false;
    sendBtn.disabled = messageInput.value.trim().length === 0;
    messageInput.focus();
}

async function callPollinationsAI(userMessage, model = 'openai') {
    abortCtrl = new AbortController();
    const conv = conversations[currentConversationId];
    const history = conv.messages.slice(-20);

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    for (const msg of history) {
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        });
    }
    if (messages[messages.length - 1]?.role !== 'user') {
        messages.push({ role: 'user', content: userMessage });
    }

    const timeoutId = setTimeout(() => { if (abortCtrl) abortCtrl.abort(); }, 30000);

    try {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, model, seed: Math.floor(Math.random() * 100000), jsonMode: false }),
            signal: abortCtrl.signal
        });
        clearTimeout(timeoutId);
        abortCtrl = null;
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        if (!text || text.trim().length === 0) throw new Error('Boş yanıt');
        return text.trim();
    } catch (err) {
        clearTimeout(timeoutId);
        abortCtrl = null;
        throw err;
    }
}

// ===== MARKDOWN RENDERER =====
function renderMarkdown(text) {
    let h = esc(text);
    h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code class="language-${lang}">${code.trim()}</code><button class="copy-btn" onclick="copyCode(this)">Kopyala</button></pre>`
    );
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/^#### (.+)$/gm, '<h4 style="font-size:0.95rem;font-weight:600;margin:12px 0 6px;">$1</h4>');
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm, '<h3 style="font-size:1.05rem;">$1</h3>');
    h = h.replace(/^# (.+)$/gm, '<h3 style="font-size:1.15rem;">$1</h3>');
    h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent-cyan);">$1</a>');
    h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    h = h.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

    // Tables
    const lines = h.split('\n');
    let res = [], inT = false, tRows = [];
    for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('|') && t.endsWith('|')) {
            if (!inT) { inT = true; tRows = []; }
            if (!/^\|[\s\-:|]+\|$/.test(t)) tRows.push(t);
        } else {
            if (inT) { res.push(buildTable(tRows)); inT = false; }
            res.push(line);
        }
    }
    if (inT) res.push(buildTable(tRows));
    h = res.join('\n');

    h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`);
    h = h.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    h = h.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border-color);margin:16px 0;">');
    h = h.replace(/\n\n/g, '</p><p>');
    h = h.replace(/\n/g, '<br>');
    h = '<p>' + h + '</p>';
    h = h.replace(/<p><\/p>/g, '');
    h = h.replace(/<p>(<h[34]|<ul|<ol|<pre|<blockquote|<hr|<table)/g, '$1');
    h = h.replace(/(<\/h[34]>|<\/ul>|<\/ol>|<\/pre>|<\/blockquote>|<\/table>)<\/p>/g, '$1');
    return h;
}

function buildTable(rows) {
    if (!rows.length) return '';
    let h = '<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.875rem;">';
    rows.forEach((r, i) => {
        const cells = r.split('|').filter(x => x.trim());
        const tag = i === 0 ? 'th' : 'td';
        const bg = i === 0 ? 'background:rgba(124,58,237,0.1);font-weight:600;' : (i % 2 === 0 ? 'background:rgba(255,255,255,0.02);' : '');
        h += '<tr>' + cells.map(c => `<${tag} style="padding:8px 12px;border:1px solid var(--border-color);text-align:left;${bg}">${c.trim()}</${tag}>`).join('') + '</tr>';
    });
    return h + '</table>';
}

window.copyCode = function(btn) {
    const code = btn.previousElementSibling || btn.closest('pre').querySelector('code');
    if (code) navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Kopyalandı!'; setTimeout(() => btn.textContent = 'Kopyala', 2000);
    });
};

// ===== START =====
document.addEventListener('DOMContentLoaded', initAuth);
