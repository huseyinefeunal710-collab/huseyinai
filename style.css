<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="HüseyinAI Ultra Pro Max — Her soruyu yanıtlayan yapay zeka asistanı. ChatGPT alternatifi, ücretsiz ve güçlü.">
    <title>HüseyinAI Ultra Pro Max — Yapay Zeka Asistanı</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Animated Background -->
    <div class="bg-animation">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
    </div>
    <!-- ===== AUTH SCREEN ===== -->
    <div class="auth-screen" id="authScreen">
        <div class="auth-container">
            <div class="auth-logo">
                <div class="auth-logo-icon">
                    <svg viewBox="0 0 80 80" fill="none">
                        <defs>
                            <linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#7c3aed"/>
                                <stop offset="50%" style="stop-color:#06b6d4"/>
                                <stop offset="100%" style="stop-color:#10b981"/>
                            </linearGradient>
                        </defs>
                        <circle cx="40" cy="40" r="35" stroke="url(#authGrad)" stroke-width="2" fill="none" opacity="0.3"/>
                        <circle cx="40" cy="40" r="25" stroke="url(#authGrad)" stroke-width="2" fill="none" opacity="0.5"/>
                        <circle cx="40" cy="40" r="6" fill="url(#authGrad)"/>
                        <path d="M26 40C26 32.268 32.268 26 40 26C47.732 26 54 32.268 54 40" stroke="url(#authGrad)" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M40 46V56" stroke="url(#authGrad)" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="auth-logo-pulse"></div>
            </div>
            <h1 class="auth-title">Hoş Geldiniz <span class="gradient-text">HüseyinAI</span>'ya</h1>
            <p class="auth-subtitle">Ultra Pro Max yapay zeka deneyimine başlayın</p>
            <!-- LOGIN FORM -->
            <form class="auth-form" id="loginForm">
                <div class="auth-form-group">
                    <label for="loginEmail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </label>
                    <input type="email" id="loginEmail" placeholder="E-posta adresiniz" required autocomplete="email">
                </div>
                <div class="auth-form-group">
                    <label for="loginPassword">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </label>
                    <input type="password" id="loginPassword" placeholder="Şifreniz" required autocomplete="current-password">
                    <button type="button" class="toggle-password" data-target="loginPassword" aria-label="Şifreyi göster">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
                <div id="loginError" class="auth-error"></div>
                <button type="submit" class="auth-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                    Giriş Yap
                </button>
            </form>
            <!-- REGISTER FORM -->
            <form class="auth-form" id="registerForm" style="display:none;">
                <div class="auth-form-group">
                    <label for="regName">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </label>
                    <input type="text" id="regName" placeholder="Adınız" required autocomplete="name" minlength="2">
                </div>
                <div class="auth-form-group">
                    <label for="regEmail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </label>
                    <input type="email" id="regEmail" placeholder="E-posta adresiniz" required autocomplete="email">
                </div>
                <div class="auth-form-group">
                    <label for="regPassword">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </label>
                    <input type="password" id="regPassword" placeholder="Şifre (min 6 karakter)" required autocomplete="new-password" minlength="6">
                    <button type="button" class="toggle-password" data-target="regPassword" aria-label="Şifreyi göster">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
                <div class="auth-form-group">
                    <label for="regPasswordConfirm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </label>
                    <input type="password" id="regPasswordConfirm" placeholder="Şifre tekrar" required autocomplete="new-password" minlength="6">
                </div>
                <div id="registerError" class="auth-error"></div>
                <button type="submit" class="auth-btn auth-btn-register">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    Kayıt Ol
                </button>
            </form>
            <div class="auth-switch">
                <span id="authSwitchText">Hesabınız yok mu?</span>
                <button type="button" class="auth-switch-btn" id="authSwitchBtn">Kayıt Ol</button>
            </div>
        </div>
    </div>
    <!-- ===== CHAT APP ===== -->
    <div class="app-container" id="appContainer" style="display:none;">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <div class="logo-icon">
                        <svg viewBox="0 0 40 40" fill="none">
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#7c3aed"/>
                                    <stop offset="50%" style="stop-color:#06b6d4"/>
                                    <stop offset="100%" style="stop-color:#10b981"/>
                                </linearGradient>
                            </defs>
                            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" stroke-width="2.5" fill="none"/>
                            <path d="M13 20C13 16.134 16.134 13 20 13C23.866 13 27 16.134 27 20" stroke="url(#logoGrad)" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="20" cy="20" r="3" fill="url(#logoGrad)"/>
                            <path d="M20 23V28" stroke="url(#logoGrad)" stroke-width="2" stroke-linecap="round"/>
                            <path d="M15 25L17 23" stroke="url(#logoGrad)" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M25 25L23 23" stroke="url(#logoGrad)" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="logo-text">
                        <h1>HüseyinAI</h1>
                        <span class="logo-badge">ULTRA PRO MAX</span>
                    </div>
                </div>
                <button class="sidebar-toggle" id="sidebarToggle" aria-label="Menüyü kapat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
            </div>
            <button class="new-chat-btn" id="newChatBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Yeni Sohbet
            </button>
            <div class="sidebar-section">
                <h3 class="sidebar-section-title">Sohbet Geçmişi</h3>
                <div class="chat-history" id="chatHistory"></div>
            </div>
            <!-- User Profile Footer -->
            <div class="sidebar-footer">
                <div class="user-profile" id="userProfile">
                    <div class="user-avatar" id="userAvatar">H</div>
                    <div class="user-info">
                        <span class="user-name" id="userName">Kullanıcı</span>
                        <span class="user-email" id="userEmail">user@mail.com</span>
                    </div>
                    <button class="logout-btn" id="logoutBtn" title="Çıkış Yap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
        <!-- Main Chat Area -->
        <main class="main-content">
            <header class="top-bar">
                <button class="menu-btn" id="menuBtn" aria-label="Menüyü aç">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                </button>
                <div class="top-bar-title">
                    <h2 id="chatTitle">Yeni Sohbet</h2>
                    <span class="top-bar-subtitle">Ultra Pro Max — Her soruyu yanıtlar 🚀</span>
                </div>
                <div class="top-bar-actions">
                    <button class="icon-btn" id="clearChatBtn" title="Sohbeti temizle">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </header>
            <div class="chat-container" id="chatContainer">
                <div class="chat-messages" id="chatMessages"></div>
            </div>
            <div class="input-area">
                <div class="input-wrapper">
                    <div class="input-container">
                        <textarea id="messageInput" placeholder="Mesajınızı yazın..." rows="1" aria-label="Mesaj giriş alanı"></textarea>
                        <div class="input-actions">
                            <span class="char-count" id="charCount">0</span>
                            <button class="send-btn" id="sendBtn" disabled aria-label="Mesaj gönder">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p class="input-hint">HüseyinAI hata yapabilir. Önemli bilgileri doğrulayın.</p>
                </div>
            </div>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>
