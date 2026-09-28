// ============================================================
// SkillSwap — Interactive Showcase & Landing Controller
// Inspired by editorial showcase presentation philosophy
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // ------------------------------------------------------------
    // 1. MODAL CONTROLLERS & AUTH TRIGGERS
    // ------------------------------------------------------------
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const otpModal = document.getElementById('otpModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const resetPasswordModal = document.getElementById('resetPasswordModal');

    function openModal(el) {
        if (!el) return;
        closeAllModals();
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(el) {
        if (!el) return;
        el.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    // Modal openers
    const signInTriggers = ['signInBtn', 'mobileSignInBtn'];
    signInTriggers.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); closeMobile(); openModal(signInModal); });
    });

    const signUpTriggers = ['getStartedBtn', 'mobileGetStartedBtn', 'heroStartSwapBtn', 'ctaGetStartedBtn', 'heroSimulateBtn'];
    signUpTriggers.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); closeMobile(); openModal(signUpModal); });
    });

    // Delegated trigger for any .open-auth-trigger
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.open-auth-trigger');
        if (trigger) {
            e.preventDefault();
            openModal(signUpModal);
        }
    });

    // Close buttons
    const closePairs = [
        ['closeSignInModal', signInModal],
        ['closeSignUpModal', signUpModal],
        ['closeOtpModal', otpModal],
        ['closeForgotPasswordModal', forgotPasswordModal],
        ['closeResetPasswordModal', resetPasswordModal]
    ];
    closePairs.forEach(([btnId, modalEl]) => {
        const b = document.getElementById(btnId);
        if (b && modalEl) b.addEventListener('click', () => closeModal(modalEl));
    });

    // Switch between auth modals
    const switchToSignUp = document.getElementById('switchToSignUp');
    if (switchToSignUp) switchToSignUp.addEventListener('click', e => { e.preventDefault(); openModal(signUpModal); });

    const switchToSignIn = document.getElementById('switchToSignIn');
    if (switchToSignIn) switchToSignIn.addEventListener('click', e => { e.preventDefault(); openModal(signInModal); });

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', e => { e.preventDefault(); openModal(forgotPasswordModal); });

    const backToSignInLink = document.getElementById('backToSignInLink');
    if (backToSignInLink) backToSignInLink.addEventListener('click', e => { e.preventDefault(); openModal(signInModal); });

    // Backdrop click and ESC key
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Password visibility toggle
    document.addEventListener('click', function (e) {
        const toggle = e.target.closest('.pw-toggle');
        if (!toggle) return;
        const targetId = toggle.getAttribute('data-pw');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggle.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // Resend OTP friendly hint
    const resendOtpLink = document.getElementById('resendOtpLink');
    if (resendOtpLink) {
        resendOtpLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.toast) toast('Please re-enter your details if your code expired — a fresh OTP will be issued.', 'info');
        });
    }

    // ------------------------------------------------------------
    // 2. MOBILE MENU & FLOATING HEADER SCROLL
    // ------------------------------------------------------------
    const headerWrapper = document.getElementById('headerWrapper');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    function closeMobile() {
        if (mobileMenu) mobileMenu.classList.remove('active');
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', closeMobile));

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target)) {
                closeMobile();
            }
        });

        // Close when clicking action buttons
        const actionBtns = mobileMenu.querySelectorAll('.btn');
        actionBtns.forEach(btn => btn.addEventListener('click', closeMobile));
    }

    window.addEventListener('scroll', () => {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        if (headerWrapper) {
            if (y > 40) {
                headerWrapper.classList.add('header-scrolled');
            } else {
                headerWrapper.classList.remove('header-scrolled');
            }
        }
    });

    // ------------------------------------------------------------
    // 3. HERO — CINEMATIC INTERACTIVE SWAP STAGE
    // ------------------------------------------------------------
    const SHOWCASE_PAIRS = [
        {
            teach: "Python 3.12 & ML",
            learn: "UI/UX Design Craft",
            headlineTeach: "Python Logic",
            headlineLearn: "Design Craft",
            desc: "Exchange deep backend engineering for intuitive product design. Connect directly through live WebRTC video, screen share code, and co-design Figma architectures.",
            pill1: "Python & Fast-API",
            pill2: "Figma Tokens",
            pill3: "1:1 Verified Value",
            partnerA: "Elena V.",
            partnerB: "Marcus T.",
            sessions: "18 Sessions Traded",
            avatarA: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
            avatarB: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            nextLabel: "Guitar ⇄ French",
            nextIcon: "fa-guitar",
            quote: "“Two minds, one shared breakthrough. Pure knowledge as currency.”",
            glow1: "rgba(224, 145, 107, 0.28)",
            glow2: "rgba(198, 113, 75, 0.18)"
        },
        {
            teach: "Acoustic & Jazz Guitar",
            learn: "Conversational French",
            headlineTeach: "Guitar Harmonies",
            headlineLearn: "French Fluency",
            desc: "Trade modal jazz fingerpicking and guitar theory for immersion in conversational Parisian French. Experience culture and musical phrasing face-to-face.",
            pill1: "Jazz Fingerstyle",
            pill2: "Parisian Phonetics",
            pill3: "Real-time Acoustic HD",
            partnerA: "Julian M.",
            partnerB: "Sofia R.",
            sessions: "24 Sessions Traded",
            avatarA: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
            avatarB: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            nextLabel: "Photo ⇄ Marketing",
            nextIcon: "fa-camera",
            quote: "“Chords traded for idioms. We made more progress in a month than in two years of apps.”",
            glow1: "rgba(217, 119, 6, 0.26)",
            glow2: "rgba(180, 83, 9, 0.18)"
        },
        {
            teach: "Architectural Photography",
            learn: "Product Growth Strategy",
            headlineTeach: "Lens Geometry",
            headlineLearn: "Growth Strategy",
            desc: "Trade professional perspective control and editorial lighting techniques for funnel conversion modeling and customer acquisition frameworks.",
            pill1: "Leica 35mm Prime",
            pill2: "Product Funnels",
            pill3: "Portfolio Reviews",
            partnerA: "Kenji T.",
            partnerB: "Maya S.",
            sessions: "14 Sessions Traded",
            avatarA: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
            avatarB: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
            nextLabel: "ML ⇄ Classical Piano",
            nextIcon: "fa-brain",
            quote: "“A photographer and a marketer walk into a swap. Both walk out with thriving businesses.”",
            glow1: "rgba(244, 63, 94, 0.24)",
            glow2: "rgba(225, 29, 72, 0.16)"
        },
        {
            teach: "Neural Networks & PyTorch",
            learn: "Classical Piano Solo",
            headlineTeach: "Deep Learning",
            headlineLearn: "Piano Solos",
            desc: "Demystify Transformer architectures and embeddings in return for mastering Chopin nocturnes and classical hand independence at the keyboard.",
            pill1: "PyTorch & CUDA",
            pill2: "Chopin Nocturnes",
            pill3: "Creative Synthesis",
            partnerA: "David K.",
            partnerB: "Amara N.",
            sessions: "21 Sessions Traded",
            avatarA: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
            avatarB: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
            nextLabel: "Python ⇄ UI/UX",
            nextIcon: "fa-laptop-code",
            quote: "“Mathematical logic meets acoustic soul. The best reciprocal learning session ever.”",
            glow1: "rgba(16, 185, 129, 0.24)",
            glow2: "rgba(5, 150, 105, 0.16)"
        }
    ];

    let currentShowcaseIdx = 0;

    function applyShowcase(idx) {
        currentShowcaseIdx = idx;
        const data = SHOWCASE_PAIRS[idx];

        // Narrative update with smooth fade
        const hTeach = document.getElementById('heroTeachSkill');
        const hLearn = document.getElementById('heroLearnSkill');
        const hDesc = document.getElementById('heroNarrativeDesc');
        if (hTeach) hTeach.textContent = data.headlineTeach;
        if (hLearn) hLearn.textContent = data.headlineLearn;
        if (hDesc) hDesc.textContent = data.desc;

        // Floating badges
        const p1 = document.getElementById('floatPill1Text');
        const p2 = document.getElementById('floatPill2Text');
        if (p1) p1.textContent = data.pill1;
        if (p2) p2.textContent = data.pill2;

        // Participants card
        const pNames = document.getElementById('partnerNames');
        const pSessions = document.getElementById('partnerSessions');
        const pAvA = document.getElementById('partnerAvatarA');
        const pAvB = document.getElementById('partnerAvatarB');
        if (pNames) pNames.textContent = `${data.partnerA} & ${data.partnerB}`;
        if (pSessions) pSessions.textContent = data.sessions;
        if (pAvA) pAvA.src = data.avatarA;
        if (pAvB) pAvB.src = data.avatarB;

        // Next thumbnail card
        const nextIdx = (idx + 1) % SHOWCASE_PAIRS.length;
        const nextData = SHOWCASE_PAIRS[nextIdx];
        const nextLabel = document.getElementById('nextThumbLabel');
        const nextIcon = document.getElementById('nextThumbIcon');
        if (nextLabel) nextLabel.textContent = nextData.teach.split('&')[0] + ' ⇄ ' + nextData.learn.split('&')[0];
        if (nextIcon) nextIcon.innerHTML = `<i class="fas ${nextData.nextIcon}"></i>`;

        // Quote & Ambient glow
        const quoteEl = document.getElementById('stageQuoteTagline');
        if (quoteEl) quoteEl.textContent = data.quote;

        const orb1 = document.getElementById('ambientOrbPrimary');
        const orb2 = document.getElementById('ambientOrbSecondary');
        if (orb1) orb1.style.background = `radial-gradient(circle, ${data.glow1}, transparent 70%)`;
        if (orb2) orb2.style.background = `radial-gradient(circle, ${data.glow2}, transparent 70%)`;

        // Active button pill in top bar
        document.querySelectorAll('#heroSkillTabs .stage-cat-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === idx);
        });

        // Proof dots
        document.querySelectorAll('#proofDots .proof-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }

    // Top tab clicks
    document.querySelectorAll('#heroSkillTabs .stage-cat-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = parseInt(this.getAttribute('data-skill-idx'), 10) || 0;
            applyShowcase(idx);
        });
    });

    // Next thumbnail card click
    const nextSwapThumbBtn = document.getElementById('nextSwapThumbBtn');
    if (nextSwapThumbBtn) {
        nextSwapThumbBtn.addEventListener('click', function () {
            const next = (currentShowcaseIdx + 1) % SHOWCASE_PAIRS.length;
            applyShowcase(next);
        });
    }

    // Skill level selector chips
    document.querySelectorAll('#levelChipsGroup .level-chip').forEach(chip => {
        chip.addEventListener('click', function () {
            document.querySelectorAll('#levelChipsGroup .level-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const lvl = this.getAttribute('data-level');
            if (window.toast) toast(`Showcase filtered to ${lvl} level peer exchanges`, 'info');
        });
    });

    // Initial showcase trigger
    applyShowcase(0);

    // ------------------------------------------------------------
    // 4. PRODUCT LABORATORY (INTERACTIVE PREVIEWS)
    // ------------------------------------------------------------
    const labNavPills = document.getElementById('labNavPills');
    const labViewportCard = document.querySelector('.lab-viewport-card');

    if (labNavPills && labViewportCard) {
        const containerWrap = labNavPills.parentElement;

        // Create wrapper and track
        const wrapper = document.createElement('div');
        wrapper.id = 'labMarqueeWrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.width = '100%';
        wrapper.style.position = 'relative';

        const track = document.createElement('div');
        track.id = 'labMarqueeTrack';
        track.style.display = 'inline-flex';
        track.style.flexWrap = 'nowrap';
        track.style.alignItems = 'stretch';

        const featureCardsData = [
            { icon: '<i class="fas fa-video"></i>', title: 'Video Calls', desc: 'Connect face-to-face and learn together in real time.' },
            { icon: '<i class="fas fa-comments"></i>', title: 'Real-Time Chat', desc: 'Message your learning partner and share ideas instantly.' },
            { icon: '<i class="fas fa-circle-nodes"></i>', title: 'Skill Matching', desc: 'Find people who can teach what you want to learn.' },
            { icon: '<i class="fas fa-paperclip"></i>', title: 'File Sharing', desc: 'Share notes, images, and learning resources during your swap.' }
        ];

        featureCardsData.forEach(data => {
            const item = document.createElement('article');
            item.className = 'feature-card lab-marquee-item';
            item.style.flex = '0 0 auto';
            item.style.width = '340px'; 
            item.style.maxWidth = '85vw'; 
            item.style.marginRight = '1.5rem';
            item.style.marginBottom = '0';
            
            item.innerHTML = `
                <span class="feature-ico">${data.icon}</span>
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
            `;
            
            track.appendChild(item);
        });

        // Clone items exactly once for infinite loop
        const items = Array.from(track.children);
        items.forEach(item => {
            track.appendChild(item.cloneNode(true));
        });

        wrapper.appendChild(track);

        // Replace original elements
        containerWrap.insertBefore(wrapper, labNavPills);
        labNavPills.remove();
        labViewportCard.remove();

        // Continuous scrolling logic
        let scrollSpeed = 0.5;
        let isPaused = false;

        function animateScroll() {
            if (!isPaused) {
                wrapper.scrollLeft += scrollSpeed;
                const halfWidth = track.scrollWidth / 2;
                if (wrapper.scrollLeft >= halfWidth) {
                    wrapper.scrollLeft -= halfWidth;
                }
            }
            requestAnimationFrame(animateScroll);
        }

        // Hover/touch to pause and resume
        wrapper.addEventListener('mouseenter', () => isPaused = true);
        wrapper.addEventListener('mouseleave', () => isPaused = false);
        wrapper.addEventListener('touchstart', () => isPaused = true, { passive: true });
        wrapper.addEventListener('touchend', () => isPaused = false);

        requestAnimationFrame(animateScroll);
    }

    // Lab Video interactive dock preview buttons
    const demoMuteBtn = document.getElementById('demoMuteBtn');
    if (demoMuteBtn) {
        demoMuteBtn.addEventListener('click', function () {
            const isMuted = this.classList.toggle('active-control');
            this.innerHTML = isMuted ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash"></i>';
            if (window.toast) toast(isMuted ? 'Microphone live' : 'Microphone muted', 'info');
        });
    }

    const demoCamBtn = document.getElementById('demoCamBtn');
    if (demoCamBtn) {
        demoCamBtn.addEventListener('click', function () {
            this.classList.toggle('active-control');
            if (window.toast) toast('Camera preview toggled', 'info');
        });
    }

    const demoShareBtn = document.getElementById('demoShareBtn');
    if (demoShareBtn) {
        demoShareBtn.addEventListener('click', function () {
            this.classList.toggle('active-control');
            if (window.toast) toast('Screen share mode simulated', 'info');
        });
    }

    const demoEndBtn = document.getElementById('demoEndBtn');
    if (demoEndBtn) {
        demoEndBtn.addEventListener('click', function () {
            if (window.toast) toast('Session completed! Both peers awarded verified swap hours.', 'success');
        });
    }

    // Lab Match Simulator interactive test
    const runSimMatchBtn = document.getElementById('runSimMatchBtn');
    if (runSimMatchBtn) {
        runSimMatchBtn.addEventListener('click', function () {
            const teach = document.getElementById('simTeachSelect')?.value || 'UI/UX';
            const learn = document.getElementById('simLearnSelect')?.value || 'Python';
            const scoreEl = document.getElementById('simScoreText');
            const partnerNameEl = document.getElementById('simPartnerName');
            const partnerTeachesEl = document.getElementById('simPartnerTeaches');
            const partnerWantsEl = document.getElementById('simPartnerWants');

            if (teach === learn) {
                if (scoreEl) scoreEl.textContent = '62%';
                if (partnerNameEl) partnerNameEl.textContent = 'Study Group Peer';
                if (partnerTeachesEl) partnerTeachesEl.textContent = `${teach} (Collaborative Practice)`;
                if (partnerWantsEl) partnerWantsEl.textContent = `${learn} (Same Subject Study)`;
                if (window.toast) toast('Same skill selected: Peer study group mode!', 'info');
            } else {
                const score = 94 + Math.floor(Math.random() * 6);
                if (scoreEl) scoreEl.textContent = `${score}%`;
                if (partnerNameEl) partnerNameEl.textContent = 'Marcus T. (Verified Lead)';
                if (partnerTeachesEl) partnerTeachesEl.textContent = `${learn}, Production Tools`;
                if (partnerWantsEl) partnerWantsEl.textContent = `${teach}, Best Practices`;
                if (window.toast) toast(`High synergy match calculated: ${score}% reciprocal fit!`, 'success');
            }
        });
    }

    // Lab Mock Chat Input test
    const mockInput = document.getElementById('mockInput');
    const mockSendBtn = document.getElementById('mockSendBtn');
    function sendMockMsg() {
        if (!mockInput || !mockInput.value.trim()) return;
        const text = mockInput.value.trim();
        const chatBody = document.querySelector('.mock-chat-body');
        if (chatBody) {
            const newMsg = document.createElement('div');
            newMsg.className = 'mock-msg me';
            newMsg.textContent = text;
            chatBody.appendChild(newMsg);
            mockInput.value = '';
            setTimeout(() => {
                const replyMsg = document.createElement('div');
                replyMsg.className = 'mock-msg them';
                replyMsg.textContent = 'Awesome! Got your message. Jumping in now!';
                chatBody.appendChild(replyMsg);
            }, 700);
        }
    }
    if (mockSendBtn) mockSendBtn.addEventListener('click', sendMockMsg);
    if (mockInput) {
        mockInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') { e.preventDefault(); sendMockMsg(); }
        });
    }

    // ------------------------------------------------------------
    // 5. SKILL MATRIX DOMAIN SWITCHER
    // ------------------------------------------------------------
    const MATRIX_DATA = {
        programming: {
            title: "Programming & Tech",
            count: "420 Active Peers",
            desc: "From algorithmic problem-solving to full-stack production apps, trade software engineering skills for design, language fluency, or executive communication.",
            chips: ["Python 3", "TypeScript", "React & Next.js", "Machine Learning", "SQL & Postgres", "Docker & DevOps"],
            peers: [
                { name: "Elena V.", teaches: "React, Next.js", wants: "UI/UX Wireframing", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" },
                { name: "Marcus T.", teaches: "Python, FastAPI", wants: "French Fluency", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" }
            ]
        },
        design: {
            title: "Design & Creative",
            count: "310 Active Peers",
            desc: "Master typography, spatial layouts, design tokens, and design thinking by trading directly with working product designers and art directors.",
            chips: ["UI/UX Architecture", "Figma Design Systems", "3D Blender", "Motion Graphics", "Branding & Identity", "Design Thinking"],
            peers: [
                { name: "Chloe B.", teaches: "Figma Tokens, Design Systems", wants: "Rust Backend", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" },
                { name: "Julian M.", teaches: "Blender 3D Modeling", wants: "SEO Strategy", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" }
            ]
        },
        music: {
            title: "Music & Audio Arts",
            count: "190 Active Peers",
            desc: "Unlock chord theory, acoustic technique, electronic sound design, and vocal control through 1-on-1 reciprocal jam sessions.",
            chips: ["Acoustic Guitar", "Jazz Piano", "Vocal Coaching", "Ableton Live", "Music Theory", "Audio Mixing"],
            peers: [
                { name: "Julian M.", teaches: "Jazz Guitar Improvisation", wants: "French Fluency", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" },
                { name: "Amara N.", teaches: "Classical Piano Solo", wants: "Python & ML", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80" }
            ]
        },
        photography: {
            title: "Photography & Video",
            count: "140 Active Peers",
            desc: "Refine perspective composition, lighting setups, color grading in DaVinci Resolve, and editorial photography techniques.",
            chips: ["Architectural Photography", "Portrait Lighting", "Color Grading", "DaVinci Resolve", "Street Photography", "Visual Storytelling"],
            peers: [
                { name: "Kenji T.", teaches: "Architectural Perspective", wants: "Brand Positioning", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80" },
                { name: "Lucas H.", teaches: "DaVinci Video Editing", wants: "Piano Chords", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" }
            ]
        },
        languages: {
            title: "World Languages",
            count: "260 Active Peers",
            desc: "Trade natural conversation with native speakers worldwide. Perfect your accent, idioms, and cultural fluency.",
            chips: ["Conversational Spanish", "Parisian French", "Business English", "German A1-C1", "Japanese Kanji", "Italian for Travel"],
            peers: [
                { name: "Sofia R.", teaches: "Conversational French", wants: "Acoustic Guitar", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
                { name: "Mateo G.", teaches: "Latin American Spanish", wants: "Data Analytics", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" }
            ]
        },
        business: {
            title: "Business & Growth",
            count: "180 Active Peers",
            desc: "Connect with entrepreneurs and strategists to swap pitch decks, SEO funnels, product management frameworks, and leadership coaching.",
            chips: ["Product Strategy", "B2B Sales", "Pitch Deck Design", "SEO & Content", "Financial Modeling", "Public Speaking"],
            peers: [
                { name: "Sarah J.", teaches: "Brand Strategy & Copywriting", wants: "React APIs", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" },
                { name: "Maya S.", teaches: "Growth & Retention Funnels", wants: "Photography", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" }
            ]
        }
    };

    document.querySelectorAll('#matrixCategoryList .matrix-cat-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('#matrixCategoryList .matrix-cat-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const catKey = this.getAttribute('data-cat');
            const d = MATRIX_DATA[catKey];
            if (!d) return;

            const mTitle = document.getElementById('matrixTitle');
            const mCount = document.getElementById('matrixActiveCount');
            const mDesc = document.getElementById('matrixDesc');
            const mChips = document.getElementById('matrixChips');
            const mPeers = document.getElementById('matrixSamplePeers');

            if (mTitle) mTitle.textContent = d.title;
            if (mCount) mCount.textContent = d.count;
            if (mDesc) mDesc.textContent = d.desc;
            if (mChips) {
                mChips.innerHTML = d.chips.map(c => `<span class="matrix-skill-chip">${c}</span>`).join('');
            }
            if (mPeers) {
                mPeers.innerHTML = d.peers.map(p => `
                    <div class="sample-peer-row">
                      <div class="sample-peer-info">
                        <img src="${p.img}" alt="${p.name}">
                        <div>
                          <strong style="color:var(--text-strong); font-size:0.88rem;">${p.name}</strong>
                          <div class="sample-peer-skills">Teaches: ${p.teaches} • Wants: ${p.wants}</div>
                        </div>
                      </div>
                      <button class="btn btn-outline-primary btn-sm open-auth-trigger">Connect</button>
                    </div>
                `).join('');
            }
        });
    });

});

// ============================================================
// BACKEND API CONFIGURATION & AUTH HANDLERS (PRESERVED)
// ============================================================


document.addEventListener('DOMContentLoaded', function () {

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // ---- Inline field-error helpers (clear, per-field messages) ----
    function setFieldError(inputId, errorId, msg) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errorId);
        if (input) input.classList.add('invalid');
        if (err) { err.textContent = msg; err.style.display = 'block'; }
    }
    function clearFieldError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errorId);
        if (input) input.classList.remove('invalid');
        if (err) { err.textContent = ''; err.style.display = 'none'; }
    }
    // Clear a field's error as soon as the user edits it
    ['signupEmail:signupEmailError', 'signupPhone:signupPhoneError',
        'signupPassword:signupPasswordError', 'signupConfirmPassword:signupConfirmPasswordError',
        'loginEmail:loginEmailError', 'loginPassword:loginPasswordError',
        'resetNewPassword:resetNewPasswordError', 'resetConfirmPassword:resetConfirmPasswordError'].forEach(pair => {
            const [i, e] = pair.split(':');
            const el = document.getElementById(i);
            if (el) el.addEventListener('input', () => clearFieldError(i, e));
        });


    // ========================================================
    // SIGNUP
    // ========================================================

    async function handleSignup(event) {
        event.preventDefault();

        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword =
            document.getElementById('signupConfirmPassword').value;
        const phoneNumber =
            document.getElementById('signupPhone').value.trim();

        // Clear old errors
        clearFieldError('signupEmail', 'signupEmailError');
        clearFieldError('signupPhone', 'signupPhoneError');
        clearFieldError('signupPassword', 'signupPasswordError');
        clearFieldError('signupConfirmPassword', 'signupConfirmPasswordError');

        // ---- Validate each field with a specific reason ----
        let valid = true;
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setFieldError('signupEmail', 'signupEmailError', 'Email is required.'); valid = false;
        } else if (!emailRe.test(email)) {
            setFieldError('signupEmail', 'signupEmailError', 'Enter a valid email address.'); valid = false;
        } else if (!/@(gmail\.com|rguktong\.ac\.in)$/i.test(email)) {
            setFieldError('signupEmail', 'signupEmailError', 'Use a gmail.com or rguktong.ac.in email.'); valid = false;
        }

        if (!phoneNumber) {
            setFieldError('signupPhone', 'signupPhoneError', 'Phone number is required.'); valid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            setFieldError('signupPhone', 'signupPhoneError', 'Phone number must be exactly 10 digits.'); valid = false;
        }

        if (!password) {
            setFieldError('signupPassword', 'signupPasswordError', 'Password is required.'); valid = false;
        } else if (password.length < 6) {
            setFieldError('signupPassword', 'signupPasswordError', 'Password must be at least 6 characters.'); valid = false;
        }

        if (!confirmPassword) {
            setFieldError('signupConfirmPassword', 'signupConfirmPasswordError', 'Please re-enter your password.'); valid = false;
        } else if (password !== confirmPassword) {
            setFieldError('signupConfirmPassword', 'signupConfirmPasswordError', 'Passwords do not match.'); valid = false;
        }

        if (!valid) {
            toast('Please fix the highlighted fields.', 'warning');
            return;
        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/auth/signup`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password,
                        phoneNumber
                    })
                }
            );


            // Safely read JSON response
            const text = await response.text();

            let data = {};

            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    console.error(
                        'Signup response was not valid JSON:',
                        text
                    );
                }
            }


            if (response.ok) {

                toast(
                    data.msg ||
                    'OTP has been sent to your email.'
                );


                // Store email for OTP verification
                sessionStorage.setItem(
                    'verificationEmail',
                    email
                );


                // Close signup modal
                const signUpModal =
                    document.getElementById('signUpModal');

                if (signUpModal) {
                    signUpModal.classList.remove('active');
                }


                // Open OTP modal
                const otpModal =
                    document.getElementById('otpModal');

                if (otpModal) {
                    otpModal.classList.add('active');
                }

            } else {

                let msg = data.msg;
                if (!msg) {
                    if (response.status >= 500) {
                        msg = 'Server error — the database or email service may be unavailable. Please try again shortly.';
                    } else if (response.status === 400) {
                        msg = 'An account with this email already exists. Try signing in instead.';
                    } else {
                        msg = 'Signup failed. Please try again.';
                    }
                }
                toast(msg, 'error');
            }

        } catch (error) {

            console.error(
                'Error during signup:',
                error
            );

            toast('Cannot connect to the server. Please make sure the backend is running.', 'error');
        }
    }


    // ========================================================
    // OTP VERIFICATION
    // ========================================================

    async function handleOtpVerification(event) {

        event.preventDefault();


        const otp =
            document.getElementById('otpInput').value.trim();

        const email =
            sessionStorage.getItem('verificationEmail');


        // Check email
        if (!email) {

            toast('Something went wrong. Please sign up again.', 'error');

            return;
        }


        // Check OTP
        if (!otp) {

            toast('Please enter the code.', 'warning');

            return;
        }


        try {

            console.log(
                'Verifying OTP for:',
                email
            );


            const response = await fetch(
                `${API_BASE_URL}/api/auth/verify-otp`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );


            // Safely read response
            const text = await response.text();

            let data = {};

            if (text) {

                try {

                    data = JSON.parse(text);

                } catch (jsonError) {

                    console.error(
                        'OTP response was not valid JSON:',
                        text
                    );
                }
            }


            console.log(
                'OTP verification response:',
                response.status,
                data
            );


            if (response.ok) {

                // Store JWT
                if (data.token) {

                    localStorage.setItem(
                        'token',
                        data.token
                    );
                }


                // Store user ID if backend sends it
                if (data.user && data.user._id) {

                    localStorage.setItem(
                        'userId',
                        data.user._id
                    );
                }


                // Store full name if available
                if (
                    data.user &&
                    data.user.profile &&
                    data.user.profile.fullName
                ) {

                    localStorage.setItem(
                        'fullName',
                        data.user.profile.fullName
                    );
                }


                // Remove temporary email
                sessionStorage.removeItem(
                    'verificationEmail'
                );


                toast(
                    data.msg ||
                    'Account created successfully!'
                );


                // Redirect to profile setup
                window.location.href =
                    'profile-1.html';

            } else {

                toast(
                    data.msg ||
                    'OTP verification failed.'
                );
            }

        } catch (error) {

            console.error(
                'Error during OTP verification:',
                error
            );

            toast('Cannot connect to the server. Please try again.', 'error');
        }
    }


    // ========================================================
    // LOGIN
    // ========================================================

    async function handleLogin(event) {

        event.preventDefault();


        const email =
            document.getElementById('loginEmail').value.trim();

        const password =
            document.getElementById('loginPassword').value;


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/auth/signin`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const text = await response.text();

            let data = {};

            if (text) {

                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    console.error(
                        'Login response was not valid JSON:',
                        text
                    );
                }
            }


            if (response.ok) {

                // Save JWT
                if (data.token) {

                    localStorage.setItem(
                        'token',
                        data.token
                    );
                }


                // Save user ID
                if (data.user && data.user._id) {

                    localStorage.setItem(
                        'userId',
                        data.user._id
                    );
                }


                // Save full name
                if (
                    data.user &&
                    data.user.profile &&
                    data.user.profile.fullName
                ) {

                    localStorage.setItem(
                        'fullName',
                        data.user.profile.fullName
                    );
                }


                // Decode JWT if parseJwt exists
                if (
                    typeof parseJwt === 'function' &&
                    data.token
                ) {

                    const payload =
                        parseJwt(data.token);

                    console.log(
                        'TOKEN PAYLOAD:',
                        payload
                    );


                    if (
                        payload &&
                        payload.user &&
                        payload.user.role === 'admin'
                    ) {

                        window.location.href =
                            'admin.html';

                    } else {

                        window.location.href =
                            'homepage.html';
                    }

                } else {

                    window.location.href =
                        'homepage.html';
                }

            } else {

                // Backend returns a deliberately generic message (anti email-enumeration).
                // We keep it secure but nudge the user toward creating an account.
                const m = data.msg || 'Invalid email or password.';
                const le = document.getElementById('loginEmail');
                if (le) le.classList.add('invalid');
                setFieldError('loginPassword', 'loginPasswordError', m);
                toast("We couldn't sign you in. If you don't have an account yet, create one below.", 'error');
            }

        } catch (error) {

            console.error(
                'Error during login:',
                error
            );

            toast('Cannot connect to the server. Please try again.', 'error');
        }
    }


    // ========================================================
    // FORGOT PASSWORD
    // ========================================================

    const signInModal =
        document.getElementById('signInModal');

    const forgotPasswordModal =
        document.getElementById('forgotPasswordModal');

    const resetPasswordModal =
        document.getElementById('resetPasswordModal');


    const forgotPasswordLink =
        document.getElementById('forgotPasswordLink');


    if (forgotPasswordLink) {

        forgotPasswordLink.addEventListener(
            'click',
            (event) => {

                event.preventDefault();

                if (signInModal) {
                    signInModal.classList.remove('active');
                }

                if (forgotPasswordModal) {
                    forgotPasswordModal.classList.add('active');
                }
            }
        );
    }


    // ========================================================
    // BACK TO SIGN IN
    // ========================================================

    const backToSignInLink =
        document.getElementById('backToSignInLink');


    if (backToSignInLink) {

        backToSignInLink.addEventListener(
            'click',
            (event) => {

                event.preventDefault();

                if (forgotPasswordModal) {
                    forgotPasswordModal.classList.remove('active');
                }

                if (signInModal) {
                    signInModal.classList.add('active');
                }
            }
        );
    }


    // ========================================================
    // SEND PASSWORD RESET OTP
    // ========================================================

    const forgotPasswordForm =
        document.getElementById('forgotPasswordForm');


    if (forgotPasswordForm) {

        forgotPasswordForm.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();


                const email =
                    document
                        .getElementById('forgotPasswordEmail')
                        .value
                        .trim();


                try {

                    const response = await fetch(
                        `${API_BASE_URL}/api/auth/forgot-password`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                email
                            })
                        }
                    );


                    const text =
                        await response.text();

                    let data = {};

                    if (text) {

                        try {
                            data = JSON.parse(text);
                        } catch (jsonError) {
                            console.error(
                                'Forgot password response was not JSON:',
                                text
                            );
                        }
                    }


                    if (response.ok) {

                        // Backend confirmed the account exists and sent the OTP.
                        toast(
                            data.msg ||
                            'OTP has been sent to your email.',
                            'success'
                        );


                        // Use the email exactly as stored on the account
                        // (the server may correct capitalization).
                        sessionStorage.setItem(
                            'resetEmail',
                            data.email || email
                        );


                        if (forgotPasswordModal) {
                            forgotPasswordModal.classList.remove(
                                'active'
                            );
                        }


                        if (resetPasswordModal) {
                            resetPasswordModal.classList.add(
                                'active'
                            );
                        }

                    } else {

                        // No account with this email (or another error):
                        // stay on Forgot Password. No OTP step is opened.
                        toast(
                            data.msg ||
                            'Something went wrong. Please try again.',
                            'error',
                            data.code === 'ACCOUNT_NOT_FOUND'
                                ? { title: 'Account not found' }
                                : undefined
                        );
                    }

                } catch (error) {

                    console.error(
                        'Forgot password error:',
                        error
                    );

                    toast('Cannot connect to the server. Please try again.', 'error');
                }
            }
        );
    }


    // ========================================================
    // RESET PASSWORD
    // ========================================================

    const resetPasswordForm =
        document.getElementById('resetPasswordForm');


    if (resetPasswordForm) {

        resetPasswordForm.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();


                const otp =
                    document
                        .getElementById('resetOtpInput')
                        .value
                        .trim();


                const newPassword =
                    document
                        .getElementById('resetNewPassword')
                        .value;

                const confirmPassword =
                    document
                        .getElementById('resetConfirmPassword')
                        .value;

                clearFieldError('resetNewPassword', 'resetNewPasswordError');
                clearFieldError('resetConfirmPassword', 'resetConfirmPasswordError');

                let resetValid = true;
                if (!newPassword || newPassword.length < 6) {
                    setFieldError('resetNewPassword', 'resetNewPasswordError', 'Password must be at least 6 characters.');
                    resetValid = false;
                }
                if (!confirmPassword) {
                    setFieldError('resetConfirmPassword', 'resetConfirmPasswordError', 'Please re-enter your new password.');
                    resetValid = false;
                } else if (newPassword !== confirmPassword) {
                    setFieldError('resetConfirmPassword', 'resetConfirmPasswordError', 'Passwords do not match.');
                    const cp = document.getElementById('resetConfirmPassword');
                    if (cp) { cp.classList.add('shake'); setTimeout(() => cp.classList.remove('shake'), 450); }
                    resetValid = false;
                }
                if (!resetValid) return;

                const email =
                    sessionStorage.getItem(
                        'resetEmail'
                    );


                if (!email) {

                    toast('Session expired. Please restart the reset process.', 'error');

                    return;
                }


                try {

                    const response = await fetch(
                        `${API_BASE_URL}/api/auth/reset-password`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                email,
                                otp,
                                newPassword
                            })
                        }
                    );


                    const text =
                        await response.text();

                    let data = {};

                    if (text) {

                        try {
                            data = JSON.parse(text);
                        } catch (jsonError) {
                            console.error(
                                'Reset password response was not JSON:',
                                text
                            );
                        }
                    }


                    if (response.ok) {

                        if (data.token) {

                            localStorage.setItem(
                                'token',
                                data.token
                            );
                        }


                        sessionStorage.removeItem(
                            'resetEmail'
                        );


                        toast(
                            data.msg ||
                            'Password reset successfully!'
                        );


                        window.location.href =
                            'homepage.html';

                    } else {

                        toast(
                            data.msg ||
                            'Invalid or expired OTP.'
                        );
                    }

                } catch (error) {

                    console.error(
                        'Reset password error:',
                        error
                    );

                    toast('Cannot connect to the server. Please try again.', 'error');
                }
            }
        );
    }


    // ========================================================
    // OTP FORM EVENT
    // ========================================================

    const otpForm =
        document.getElementById('otpForm');


    if (otpForm) {

        otpForm.addEventListener(
            'submit',
            handleOtpVerification
        );
    }


    // ========================================================
    // CLOSE OTP MODAL
    // ========================================================

    const closeOtpModalBtn =
        document.getElementById('closeOtpModal');


    if (closeOtpModalBtn) {

        closeOtpModalBtn.addEventListener(
            'click',
            function () {

                const otpModal =
                    document.getElementById('otpModal');

                if (otpModal) {
                    otpModal.classList.remove('active');
                }
            }
        );
    }


    // ========================================================
    // CLOSE FORGOT PASSWORD MODAL
    // ========================================================

    const closeForgotPasswordModal =
        document.getElementById(
            'closeForgotPasswordModal'
        );


    if (closeForgotPasswordModal) {

        closeForgotPasswordModal.addEventListener(
            'click',
            () => {

                if (forgotPasswordModal) {
                    forgotPasswordModal.classList.remove(
                        'active'
                    );
                }
            }
        );
    }


    // ========================================================
    // CLOSE RESET PASSWORD MODAL
    // ========================================================

    const closeResetPasswordModal =
        document.getElementById(
            'closeResetPasswordModal'
        );


    if (closeResetPasswordModal) {

        closeResetPasswordModal.addEventListener(
            'click',
            () => {

                if (resetPasswordModal) {
                    resetPasswordModal.classList.remove(
                        'active'
                    );
                }
            }
        );
    }


    // ========================================================
    // FORM EVENT LISTENERS
    // ========================================================

    if (signupForm) {

        signupForm.addEventListener(
            'submit',
            handleSignup
        );
    }


    if (loginForm) {

        loginForm.addEventListener(
            'submit',
            handleLogin
        );
    }

});

