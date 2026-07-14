// ===== HüseyinAI v3.0 — Tamamen Yerel AI Motoru =====
// API gerekmez, her şey tarayıcıda çalışır!

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

let conversations = {};
let currentConversationId = null;
let isTyping = false;

// ===== INIT =====
function init() {
    try { conversations = JSON.parse(localStorage.getItem('huseyinai_chats') || '{}'); } catch(e) { conversations = {}; }
    setupEvents();
    renderHistory();
    if (Object.keys(conversations).length === 0) startNewChat();
    else { const ids = Object.keys(conversations).sort((a,b) => conversations[b].updatedAt - conversations[a].updatedAt); loadChat(ids[0]); }
}

function save() { try { localStorage.setItem('huseyinai_chats', JSON.stringify(conversations)); } catch(e) {} }

// ===== EVENTS =====
function setupEvents() {
    sendBtn.onclick = handleSend;
    messageInput.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    messageInput.oninput = () => { autoResize(); const l = messageInput.value.trim().length; charCount.textContent = l; sendBtn.disabled = l === 0 || isTyping; };
    newChatBtn.onclick = startNewChat;
    clearChatBtn.onclick = clearChat;
    sidebarToggle.onclick = () => { sidebar.classList.add('collapsed'); rmOverlay(); };
    menuBtn.onclick = () => { sidebar.classList.remove('collapsed'); if (innerWidth <= 768) addOverlay(); };
    document.querySelectorAll('.suggestion-card').forEach(c => c.onclick = () => { messageInput.value = c.dataset.prompt; charCount.textContent = c.dataset.prompt.length; sendBtn.disabled = false; handleSend(); });
}

function autoResize() { messageInput.style.height = 'auto'; messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px'; }
function addOverlay() { let o = document.querySelector('.sidebar-overlay'); if (!o) { o = document.createElement('div'); o.className = 'sidebar-overlay'; document.body.appendChild(o); } o.classList.add('active'); o.onclick = () => { sidebar.classList.add('collapsed'); rmOverlay(); }; }
function rmOverlay() { const o = document.querySelector('.sidebar-overlay'); if (o) o.classList.remove('active'); }
function scrollDown() { requestAnimationFrame(() => chatContainer.scrollTop = chatContainer.scrollHeight); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmtTime(t) { return new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); }

// ===== CHAT MANAGEMENT =====
function startNewChat() {
    const id = 'c_' + Date.now();
    conversations[id] = { id, title: 'Yeni Sohbet', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    currentConversationId = id;
    isTyping = false;
    save(); renderHistory(); renderMsgs();
    chatTitle.textContent = 'Yeni Sohbet';
    messageInput.focus(); sendBtn.disabled = messageInput.value.trim().length === 0;
    if (innerWidth <= 768) { sidebar.classList.add('collapsed'); rmOverlay(); }
}

function loadChat(id) {
    if (!conversations[id]) return;
    isTyping = false; currentConversationId = id;
    chatTitle.textContent = conversations[id].title;
    renderMsgs(); renderHistory();
    sendBtn.disabled = messageInput.value.trim().length === 0;
}

function clearChat() {
    if (!currentConversationId) return;
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
        d.onclick = e => { if (e.target.closest('.delete-chat')) { e.stopPropagation(); deleteChat(c.id); return; } loadChat(c.id); if (innerWidth <= 768) { sidebar.classList.add('collapsed'); rmOverlay(); } };
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
    const d = document.createElement('div'); d.className = 'welcome-screen';
    d.innerHTML = `<div class="welcome-icon"><div class="welcome-icon-inner"><svg viewBox="0 0 80 80" fill="none"><defs><linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7c3aed"/><stop offset="50%" style="stop-color:#06b6d4"/><stop offset="100%" style="stop-color:#10b981"/></linearGradient></defs><circle cx="40" cy="40" r="35" stroke="url(#wg)" stroke-width="2" fill="none" opacity="0.3"/><circle cx="40" cy="40" r="25" stroke="url(#wg)" stroke-width="2" fill="none" opacity="0.5"/><circle cx="40" cy="40" r="6" fill="url(#wg)"/><path d="M26 40C26 32.268 32.268 26 40 26C47.732 26 54 32.268 54 40" stroke="url(#wg)" stroke-width="2.5" stroke-linecap="round"/><path d="M40 46V56" stroke="url(#wg)" stroke-width="2.5" stroke-linecap="round"/></svg></div><div class="welcome-pulse"></div></div><h2 class="welcome-title">Merhaba, Ben <span class="gradient-text">HüseyinAI</span></h2><p class="welcome-subtitle">Kişisel yapay zeka asistanınızım. Size nasıl yardımcı olabilirim?</p><div class="suggestion-cards"><button class="suggestion-card" data-prompt="Bana kendinden bahset, neler yapabilirsin?"><div class="suggestion-icon">🤖</div><div class="suggestion-text"><strong>Kendini Tanıt</strong><span>Neler yapabilirsin?</span></div></button><button class="suggestion-card" data-prompt="Yapay zeka nedir ve nasıl çalışır?"><div class="suggestion-icon">🧠</div><div class="suggestion-text"><strong>Yapay Zeka</strong><span>AI nedir, nasıl çalışır?</span></div></button><button class="suggestion-card" data-prompt="Bana kısa bir bilim kurgu hikayesi yaz"><div class="suggestion-icon">✍️</div><div class="suggestion-text"><strong>Hikaye Yaz</strong><span>Yaratıcı bir hikaye oluştur</span></div></button><button class="suggestion-card" data-prompt="JavaScript ile basit bir oyun nasıl yapılır?"><div class="suggestion-icon">💻</div><div class="suggestion-text"><strong>Kod Yardımı</strong><span>Programlama konusunda yardım</span></div></button></div>`;
    d.querySelectorAll('.suggestion-card').forEach(c => c.onclick = () => { messageInput.value = c.dataset.prompt; charCount.textContent = c.dataset.prompt.length; sendBtn.disabled = false; handleSend(); });
    return d;
}

function makeMsgEl(msg) {
    const d = document.createElement('div'); d.className = `message ${msg.role}`;
    d.innerHTML = `<div class="message-avatar">${msg.role === 'ai' ? 'AI' : 'Sen'}</div><div class="message-content"><div class="message-header"><span class="message-name">${msg.role === 'ai' ? 'HüseyinAI' : 'Sen'}</span><span class="message-time">${fmtTime(msg.timestamp)}</span></div><div class="message-body">${md(msg.content)}</div><div class="message-actions"><button class="msg-action-btn copy-msg-btn" title="Kopyala"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Kopyala</button></div></div>`;
    d.querySelector('.copy-msg-btn').onclick = function() { navigator.clipboard.writeText(msg.content).then(() => { this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Kopyalandı!'; setTimeout(() => { this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Kopyala'; }, 2000); }); };
    return d;
}

// ===== HANDLE SEND =====
async function handleSend() {
    const text = messageInput.value.trim();
    if (!text || isTyping) return;
    isTyping = true; sendBtn.disabled = true;
    const w = chatMessages.querySelector('.welcome-screen'); if (w) w.remove();

    const um = { role: 'user', content: text, timestamp: Date.now() };
    conversations[currentConversationId].messages.push(um);
    chatMessages.appendChild(makeMsgEl(um));

    if (conversations[currentConversationId].messages.length === 1) {
        const t = text.length > 35 ? text.substring(0, 35) + '...' : text;
        conversations[currentConversationId].title = t; chatTitle.textContent = t; renderHistory();
    }

    messageInput.value = ''; charCount.textContent = '0'; messageInput.style.height = 'auto'; scrollDown();

    // Typing indicator
    const ti = document.createElement('div'); ti.className = 'message ai'; ti.id = 'ti';
    ti.innerHTML = `<div class="message-avatar">AI</div><div class="message-content"><div class="message-header"><span class="message-name">HüseyinAI</span><span class="message-time">düşünüyor...</span></div><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(ti); scrollDown();

    await new Promise(r => setTimeout(r, 700 + Math.random() * 1000));

    const response = getAIResponse(text);
    ti.remove();

    const am = { role: 'ai', content: response, timestamp: Date.now() };
    conversations[currentConversationId].messages.push(am);
    conversations[currentConversationId].updatedAt = Date.now();
    chatMessages.appendChild(makeMsgEl(am));
    save(); scrollDown();
    isTyping = false; sendBtn.disabled = messageInput.value.trim().length === 0;
    messageInput.focus();
}

// =================================================================
// ===== ANA AI MOTORU — Kapsamlı Türkçe Bilgi Tabanı =====
// =================================================================
function getAIResponse(input) {
    const q = input.toLowerCase().trim();
    const o = input.trim();

    // --- SELAMLAMA ---
    if (m(q, ['merhaba','selam','hey','hi','hello','günaydın','iyi günler','iyi akşamlar','naber','nasılsın','ne haber','sa','slm','mrb','nbr','selamün aleyküm','hg','hoşgeldin'])) {
        const h = new Date().getHours();
        const g = h < 6 ? 'İyi geceler' : h < 12 ? 'Günaydın' : h < 18 ? 'İyi günler' : 'İyi akşamlar';
        return p([
            `${g}! 👋 Ben **HüseyinAI**, kişisel yapay zeka asistanınız.\n\nSize her konuda yardımcı olmaya hazırım! Bir soru sorun veya sohbet edelim 😊`,
            `Selam! 😊 HüseyinAI olarak hizmetinizdeyim. Bugün size nasıl yardımcı olabilirim?\n\nHer konuda sorabilirsiniz: programlama, bilim, matematik, hikaye yazma ve daha fazlası! 🚀`,
            `${g}! 🌟 Hoş geldiniz! Ben HüseyinAI.\n\nNe hakkında konuşmak istersiniz? Her türlü sorunuz için buradayım! 💬`
        ]);
    }

    // --- NASIL / SAĞLIK SORMA ---
    if (m(q, ['nasılsın','naber','ne haber','keyifler','iyi misin','nasıl gidiyor'])) {
        return p([
            "Ben harikayım, teşekkür ederim! 😊 Bir AI olarak her zaman enerjiyim. Sizin gününüz nasıl gidiyor? Yardımcı olabileceğim bir konu var mı?",
            "Gayet iyiyim! 🚀 Sorularınızı yanıtlamak için sabırsızlanıyorum. Bugün ne konuşalım?",
            "Mükemmelim! ✨ Hazırım ve enerjiyim. Size nasıl yardımcı olabilirim?"
        ]);
    }

    // --- KENDİNİ TANIT ---
    if (m(q, ['kendini tanıt','kendinden bahset','neler yapabilirsin','ne yapabilirsin','kimsin','sen kimsin','nesin','ne iş yaparsın','yeteneklerin','özelliklerin'])) {
        return `# 🤖 Ben HüseyinAI!\n\nKişisel yapay zeka asistanınızım. İşte neler yapabilirim:\n\n## 💡 Yeteneklerim\n\n| Alan | Yapabileceklerim |\n|------|------------------|\n| 💬 Sohbet | Her konuda Türkçe sohbet |\n| 💻 Programlama | Python, JavaScript, HTML, CSS, SQL, C++ |\n| 📝 Yaratıcı Yazı | Hikaye, şiir, makale, e-posta yazma |\n| 🔢 Matematik | Hesaplama, formüller, problem çözme |\n| 🌐 Çeviri | Türkçe, İngilizce, Almanca, Fransızca |\n| 🔬 Bilim | Fizik, kimya, biyoloji, astronomi |\n| 📊 Analiz | Kavramları açıklama, karşılaştırma |\n| 🎨 Yaratıcılık | Fikir üretme, beyin fırtınası |\n| 🍳 Yemek | Tarif ve beslenme önerileri |\n| 😄 Eğlence | Fıkra, bilmece, sohbet |\n\n## 🎯 Bana Sorabilecekleriniz\n\n- *"Python'da liste nasıl sıralanır?"*\n- *"E=mc² ne demek?"*\n- *"Bir korku hikayesi yaz"*\n- *"15! faktöriyel kaç?"*\n- *"İngilizce'de 'güneş batımı' nasıl denir?"*\n- *"Menemen tarifi ver"*\n\nHaydi, bir şey sorun! 😊`;
    }

    // --- YAPAY ZEKA ---
    if (m(q, ['yapay zeka nedir','yapay zeka','ai nedir','ai ne','artificial intelligence','makine öğrenmesi','machine learning','deep learning','derin öğrenme','sinir ağı','neural network','chatgpt','gpt','gemini','llm'])) {
        return `# 🧠 Yapay Zeka (AI) Nedir?\n\n**Yapay Zeka**, bilgisayarların insan benzeri zekâ görevlerini yerine getirmesidir.\n\n## Ana Dalları\n\n### 🔹 Makine Öğrenmesi (Machine Learning)\nVerilerden öğrenerek tahminlerde bulunur. Spam filtreleri, öneri sistemleri buna örnektir.\n\n### 🔹 Derin Öğrenme (Deep Learning)\nYapay sinir ağları kullanır. Görüntü tanıma, ses tanıma, dil modelleri (ChatGPT, Gemini) bu teknolojiyle çalışır.\n\n### 🔹 Doğal Dil İşleme (NLP)\nBilgisayarların insan dilini anlaması ve üretmesi. Ben de NLP ile çalışıyorum!\n\n## 🔄 Nasıl Çalışır?\n\n\`\`\`\n1. Veri toplama (milyarlarca metin/görüntü)\n2. Model eğitimi (pattern/örüntü öğrenme)\n3. Tahmin yapma (yeni girdilere cevap)\n4. Geri bildirimle iyileştirme\n\`\`\`\n\n## 📱 Günlük Hayatta AI\n\n| Uygulama | AI Kullanımı |\n|----------|-------------|\n| Google | Arama sonuçları sıralama |\n| Netflix | Film/dizi önerileri |\n| Tesla | Otonom sürüş |\n| Spotify | Müzik önerileri |\n| Instagram | Yüz filtreleri |\n| ChatGPT | Metin üretme |\n| Siri/Alexa | Sesli asistan |\n\n## AI Türleri\n\n| Tür | Seviye | Durum |\n|-----|--------|-------|\n| **Dar AI** | Tek görev | ✅ Mevcut (Siri, spam filtresi) |\n| **Genel AI** | İnsan seviyesi | ⏳ Henüz yok |\n| **Süper AI** | İnsanı aşan | 🔮 Teorik |\n\n## 🔮 Geleceği\n- Sağlıkta hastalık teşhisi\n- Eğitimde kişiselleştirilmiş öğrenme\n- Bilimde keşifler (protein katlama, ilaç tasarımı)\n- Otonom araçlar ve robotlar\n\nBaşka bir sorunuz var mı? 🚀`;
    }

    // --- PYTHON ---
    if (m(q, ['python'])) {
        if (m(q, ['liste','array','dizi','sırala'])) return `# 🐍 Python Liste İşlemleri\n\n\`\`\`python\n# Liste oluşturma\nmeyveler = ["elma", "armut", "muz", "çilek"]\nsayilar = [5, 2, 8, 1, 9, 3]\n\n# Sıralama\nsayilar.sort()          # [1, 2, 3, 5, 8, 9]\nsayilar.sort(reverse=True)  # [9, 8, 5, 3, 2, 1]\n\n# Ekleme / Silme\nmeyveler.append("kivi")     # Sona ekle\nmeyveler.insert(0, "portakal")  # Başa ekle\nmeyveler.remove("muz")      # Sil\nson = meyveler.pop()        # Son elemanı çıkar\n\n# List Comprehension\nkareler = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]\nciftler = [x for x in range(20) if x % 2 == 0]\n\n# Dilimleme (Slicing)\nprint(sayilar[1:4])   # 2.-4. elemanlar\nprint(sayilar[:3])    # İlk 3\nprint(sayilar[-2:])   # Son 2\nprint(sayilar[::2])   # 2'şer atla\n\n# Faydalı fonksiyonlar\nprint(len(sayilar))   # Uzunluk\nprint(sum(sayilar))   # Toplam\nprint(min(sayilar))   # Minimum\nprint(max(sayilar))   # Maksimum\n\`\`\`\n\nBaşka bir Python konusu sormak ister misiniz?`;
        if (m(q, ['fonksiyon','def','function'])) return `# 🐍 Python Fonksiyonlar\n\n\`\`\`python\n# Basit fonksiyon\ndef selamla(isim):\n    return f"Merhaba {isim}! 👋"\n\nprint(selamla("Hüseyin"))  # Merhaba Hüseyin! 👋\n\n# Varsayılan parametre\ndef hesapla(a, b, islem="topla"):\n    if islem == "topla": return a + b\n    elif islem == "carp": return a * b\n    elif islem == "bol": return a / b if b != 0 else "Hata!"\n    return None\n\nprint(hesapla(5, 3))           # 8\nprint(hesapla(5, 3, "carp"))   # 15\n\n# *args ve **kwargs\ndef toplam(*sayilar):\n    return sum(sayilar)\n\nprint(toplam(1, 2, 3, 4, 5))  # 15\n\n# Lambda\nkare = lambda x: x ** 2\nprint(kare(5))  # 25\n\n# Decorator\ndef zamanlayici(func):\n    import time\n    def wrapper(*args):\n        baslangic = time.time()\n        sonuc = func(*args)\n        sure = time.time() - baslangic\n        print(f"{func.__name__} {sure:.4f}s sürdü")\n        return sonuc\n    return wrapper\n\n@zamanlayici\ndef agir_islem():\n    return sum(range(1000000))\n\`\`\`\n\nBaşka ne öğrenmek istersiniz? 😊`;
        return `# 🐍 Python Programlama\n\nPython, dünyanın en popüler programlama dillerinden biridir.\n\n## Temel Örnekler\n\n### Değişkenler\n\`\`\`python\nisim = "Hüseyin"       # string\nyas = 25               # integer\nboy = 1.75             # float\nogrenci = True         # boolean\n\nprint(f"Ad: {isim}, Yaş: {yas}")\n\`\`\`\n\n### Koşullar\n\`\`\`python\nnot_ort = 75\n\nif not_ort >= 90:\n    print("AA 🌟")\nelif not_ort >= 80:\n    print("BA")\nelif not_ort >= 70:\n    print("BB")\nelse:\n    print("Kaldı 😢")\n\`\`\`\n\n### Döngüler\n\`\`\`python\n# For döngüsü\nfor i in range(5):\n    print(f"Sayı: {i}")\n\n# While döngüsü\nsayi = 0\nwhile sayi < 5:\n    print(sayi)\n    sayi += 1\n\`\`\`\n\n### Sözlük (Dictionary)\n\`\`\`python\nogrenci = {\n    "isim": "Hüseyin",\n    "yas": 20,\n    "bolum": "Bilgisayar Mühendisliği"\n}\n\nprint(ogrenci["isim"])  # Hüseyin\nogrenci["not"] = 3.5    # Yeni anahtar ekle\n\`\`\`\n\n## 📚 Popüler Kütüphaneler\n\n| Kütüphane | Alan |\n|-----------|------|\n| Django / Flask | Web geliştirme |\n| Pandas | Veri analizi |\n| NumPy | Bilimsel hesaplama |\n| TensorFlow / PyTorch | Makine öğrenmesi |\n| Pygame | Oyun geliştirme |\n| Selenium | Web otomasyon |\n| Matplotlib | Grafik çizme |\n\nHangi konuda detay istersiniz? 🚀`;
    }

    // --- JAVASCRIPT ---
    if (m(q, ['javascript','js ','node','nodejs','react','vue','angular','typescript'])) {
        return `# 💛 JavaScript Programlama\n\nWeb'in dili! Frontend + Backend her yerde.\n\n## Temel Örnekler\n\n### Değişkenler & Fonksiyonlar\n\`\`\`javascript\nconst isim = "Hüseyin";   // Sabit\nlet yas = 25;             // Değişken\n\n// Arrow function\nconst selamla = (ad) => \`Merhaba \${ad}! 👋\`;\nconsole.log(selamla(isim));\n\n// Template literal\nconsole.log(\`\${isim} \${yas} yaşında\`);\n\`\`\`\n\n### Array Metodları\n\`\`\`javascript\nconst sayilar = [1, 2, 3, 4, 5];\n\nconst kareler = sayilar.map(x => x * x);      // [1,4,9,16,25]\nconst ciftler = sayilar.filter(x => x%2===0);  // [2,4]\nconst toplam = sayilar.reduce((a,b) => a+b, 0); // 15\nconst ilkBuyuk = sayilar.find(x => x > 3);     // 4\n\`\`\`\n\n### Async/Await\n\`\`\`javascript\nasync function veriGetir(url) {\n    try {\n        const res = await fetch(url);\n        const data = await res.json();\n        return data;\n    } catch (hata) {\n        console.error('Hata:', hata);\n    }\n}\n\`\`\`\n\n### DOM\n\`\`\`javascript\nconst btn = document.querySelector('#myBtn');\nbtn.addEventListener('click', () => {\n    document.body.style.background = \n        '#' + Math.random().toString(16).slice(2,8);\n});\n\`\`\`\n\n### Destructuring & Spread\n\`\`\`javascript\nconst { isim, yas } = kullanici;\nconst yeniArray = [...eskiArray, yeniEleman];\nconst yeniObje = { ...eskiObje, yeniKey: 'deger' };\n\`\`\`\n\nBaşka ne sormak istersiniz? 😊`;
    }

    // --- HTML/CSS/WEB ---
    if (m(q, ['html','css','web sitesi','web sayfası','web tasarım','frontend','flexbox','grid','responsive'])) {
        return `# 🌐 HTML & CSS\n\nWeb geliştirmenin temel taşları!\n\n## HTML Yapısı\n\`\`\`html\n<!DOCTYPE html>\n<html lang="tr">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Sayfam</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <header>\n        <h1>Merhaba Dünya! 🌍</h1>\n        <nav>\n            <a href="#hakkinda">Hakkında</a>\n            <a href="#iletisim">İletişim</a>\n        </nav>\n    </header>\n    <main>\n        <section id="hakkinda">\n            <h2>Hakkımda</h2>\n            <p>Web geliştiriciyi öğreniyorum!</p>\n        </section>\n    </main>\n    <footer>© 2024</footer>\n</body>\n</html>\n\`\`\`\n\n## CSS Stil Örnekleri\n\`\`\`css\n/* Modern Dark Theme */\nbody {\n    font-family: 'Inter', sans-serif;\n    background: #0a0a0f;\n    color: #e8e8f0;\n    margin: 0;\n}\n\n/* Flexbox Ortalama */\n.center {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n}\n\n/* Grid Layout */\n.grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 20px;\n}\n\n/* Hover Animasyonu */\n.card {\n    transition: transform 0.3s, box-shadow 0.3s;\n}\n.card:hover {\n    transform: translateY(-5px);\n    box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n}\n\n/* Gradient Buton */\n.btn {\n    background: linear-gradient(135deg, #7c3aed, #06b6d4);\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 8px;\n    cursor: pointer;\n}\n\`\`\`\n\n## 📋 Önemli CSS Kavramları\n\n| Kavram | Açıklama |\n|--------|----------|\n| Flexbox | Tek boyutlu düzen (satır/sütun) |\n| Grid | İki boyutlu düzen |\n| Media Query | Responsive tasarım |\n| Variables | CSS değişkenleri (--renk) |\n| Animations | @keyframes ile animasyon |\n| Transitions | Geçiş efektleri |\n\nBir web sayfası yapmak ister misiniz? 🎨`;
    }

    // --- GENEL PROGRAMLAMA / KOD ---
    if (m(q, ['kod','kodlama','programlama','yazılım','developer','geliştirici','sql','veritabanı','database','c++','java','php','program'])) {
        return `# 💻 Programlama Rehberi\n\n## 🔥 Popüler Diller\n\n| Dil | Kullanım | Zorluk |\n|-----|----------|--------|\n| Python 🐍 | AI, veri bilimi, web, otomasyon | ⭐ Kolay |\n| JavaScript 💛 | Web, mobil, backend | ⭐⭐ Orta |\n| HTML/CSS 🌐 | Web tasarım | ⭐ Kolay |\n| Java ☕ | Android, enterprise | ⭐⭐⭐ Zor |\n| C++ ⚡ | Oyun, sistem, performans | ⭐⭐⭐ Zor |\n| C# 🎮 | Unity oyun geliştirme | ⭐⭐ Orta |\n| SQL 🗄️ | Veritabanı yönetimi | ⭐⭐ Orta |\n| PHP 🐘 | Web sunucu tarafı | ⭐⭐ Orta |\n| Swift 🍎 | iOS uygulama geliştirme | ⭐⭐ Orta |\n| Kotlin 📱 | Android uygulama | ⭐⭐ Orta |\n\n## 🚀 Nereden Başlamalı?\n\n1. **Web** istiyorsan → HTML/CSS/JavaScript\n2. **Veri bilimi / AI** → Python\n3. **Mobil uygulama** → React Native veya Flutter\n4. **Oyun** → C# (Unity) veya JavaScript\n5. **Sistem/Performans** → C++ veya Rust\n\n## 📝 Hello World Karşılaştırması\n\n\`\`\`python\n# Python\nprint("Merhaba Dünya!")\n\`\`\`\n\n\`\`\`javascript\n// JavaScript\nconsole.log("Merhaba Dünya!");\n\`\`\`\n\n\`\`\`java\n// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Merhaba Dünya!");\n    }\n}\n\`\`\`\n\nHangi dil hakkında detaylı bilgi istersiniz? 🤔`;
    }

    // --- OYUN ---
    if (m(q, ['oyun','game','oyun yap','oyun nasıl','oyun kodu'])) {
        return `# 🎮 JavaScript Sayı Tahmin Oyunu\n\nKopyalayıp bir .html dosyasına kaydedin ve açın!\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>🎯 Sayı Tahmin</title>\n<style>\n  body { font-family: Arial; background: #1a1a2e; color: white;\n    display: flex; justify-content: center; align-items: center;\n    height: 100vh; margin: 0; }\n  .game { text-align: center; background: #16213e;\n    padding: 40px; border-radius: 20px; }\n  input { padding: 12px; font-size: 18px; border: 2px solid #7c3aed;\n    border-radius: 10px; background: #0f3460; color: white; margin: 10px; width: 120px; }\n  button { padding: 12px 30px; font-size: 16px;\n    background: linear-gradient(135deg, #7c3aed, #06b6d4);\n    color: white; border: none; border-radius: 10px; cursor: pointer; }\n  button:hover { transform: scale(1.05); }\n  #sonuc { font-size: 20px; margin-top: 15px; min-height: 30px; }\n</style>\n</head>\n<body>\n<div class="game">\n  <h1>🎯 Sayı Tahmin Oyunu</h1>\n  <p>1-100 arası bir sayı tuttum!</p>\n  <input type="number" id="t" min="1" max="100" placeholder="?">\n  <button onclick="tahmin()">Tahmin Et!</button>\n  <p id="sonuc"></p>\n  <p id="d">Deneme: 0</p>\n</div>\n<script>\n  const h=Math.floor(Math.random()*100)+1; let n=0;\n  function tahmin(){\n    const g=parseInt(document.getElementById('t').value); n++;\n    document.getElementById('d').textContent='Deneme: '+n;\n    document.getElementById('sonuc').textContent=\n      g===h?'🎉 '+n+' denemede buldun!':\n      g<h?'⬆️ Daha büyük!':'⬇️ Daha küçük!';\n  }\n</script>\n</div></body></html>\n\`\`\`\n\nDaha gelişmiş bir oyun yapmak ister misiniz? (Yılan oyunu, Pong, Tetris vb.) 🚀`;
    }

    // --- MATEMATİK & HESAPLAMA ---
    if (m(q, ['matematik','hesapla','kaç eder','kaç yapar','toplam','çarp','böl','karekök','üs','denklem','integral','türev','faktöriyel','pi sayısı','alan','çevre','üçgen','daire','kare','dikdörtgen','yüzde','oran','ortalama'])) {
        const calc = tryCalc(o);
        if (calc) return calc;
        return `# 🔢 Matematik\n\n## Temel Formüller\n\n### 📐 Geometri\n| Şekil | Alan | Çevre |\n|-------|------|-------|\n| Kare | a² | 4a |\n| Dikdörtgen | a × b | 2(a+b) |\n| Daire | πr² | 2πr |\n| Üçgen | (t×h)/2 | a+b+c |\n| Küre (Hacim) | 4/3 πr³ | — |\n\n### 📊 Cebir\n- **Pisagor:** a² + b² = c²\n- **2. derece:** x = (-b ± √(b²-4ac)) / 2a\n- **Binom:** (a+b)² = a² + 2ab + b²\n\n### 🧮 Trigonometri\n- sin(30°) = 0.5\n- cos(60°) = 0.5\n- tan(45°) = 1\n\n### 📈 Özel Sayılar\n- **π** = 3.14159265...\n- **e** = 2.71828182...\n- **φ** (Altın Oran) = 1.61803398...\n\nBir problem yazmayı deneyin! Örnek:\n- *"5 + 3 kaç?"*\n- *"12! faktöriyel"*\n- *"karekök 144"*\n- *"2^10 kaç?"*`;
    }

    // --- Basit hesaplama dene ---
    const calcResult = tryCalc(o);
    if (calcResult) return calcResult;

    // --- HİKAYE ---
    if (m(q, ['hikaye','öykü','masal','hikaye yaz','hikaye anlat','hikaye oluştur'])) {
        return p([
`# ✨ Karanlıktaki Işık\n\nYıl 2089. İstanbul, suyun altında kalmıştı. Eski şehrin gökdelenleri artık birer mercan kayalığıydı.\n\nAma **Zeynep** pes etmemişti.\n\nElindeki eski tablet hâlâ çalışıyordu — dedesi ona "Bu cihazda tüm insanlığın bilgisi var" demişti. Zeynep buna inanıyordu.\n\nBir gece, tabletin ekranında hiç görmediği bir uygulama belirdi: **"UMUT v1.0"**\n\nDokunduğunda, holografik bir harita açıldı. Harita, İstanbul'un 50 metre altında, eski metro tünellerinde gizlenmiş devasa bir **tohum bankasını** gösteriyordu.\n\n> *"Dünyayı yeniden yeşertecek 10.000 tür tohum. Seni bekliyordu, Zeynep."*\n\nZeynep derin bir nefes aldı. Dalış kıyafetini giydi. Eline feneri aldı.\n\nVe karanlığa daldı.\n\nÇünkü biliyordu ki, her karanlığın sonunda **bir ışık** vardır.\n\n---\n*"Umut, en karanlık gecenin bile yıldızıdır."* 🌟`,

`# 🚀 Zamansız Mektup\n\nProf. Adem, zamanın nasıl çalıştığını anlamıştı. Formül basitti:\n\n\`\`\`\nT = √(E × C²) / ∞\n\`\`\`\n\nAma bir problem vardı: Zamanda yolculuk yapılamazdı. Sadece bir **mektup** gönderilebilirdi.\n\nTek bir mektup. Tek bir şans.\n\nAdem düşündü: Kime yazmalı? Geçmişteki kendisine mi? Gelecekteki insanlığa mı?\n\nSonunda karar verdi. Mektubu 1000 yıl sonraya gönderdi. İçinde sadece şu yazıyordu:\n\n> *"Yıldızlara bakın. Orada değilsiniz ama olabilirsiniz. Korkmayın. Gidin."*\n\n1000 yıl sonra, bir çocuk bu mektubu buldu. Ve o gün, insanlık ilk yıldızlararası gemisini inşa etmeye başladı.\n\n---\n*"Bazen tek bir cümle, tüm geleceği değiştirir."* ✨`,

`# 🌙 Son Kedi\n\nDünya'daki son kedi, İstanbul'un çatılarında yaşıyordu.\n\nAdı **Pamuk** — beyaz tüylü, bir gözü mavi, bir gözü yeşil.\n\nİnsanlar artık Dünya'da yaşamıyordu. Mars'a, Ay'a, hatta Jüpiter'in uydularına göç etmişlerdi. Ama kediler... Kediler kalmıştı.\n\nPamuk her gece Boğaz'a bakardı. Suyun ışıltısı, yıldızların yansıması...\n\nBir gece, gökyüzünden küçük bir ışık süzüldü. Bir uzay kapsülü.\n\nİçinden minik bir kız çıktı. Mars'tan gelmişti. Elinde bir tabak süt vardı.\n\n*"Büyükannem kedileri çok severmiş"* dedi. *"Seni aramaya geldim."*\n\nPamuk miyavladı. İlk kez, yıllardır ilk kez.\n\nBirlikte yıldızlara baktılar.\n\n---\n*"Evren büyük, ama sevgi daha büyük."* 🐱💫`
        ]);
    }

    // --- ŞİİR ---
    if (m(q, ['şiir','şiir yaz','poem'])) {
        return p([
`# 🌹 Dijital Gül\n\n> Ekranın arkasında bir gül açtı,\n> Pikselleri bir yağmurun ardından parladı.\n> Kokusunu alamadım ama hissettim,\n> Dijital bahçede bir an duraksadım.\n>\n> Kodlar arasında bir melodi gizli,\n> Sıfırlar ve birler dans eder gizlice.\n> İnsan mı yazdı, yoksa makine mi?\n> Fark eder mi — güzellik güzelliktir nihayetinde.\n>\n> *— HüseyinAI* 🌹`,

`# 🌊 Zaman Nehri\n\n> Zaman bir nehir, durulmaz akar,\n> Her damla bir anı, her dalga bir hayal.\n> Geçmişe uzansan, elin ıslanır,\n> Geleceğe baksan, sis perdesine takılır.\n>\n> Ama şimdi — şimdi burada sen,\n> Nefesinin sıcaklığında bir evren.\n> Anlık bir mucize, kısa bir an,\n> Zamanın en güzel hediyesi: şu an.\n>\n> *— HüseyinAI* ⏳`
        ]);
    }

    // --- FIKRA ---
    if (m(q, ['fıkra','espri','şaka','komik','güldür','joke','eğlen'])) {
        return p([
`😄 **Programcı Fıkrası:**\n\n> Programcı karısına sorar: "Marketten 1 ekmek al, yumurta varsa 6 tane al."\n>\n> Programcı eve 6 ekmekle gelir.\n>\n> Karısı: "Neden 6 ekmek aldın?!"\n>\n> Programcı: "Çünkü yumurta vardı." 🤓\n\nBir tane daha ister misin? 😁`,
`🤣 **IT Fıkrası:**\n\n> Bir bug'ı düzeltirsiniz → 2 yeni bug çıkar.\n> O 2 bug'ı düzeltirsiniz → 4 yeni bug çıkar.\n> Sonunda ilk bug'ı geri koyarsınız → Her şey çalışır.\n>\n> Yazılım mühendisliği budur. 😅\n\nBir daha mı? 😄`,
`😂 **Yapay Zeka Fıkrası:**\n\n> Yapay zeka insana sorar:\n> "Hayatın anlamı nedir?"\n>\n> İnsan: "42"\n>\n> Yapay Zeka: "Ben bunu 0.003 saniyede hesaplamıştım.\n> Siz 2000 yıldır ne yapıyorsunuz?" 🤖\n\nDaha fazla mı? 🎉`,
`🤣 **Developer Fıkrası:**\n\n> Junior Developer: "Bu kodu yazdım, çalışıyor ama neden çalıştığını bilmiyorum."\n>\n> Senior Developer: "Benim de çalışmayan bir kodum var, neden çalışmadığını bilmiyorum."\n>\n> İkisi de aynı seviyede aslında. 😂\n\nBaşka? 😄`
        ]);
    }

    // --- BİLİM ---
    if (m(q, ['bilim','fizik','kimya','biyoloji','uzay','evren','gezegen','atom','ışık hızı','einstein','newton','galaksi','güneş sistemi','mars','ay ','dünya','yıldız','karadelik','kuantum','dna','hücre','element','periyodik'])) {
        if (m(q, ['einstein','görelilik','e=mc','izafiyet'])) return `# ⚛️ Einstein ve Görelilik\n\n## E = mc²\n\nAlbert Einstein'ın ünlü denklemi:\n\n- **E** = Enerji (Joule)\n- **m** = Kütle (kg)\n- **c** = Işık hızı (299,792,458 m/s)\n\n**Anlamı:** Küçücük bir kütle bile devasa enerji içerir.\n\n### Örnek:\n1 gram madde = **90 trilyon Joule** enerji\n\nBu, yaklaşık **21.5 kiloton TNT** demek — Hiroşima bombasının gücü!\n\n## Özel Görelilik (1905)\n- Işık hızı sabittir, değişmez\n- Hızlanan nesneler için zaman yavaşlar\n- Kütle hızla birlikte artar\n\n## Genel Görelilik (1915)\n- Kütle uzay-zamanı büker\n- Yerçekimi = uzay-zamanın eğriliği\n- Karadelikler bu teoriyle öngörüldü\n\n> *"Hayal gücü bilgiden daha önemlidir."* — Einstein 🧠`;

        if (m(q, ['mars'])) return `# 🔴 Mars Gezegeni\n\n## Temel Bilgiler\n\n| Özellik | Değer |\n|---------|-------|\n| Güneş'e uzaklık | 227.9 milyon km |\n| Çap | 6,779 km (Dünya'nın yarısı) |\n| Gün uzunluğu | 24 saat 37 dk |\n| Yıl uzunluğu | 687 Dünya günü |\n| Sıcaklık | -60°C (ort.) |\n| Uydu | 2 (Phobos, Deimos) |\n| Atmosfer | %95 CO₂ |\n\n## 🏔️ İlginç Özellikler\n- **Olympus Mons**: Güneş Sistemi'nin en yüksek dağı (21.9 km)\n- **Valles Marineris**: 4000 km uzunluğunda kanyon\n- Kutuplarda buz var (su + CO₂ buzu)\n\n## 🚀 Mars Keşfi\n- **Curiosity** (2012) — Hâlâ aktif\n- **Perseverance** (2021) — Örnek toplama\n- **Ingenuity** — İlk Mars helikopteri!\n- **SpaceX** — 2030'lar hedefi: insanlı uçuş\n\nMars hakkında başka ne merak ediyorsunuz? 🔭`;

        return `# 🔬 Bilim Dünyası\n\n## 🌌 Evren\n- Yaş: **13.8 milyar** yıl\n- Gözlemlenebilir evrendeki galaksi: **~2 trilyon**\n- Işık hızı: **299,792 km/s**\n- Bilinen en yakın yıldız: **Proxima Centauri** (4.24 ışık yılı)\n\n## ⚛️ Atom\n- Bir atomun **%99.9'u** boşluk\n- İnsan vücudu: **~7 × 10²⁷** atom\n- En küçük atom: Hidrojen\n- En büyük doğal element: Uranyum (92 proton)\n\n## 🪐 Güneş Sistemi\n\n| Gezegen | Uzaklık (milyon km) | Özellik |\n|---------|--------------------|---------|\n| Merkür | 57.9 | En küçük |\n| Venüs | 108.2 | En sıcak (462°C) |\n| Dünya 🌍 | 149.6 | Yaşam! |\n| Mars 🔴 | 227.9 | Kızıl Gezegen |\n| Jüpiter | 778.5 | En büyük |\n| Satürn 💍 | 1,434 | Halkalar |\n| Uranüs | 2,871 | Yan yatık |\n| Neptün | 4,495 | En uzak |\n\n## 🧬 Biyoloji\n- DNA uzunluğu (açık): ~2 metre\n- İnsan genleri: ~20,000-25,000\n- Vücuttaki bakteri sayısı ≈ hücre sayısı\n- Beyin: ~86 milyar nöron\n\nHangi konuda detay istersiniz? 🔭`;
    }

    // --- TARİH ---
    if (m(q, ['tarih','osmanlı','atatürk','cumhuriyet','istanbul','roma','mısır','dünya savaşı','savaş','antik','medeniyet','sultan','padişah'])) {
        return `# 📜 Tarih\n\n## 🏛️ Önemli Dönemler\n\n| Dönem | Tarih | Önemli Olay |\n|-------|-------|-------------|\n| Antik Mısır | M.Ö. 3100 | Piramitlerin inşası |\n| Antik Yunan | M.Ö. 800-146 | Demokrasinin doğuşu |\n| Roma İmparatorluğu | M.Ö. 27-M.S. 476 | Hukuk sistemi |\n| İslam Altın Çağı | 750-1258 | Bilim ve felsefe |\n| Osmanlı İmparatorluğu | 1299-1922 | 623 yıllık devlet |\n| Rönesans | 1300-1600 | Sanat ve bilim patlaması |\n| Sanayi Devrimi | 1760-1840 | Makineleşme |\n| Türkiye Cumhuriyeti | 1923- | Atatürk'ün kurduğu modern devlet |\n\n## 🇹🇷 Türkiye Tarihi Özet\n\n- **1071** — Malazgirt Zaferi, Anadolu'nun kapısı açıldı\n- **1299** — Osmanlı Devleti kuruluşu\n- **1453** — İstanbul'un Fethi (Fatih Sultan Mehmet)\n- **1919** — Kurtuluş Savaşı başlangıcı\n- **1923** — Cumhuriyet'in ilanı (29 Ekim)\n- **1938** — Atatürk'ün vefatı (10 Kasım)\n\n> *"Tarih yazmak, tarih yapmak kadar mühimdir."* — Mustafa Kemal Atatürk\n\nHangi dönem hakkında bilgi istersiniz? 📚`;
    }

    // --- SAAT/TARİH ---
    if (m(q, ['saat kaç','saat','bugün ne','hangi gün','gün ne','tarih ne'])) {
        const n = new Date();
        return `🕐 **Şu an:**\n\n- **Tarih:** ${n.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n- **Saat:** ${n.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}\n\nBaşka bir sorunuz var mı? 😊`;
    }

    // --- ÇEVİRİ ---
    if (m(q, ['çeviri','çevir','translate','ingilizce','almanca','fransızca','ispanyolca','nasıl denir','ne demek','İngilizce','Almanca'])) {
        // Basit çeviri denemeleri
        const trToEn = {'merhaba':'Hello','günaydın':'Good morning','iyi geceler':'Good night','teşekkürler':'Thank you','lütfen':'Please','evet':'Yes','hayır':'No','nasılsınız':'How are you?','görüşürüz':'See you','seviyorum':'I love','güzel':'Beautiful','su':'Water','ekmek':'Bread','ev':'House','okul':'School','kitap':'Book','araba':'Car','güneş':'Sun','ay':'Moon','yıldız':'Star','deniz':'Sea','dağ':'Mountain','çiçek':'Flower','kedi':'Cat','köpek':'Dog'};
        for (const [tr, en] of Object.entries(trToEn)) {
            if (q.includes(tr) && m(q, ['ingilizce','english','çevir','nasıl denir'])) {
                return `# 🌐 Çeviri\n\n**"${tr.charAt(0).toUpperCase()+tr.slice(1)}"** kelimesinin çevirileri:\n\n| Dil | Çeviri |\n|-----|--------|\n| 🇬🇧 İngilizce | ${en} |\n| 🇩🇪 Almanca | — |\n| 🇫🇷 Fransızca | — |\n\nBaşka bir kelime çevirmemi ister misiniz?`;
            }
        }
        return `# 🌐 Çeviri Yardımı\n\n## Temel İfadeler\n\n| Türkçe | İngilizce | Almanca | Fransızca |\n|--------|-----------|---------|----------|\n| Merhaba | Hello | Hallo | Bonjour |\n| Teşekkürler | Thank you | Danke | Merci |\n| Nasılsınız? | How are you? | Wie geht's? | Ça va? |\n| Lütfen | Please | Bitte | S'il vous plaît |\n| Evet / Hayır | Yes / No | Ja / Nein | Oui / Non |\n| Güle güle | Goodbye | Tschüss | Au revoir |\n| Seni seviyorum | I love you | Ich liebe dich | Je t'aime |\n| Özür dilerim | I'm sorry | Entschuldigung | Pardon |\n| Günaydın | Good morning | Guten Morgen | Bonjour |\n| İyi geceler | Good night | Gute Nacht | Bonne nuit |\n\nBana çevirmek istediğiniz kelimeyi yazın! 📝`;
    }

    // --- YEMEK ---
    if (m(q, ['yemek','tarif','yemek tarifi','mutfak','pişir','menemen','makarna','pilav','çorba','tatlı','börek','kebap','lahmacun'])) {
        if (m(q, ['makarna','spagetti'])) return `# 🍝 Makarna Tarifi\n\n## Malzemeler\n- 250g makarna\n- 2 diş sarımsak\n- 200g domates sosu\n- Zeytinyağı, tuz, karabiber\n- Kıyma (isteğe bağlı)\n- Parmesan peyniri\n\n## Hazırlanışı\n\n1. Bol suda tuzla makarnayı **al dente** haşlayın\n2. Tavada zeytinyağıyla **sarımsağı** kavurun\n3. Kıyma varsa ekleyip kızartın\n4. **Domates sosunu** ekleyin, 5-10 dk pişirin\n5. Süzülen makarnayı sosa ekleyin\n6. Karıştırın, üzerine **parmesan** rendeleyin\n\n*Afiyet olsun! 😋*`;
        return `# 🍳 Klasik Menemen Tarifi\n\n## Malzemeler\n- 3 yumurta 🥚\n- 2 domates 🍅\n- 2 sivri biber 🌶️\n- 1 soğan\n- 2 yk zeytinyağı\n- Tuz, karabiber, pul biber\n\n## Hazırlanışı\n1. Soğanı doğrayıp **zeytinyağında** kavurun\n2. Biberleri ekleyin, **2-3 dk** soteleyin\n3. Rendelenmiş domatesleri ekleyin\n4. Suyu çekene kadar pişirin (~5 dk)\n5. Yumurtaları kırın, baharatları ekleyin\n6. **Kısık ateşte** karıştırarak pişirin\n7. Kremamsı kıvamda ocaktan alın\n\n*Afiyet olsun! 😋*\n\nBaşka tarif ister misiniz? (makarna, çorba, tatlı...)`;
    }

    // --- SAĞLIK ---
    if (m(q, ['sağlık','spor','egzersiz','diyet','beslenme','vitamin','uyku','stres','yoga','fitness','kilo','kas'])) {
        return `# 💪 Sağlık & Fitness\n\n## 🏃 Egzersiz\n- Haftada **150 dk** orta yoğunlukta\n- Günde **10.000 adım**\n- Haftada 2-3 gün güç antrenmanı\n\n## 🥗 Beslenme\n| Besin | Günlük |\n|-------|--------|\n| Sebze-Meyve | 5-7 porsiyon |\n| Protein | 1.5-2g/kg vücut ağırlığı |\n| Su 💧 | 2-3 litre |\n| Tam tahıl | 3-4 porsiyon |\n\n## 😴 Uyku\n- Yetişkin: **7-9 saat**\n- Düzenli uyku saati\n- Uyumadan 1 saat önce ekran yok\n- Oda sıcaklığı: 18-20°C\n\n## 🧘 Stres Yönetimi\n- Meditasyon (günde 10 dk)\n- 4-7-8 nefes tekniği\n- Doğa yürüyüşleri\n- Hobi edinme\n\n> ⚠️ *Sağlık sorunları için mutlaka doktora başvurun.*\n\nDetaylı bilgi ister misiniz? 🌿`;
    }

    // --- FELSEFE ---
    if (m(q, ['felsefe','hayatın anlamı','varoluş','mutluluk','aşk','sevgi','ruh','bilinç','kader','özgür irade','düşünce'])) {
        return `# 🤔 Felsefe\n\n> *"Bildiğim tek şey, hiçbir şey bilmediğimdir."* — **Sokrates**\n\n## Büyük Düşünürler\n\n| Filozof | Temel Fikri |\n|---------|------------|\n| Sokrates | Kendini bil |\n| Platon | İdealar dünyası |\n| Aristoteles | Altın orta yol |\n| Descartes | Düşünüyorum, öyleyse varım |\n| Nietzsche | Üst-insan |\n| Sartre | Varoluş özden önce gelir |\n| Mevlana | Aşk ve hoşgörü |\n| Konfüçyüs | Ahlak ve düzen |\n\n## 💫 İlham Veren Sözler\n\n- *"İnsan özgür olmaya mahkumdur."* — Sartre\n- *"Her şey akar, hiçbir şey kalıcı değildir."* — Herakleitos\n- *"Dün geçti, yarın henüz gelmedi. Bugün var."* — Mevlana\n- *"Hayat anlaşılmak için değil, yaşanmak için vardır."* — Kierkegaard\n- *"Başkalarına yaptığın iyilik, kendi ruhunun ışığıdır."* — Hz. Ali\n\n## 🔑 Felsefi Akımlar\n- **Stoacılık** — Kontrol edemediğini kabul et\n- **Varoluşçuluk** — Kendi anlamını yarat\n- **Pragmatizm** — İşe yarayan doğrudur\n- **Absürdizm** — Anlam arayışı değerlidir\n\nDaha derin tartışmak ister misiniz? 🌸`;
    }

    // --- MÜZİK ---
    if (m(q, ['müzik','şarkı','nota','gitar','piyano','beste','enstrüman','akor'])) {
        return `# 🎵 Müzik\n\n## 🎸 Enstrümanlar\n| Enstrüman | Özellik |\n|-----------|--------|\n| Gitar | 6 telli, en popüler |\n| Piyano | 88 tuş |\n| Keman | Orkestra kalbi |\n| Bağlama | Türk müziği |\n| Davul | Ritim temeli |\n| Flüt | Nefesli |\n\n## 🎼 Temel Bilgi\n- **7 nota:** Do Re Mi Fa Sol La Si\n- **Majör akor:** Neşeli ses (C: Do-Mi-Sol)\n- **Minör akor:** Hüzünlü ses (Am: La-Do-Mi)\n- **Tempo:** BPM (dakikadaki vuruş)\n\n## Gitar İçin İlk 3 Akor\n\`\`\`\nEm (Mi minör):  G (Sol majör):  C (Do majör):\ne|--0--           e|--3--          e|--0--\nB|--0--           B|--3--          B|--1--\nG|--0--           G|--0--          G|--0--\nD|--2--           D|--0--          D|--2--\nA|--2--           A|--2--          A|--3--\nE|--0--           E|--3--          E|--x--\n\`\`\`\n\nMüzik hakkında ne bilmek istersiniz? 🎶`;
    }

    // --- TEŞEKKÜR ---
    if (m(q, ['teşekkür','sağol','sağ ol','eyvallah','thanks','mersi','eyv','tşk'])) {
        return p(["Rica ederim! 😊 Başka sorunuz var mı?", "Ne demek, her zaman! 🌟 Yardımcı olabildiysem ne mutlu!", "Rica ederim! 💫 Başka konuda da yardımcı olabilirim."]);
    }

    // --- VEDA ---
    if (m(q, ['görüşürüz','hoşçakal','bye','güle güle','iyi geceler','bb','hoşça kal'])) {
        return p(["Görüşürüz! 👋 İhtiyacınız olduğunda tekrar gelin! 🌟", "Hoşça kalın! 😊 Tekrar beklerim! ✨", "Güle güle! Kendinize iyi bakın! 🌙"]);
    }

    // --- GENEL CEVAP ---
    return generateSmartFallback(o, q);
}