// Enhanced error handling
window.addEventListener('error', function (event) {
    console.error('JavaScript error:', event.error);
    // In a real application, you might want to send this to an error tracking service
});

// Console welcome message
console.log('%c🚀 Welcome to Skill Swap!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cThis is a demo version converted from React to vanilla HTML/CSS/JS', 'color: #64748b; font-size: 12px;');
/* ============================================================
   LANDING: Contact form (frontend-only) + FAQ accordion polish
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    // ---- FAQ: single-open accordion ----
    var faqItems = document.querySelectorAll('.faq-list .faq-item');
    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (item.open) {
                faqItems.forEach(function (other) {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    // ---- Contact form ----
    var form = document.getElementById('contactForm');
    if (!form) return;
    var nameEl = document.getElementById('contactName');
    var emailEl = document.getElementById('contactEmail');
    var msgEl = document.getElementById('contactMessage');
    var btn = document.getElementById('contactSubmitBtn');
    var success = document.getElementById('contactSuccess');

    function setErr(id, text) {
        var el = document.getElementById(id);
        if (el) { el.textContent = text || ''; el.style.display = text ? 'block' : 'none'; }
        var input = document.getElementById(id.replace('Error', ''));
        if (input) input.classList.toggle('is-invalid', !!text);
    }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        setErr('contactNameError', ''); setErr('contactEmailError', ''); setErr('contactMessageError', '');

        if (!nameEl.value.trim()) { setErr('contactNameError', 'Please enter your name.'); ok = false; }
        if (!emailEl.value.trim()) { setErr('contactEmailError', 'Please enter your email.'); ok = false; }
        else if (!validEmail(emailEl.value.trim())) { setErr('contactEmailError', 'Enter a valid email address.'); ok = false; }
        if (!msgEl.value.trim()) { setErr('contactMessageError', 'Please enter a message.'); ok = false; }
        else if (msgEl.value.trim().length < 10) { setErr('contactMessageError', 'Message should be at least 10 characters.'); ok = false; }

        if (!ok) return;

        // Loading state
        btn.disabled = true;
        var label = btn.querySelector('.btn-label');
        var prev = label ? label.textContent : btn.textContent;
        if (label) label.innerHTML = '<span class="ss-spinner" style="width:16px;height:16px;vertical-align:-3px;"></span> Sending...';
        else btn.textContent = 'Sending...';

        // Frontend-only: no backend contact endpoint by design.
        setTimeout(function () {
            form.querySelectorAll('.form-group').forEach(function (g) { g.style.display = 'none'; });
            btn.style.display = 'none';
            if (success) success.hidden = false;
            if (window.toast) toast('Thanks! My team will get back to you soon.', 'success');
        }, 900);
    });
});