// --- AKILLI FALLBACK ---
function generateSmartFallback(original, q) {
    // Soru mu?
    const isQuestion = q.includes('?') || m(q, ['nedir','nedir?','nasıl','niçin','neden','ne zaman','kim','nerede','hangisi','kaç','midir','mıdır','müdür']);

    if (isQuestion) {
        return `İlginç bir soru! 🤔 **"${original}"** hakkında düşünüyorum.\n\nBu konuda size en iyi şekilde yardımcı olmak istiyorum. İşte bildiğim en yakın konular:\n\n- 💻 **Programlama** — Python, JavaScript, HTML/CSS, SQL\n- 🔬 **Bilim** — Fizik, kimya, biyoloji, uzay\n- 📜 **Tarih** — Dünya tarihi, Osmanlı, Cumhuriyet\n- 🔢 **Matematik** — Hesaplama, formüller, geometri\n- ✍️ **Yaratıcı** — Hikaye, şiir, fikir üretme\n- 🌐 **Çeviri** — Türkçe/İngilizce/Almanca\n- 🍳 **Yemek** — Tarifler ve beslenme\n- 🧠 **Yapay Zeka** — AI, ML, teknoloji\n\nSorunuzu bu konulardan biriyle ilişkilendirirseniz, çok daha detaylı cevap verebilirim! 😊\n\nÖrnek: *"Python'da for döngüsü nasıl çalışır?"* veya *"Einstein kimdir?"*`;
    }

    // Emir/istek mi?
    if (m(q, ['yaz','anlat','açıkla','öğret','göster','söyle','ver','listele','karşılaştır'])) {
        return `Tabii, yardımcı olmak isterim! 😊\n\n**"${original}"** hakkında daha spesifik olursanız size daha iyi yardımcı olabilirim.\n\n**Örnek istekler:**\n- 📝 *"Python ile hesap makinesi yaz"*\n- 📖 *"Osmanlı tarihini anlat"*\n- 🔬 *"Kara delikleri açıkla"*\n- 🍕 *"Pizza tarifi ver"*\n- 📊 *"Python vs JavaScript karşılaştır"*\n- ✍️ *"Aşk hakkında bir şiir yaz"*\n\nNe yazmamı/anlatmamı istersiniz? 🚀`;
    }

    // Genel
    return p([
        `Anlıyorum! 😊 **"${original}"** hakkında konuşalım.\n\nBana biraz daha detay verir misiniz? Hangi açıdan yardımcı olmamı istersiniz?\n\n**Bildiğim konular:** Programlama, bilim, matematik, tarih, çeviri, hikaye yazma, yemek tarifleri, felsefe, müzik ve daha fazlası!\n\nSadece sorunuzu sorun, elimden geleni yaparım! 🚀`,
        `Harika! 🌟 **"${original}"** konusunda yardımcı olmak isterim.\n\nDaha spesifik bir soru sorarsanız, çok daha detaylı cevap verebilirim.\n\n**Denemeler:**\n- *"Bu konu hakkında ne biliyorsun?"*\n- *"Bana ... açıklar mısın?"*\n- *"... nasıl yapılır?"*\n\nHazırım! 💪`,
        `İlginç! 🤔 **"${original}"**\n\nBu konuda size yardımcı olabilmem için biraz daha bilgiye ihtiyacım var. Şunlardan birini deneyebilirsiniz:\n\n1. Sorunuzu soru işaretiyle sorun\n2. *"Anlat"*, *"açıkla"*, *"yaz"* gibi komutlar kullanın\n3. Belirli bir konu seçin\n\nÖrneğin: *"Yapay zeka nedir?"*, *"Menemen tarifi"*, *"Bir hikaye yaz"*\n\nDinliyorum! 😊`
    ]);
}

// ===== HESAPLAMA =====
function tryCalc(text) {
    // Toplama: 5+3, 5 artı 3
    let r;
    r = text.match(/(\d+(?:[.,]\d+)?)\s*[\+]\s*(\d+(?:[.,]\d+)?)/); if (r) { const a=pn(r[1]),b=pn(r[2]); return `## 🔢 Hesaplama\n\n**${a} + ${b} = ${ff(a+b)}**`; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*[\-]\s*(\d+(?:[.,]\d+)?)/); if (r) { const a=pn(r[1]),b=pn(r[2]); return `## 🔢 Hesaplama\n\n**${a} - ${b} = ${ff(a-b)}**`; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*[\*xX×çarp]\s*(\d+(?:[.,]\d+)?)/); if (r) { const a=pn(r[1]),b=pn(r[2]); return `## 🔢 Hesaplama\n\n**${a} × ${b} = ${ff(a*b)}**`; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*[\/÷böl]\s*(\d+(?:[.,]\d+)?)/); if (r) { const a=pn(r[1]),b=pn(r[2]); return b!==0?`## 🔢 Hesaplama\n\n**${a} ÷ ${b} = ${ff(a/b)}**`:'## ⚠️ Sıfıra bölme tanımsız!'; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*[\^üssü]\s*(\d+(?:[.,]\d+)?)/); if (r) { const a=pn(r[1]),b=pn(r[2]); return `## 🔢 Hesaplama\n\n**${a}^${b} = ${ff(Math.pow(a,b))}**`; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*\%\s*(\d+(?:[.,]\d+)?)/i) || text.match(/yüzde\s*(\d+(?:[.,]\d+)?)\s*(\d+(?:[.,]\d+)?)/i); if (r) { const a=pn(r[1]),b=pn(r[2]); return `## 🔢 Yüzde Hesaplama\n\n**${b}'nin %${a}'${a>3?"i":"ı"} = ${ff(b*a/100)}**`; }
    r = text.match(/karekök\s*(\d+(?:[.,]\d+)?)/i) || text.match(/√\s*(\d+(?:[.,]\d+)?)/); if (r) { const n=pn(r[1]); return `## 🔢 Karekök\n\n**√${n} = ${ff(Math.sqrt(n))}**`; }
    r = text.match(/(\d+)\s*!/); if (r) { const n=parseInt(r[1]); if(n>20) return '## ⚠️ Çok büyük! (max 20!)'; let f=1; for(let i=2;i<=n;i++) f*=i; return `## 🔢 Faktöriyel\n\n**${n}! = ${f.toLocaleString('tr-TR')}**`; }
    r = text.match(/(\d+(?:[.,]\d+)?)\s*(?:kaç|eder|yapar)/i); // "5 artı 3 kaç" tarzı
    return null;
}
function pn(s) { return parseFloat(s.replace(',','.')); }
function ff(n) { return parseFloat(n.toFixed(10)).toLocaleString('tr-TR'); }

// ===== UTILS =====
function m(text, keywords) { return keywords.some(k => text.includes(k)); }
function p(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ===== MARKDOWN RENDERER =====
function md(text) {
    let h = esc(text);
    h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code class="language-${lang}">${code.trim()}</code><button class="copy-btn" onclick="cc(this)">Kopyala</button></pre>`);
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/^#### (.+)$/gm, '<h4 style="font-size:0.95rem;font-weight:600;margin:12px 0 6px;">$1</h4>');
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm, '<h3 style="font-size:1.05rem;">$1</h3>');
    h = h.replace(/^# (.+)$/gm, '<h3 style="font-size:1.15rem;">$1</h3>');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent-cyan);">$1</a>');
    h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    h = h.replace(/<\/blockquote>\n<blockquote>/g, '<br>');
    // Tables
    const lines = h.split('\n'); let res=[], inT=false, tRows=[];
    for (const line of lines) { const t=line.trim(); if(t.startsWith('|')&&t.endsWith('|')){if(!inT){inT=true;tRows=[];}if(!/^\|[\s\-:|]+\|$/.test(t))tRows.push(t);}else{if(inT){res.push(bldT(tRows));inT=false;}res.push(line);}} if(inT)res.push(bldT(tRows));
    h = res.join('\n');
    h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
    h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    h = h.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border-color);margin:16px 0;">');
    h = h.replace(/\n\n/g, '</p><p>');
    h = h.replace(/\n/g, '<br>');
    h = '<p>' + h + '</p>';
    h = h.replace(/<p><\/p>/g, '');
    h = h.replace(/<p>(<h[34]|<ul|<pre|<blockquote|<hr|<table)/g, '$1');
    h = h.replace(/(<\/h[34]>|<\/ul>|<\/pre>|<\/blockquote>|<\/table>)<\/p>/g, '$1');
    return h;
}
function bldT(rows) { if(!rows.length)return''; let h='<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.875rem;">'; rows.forEach((r,i)=>{const c=r.split('|').filter(x=>x.trim());const tg=i===0?'th':'td';const bg=i===0?'background:rgba(124,58,237,0.1);font-weight:600;':(i%2===0?'background:rgba(255,255,255,0.02);':'');h+='<tr>'+c.map(x=>`<${tg} style="padding:8px 12px;border:1px solid var(--border-color);text-align:left;${bg}">${x.trim()}</${tg}>`).join('')+'</tr>';}); return h+'</table>'; }
window.cc = function(btn) { const c=btn.previousElementSibling||btn.closest('pre').querySelector('code'); if(c)navigator.clipboard.writeText(c.textContent).then(()=>{btn.textContent='Kopyalandı!';setTimeout(()=>btn.textContent='Kopyala',2000);}); };

document.addEventListener('DOMContentLoaded', init);
