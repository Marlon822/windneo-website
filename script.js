/**
 * WindNeo - 奢华摇表器保险柜品牌网站
 * 交互动效：克制动效 + Scroll-driven淡入 + 数字滚动
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============ 页面加载 ============
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 600);
    });
    // 备用：2秒后强制隐藏
    setTimeout(() => {
        pageLoader.classList.add('hidden');
    }, 2000);

    // ============ 导航栏滚动效果 ============
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const handleNavbarScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ============ 导航栏活跃链接高亮 ============
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ============ 移动端汉堡菜单 ============
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMobileMenu = () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ============ Scroll-driven 淡入动画 ============
    // 触发条件：元素进入视口20%时开始
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // 一旦动画触发后不再监听
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // ============ 数字滚动动画 ============
    // 时长1.5秒，缓动函数ease-out
    const numberObserverOptions = {
        root: null,
        threshold: 0.5
    };

    const animateNumber = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5秒
        const startTime = performance.now();

        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const current = Math.floor(easedProgress * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                el.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateNumber);
    };

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberEls = entry.target.querySelectorAll('.trust-stat-number[data-target]');
                numberEls.forEach((el, index) => {
                    // 交错延迟：每项间隔100ms
                    setTimeout(() => animateNumber(el), index * 100);
                });
                numberObserver.unobserve(entry.target);
            }
        });
    }, numberObserverOptions);

    const trustStats = document.querySelector('.trust-stats');
    if (trustStats) {
        numberObserver.observe(trustStats);
    }

    // ============ 图片懒加载淡入 ============
    // 为所有懒加载图片添加加载完成后的淡入效果
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 400ms ease-out';

        if (img.complete) {
            img.style.opacity = '';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '';
            });
        }
    });

    // ============ 咨询表单提交 ============
    const consultationForm = document.getElementById('consultationForm');
    const formSubmitBtn = document.getElementById('formSubmit');
    const formSuccess = document.getElementById('formSuccess');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitText = formSubmitBtn.querySelector('.form-submit-text');
            const submitLoading = formSubmitBtn.querySelector('.form-submit-loading');

            // 显示loading
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline-flex';
            formSubmitBtn.disabled = true;

            // 模拟提交（实际项目中替换为真实API调用）
            setTimeout(() => {
                consultationForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }, 1500);
        });
    }

    // ============ 平滑滚动（导航链接） ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // 导航栏高度
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ Collector Stories 文案自动轮播 ============
    (function () {
        const texts = Array.from(document.querySelectorAll('.story-text'));
        const wrap  = document.querySelector('.stories-text-wrap');
        if (texts.length === 0 || !wrap) return;

        let currentIdx = 0;
        const TOTAL = texts.length;

        // 动态设置容器高度，防止切换时抖动
        function setWrapHeight(el) {
            wrap.style.height = el.scrollHeight + 'px';
        }

        function showText(idx) {
            texts.forEach(t => t.classList.remove('active'));
            const target = texts.find(t => parseInt(t.dataset.index) === idx);
            if (target) {
                setTimeout(() => {
                    target.classList.add('active');
                    setWrapHeight(target);
                }, 100);
            }
        }

        function nextText() {
            currentIdx = (currentIdx + 1) % TOTAL;
            showText(currentIdx);
        }

        // 初始显示第一条并设定容器高度
        showText(0);

        // 自动轮播（每 5 秒）
        let timer = setInterval(nextText, 5000);

        // 鼠标悬停暂停
        wrap.addEventListener('mouseenter', () => clearInterval(timer));
        wrap.addEventListener('mouseleave', () => {
            timer = setInterval(nextText, 5000);
        });
    })();

    // ============ 地图连线动画 + 悬浮图片交互 ============
    (function () {
        const canvas = document.querySelector('.map-connections-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // 13个高亮点的SVG坐标 (viewBox: 0 0 1440 720)
        const highlightedDots = {
            3:  { cx: 262,  cy: 118, label: 'Canada' },
            1:  { cx: 272,  cy: 210, label: 'USA' },
            18: { cx: 228,  cy: 288, label: 'Mexico' },
            14: { cx: 295,  cy: 490, label: 'Argentina' },
            8:  { cx: 678,  cy: 340, label: 'South Africa' },
            10: { cx: 695,  cy: 72,  label: 'Sweden' },
            7:  { cx: 670,  cy: 160, label: 'France' },
            4:  { cx: 1228, cy: 155, label: 'Japan' },
            9:  { cx: 1095, cy: 175, label: 'China' },
            21: { cx: 1072, cy: 282, label: 'India' },
            17: { cx: 1125, cy: 278, label: 'Thailand' },
            20: { cx: 1142, cy: 322, label: 'Malaysia' },
            5:  { cx: 1260, cy: 440, label: 'Australia' }
        };

        // 每个国家对应的客户评价数据
        const dotReviews = {
            3:  { tag: 'Private Collection', quote: '"WindNeo is not just a safe — it\'s a palace for every timepiece in my collection. Every time I open the door, I feel a sense of ceremony."', name: 'James C.', location: 'Toronto · 15-Year Collector' },
            1:  { tag: 'Corporate Gift', quote: '"As a corporate gift for valued clients, WindNeo\'s quality left every recipient in awe. It\'s a gift that truly conveys sincerity and taste."', name: 'Sarah M.', location: 'New York · CEO' },
            18: { tag: 'Boutique Retail', quote: '"We display WindNeo pieces in-store alongside our timepieces. Customers ask about them as often as they ask about the watches."', name: 'Olivier M.', location: 'Mexico City · Boutique Owner' },
            14: { tag: 'Heritage Gift', quote: '"I gave a WindNeo to my son on his 30th birthday alongside his first Patek Philippe. Both are heirlooms now."', name: 'David H.', location: 'Buenos Aires · Watch Enthusiast' },
            8:  { tag: 'Watch Club', quote: '"Our club commissioned a series of WindNeo pieces for our top members. The quality and exclusivity elevated our prestige overnight."', name: 'Michael K.', location: 'Cape Town · Watch Club President' },
            10: { tag: 'Bespoke Commission', quote: '"The engraved plate bearing my family crest — every detail was executed exactly as I envisioned. A truly bespoke experience from start to finish."', name: 'Laurent B.', location: 'Stockholm · Horological Collector' },
            7:  { tag: 'Yacht Life', quote: '"Taking my Voyage around the world — no matter where I am, my watches stay perfectly wound. WindNeo truly understands the traveler\'s needs."', name: 'Robert T.', location: 'Paris · Yacht Owner' },
            4:  { tag: 'Art Edition', quote: '"The Sculpture edition is displayed open in my gallery. Guests always think it\'s an artwork — until they see it wind my watches."', name: 'Yuki T.', location: 'Tokyo · Art Collector' },
            9:  { tag: 'Executive Collection', quote: '"The Heritage model holds my 24-watch collection with grace. Biometric access, silent motors — engineering that matches the watches inside."', name: 'Chen W.', location: 'Shanghai · C-Suite Collector' },
            21: { tag: 'Royal Commission', quote: '"WindNeo was the only brand I considered for our estate. The craftsmanship speaks a language that only the finest collectors understand."', name: 'Lord E. S.', location: 'Mumbai · Estate Collector' },
            17: { tag: 'Travel Companion', quote: '"The Voyage model has been to 40 countries with me. Carbon fiber, featherlight, and my watches arrive wound and ready every time."', name: 'Ahmed Al-F.', location: 'Bangkok · Global Traveler' },
            20: { tag: 'Anniversary Edition', quote: '"For our 25th anniversary, WindNeo crafted a dual-winder with both our initials inlaid. It sits at the heart of our home."', name: 'Thomas & Claire R.', location: 'Kuala Lumpur · Couple Collectors' },
            5:  { tag: 'Private Residence', quote: '"My architect incorporated the WindNeo Imperial into the study design. It\'s as much a piece of furniture as it is a safe."', name: 'Elena V.', location: 'Sydney · Interior Collector' }
        };

        // 连线对（相邻/逻辑关联的点）
        const connections = [
            [3, 1], [1, 18], [1, 14],          // 北美链
            [10, 7], [7, 8],                    // 欧洲-非洲
            [9, 4], [9, 21], [21, 17], [17, 20], [20, 5],  // 亚洲链
            [1, 7], [7, 9],                     // 跨洲连接
            [8, 21],                            // 非洲-亚洲
        ];

        let animStarted = false;
        let raf;
        const particles = [];
        const PARTICLE_SPEED = 0.0015;

        // 将SVG坐标转换为Canvas像素坐标
        function svgToCanvas(svgX, svgY) {
            const svg = document.querySelector('.world-map-svg');
            if (!svg) return { x: 0, y: 0 };
            const rect = svg.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            // SVG使用meet模式，计算实际缩放
            const scaleX = rect.width / 1440;
            const scaleY = rect.height / 720;
            const scale = Math.min(scaleX, scaleY);
            const offsetX = (rect.width - 1440 * scale) / 2;
            const offsetY = (rect.height - 720 * scale) / 2;
            return {
                x: (svgX * scale + offsetX + (rect.left - canvasRect.left)),
                y: (svgY * scale + offsetY + (rect.top - canvasRect.top))
            };
        }

        // 初始化粒子
        function initParticles() {
            particles.length = 0;
            connections.forEach(function (conn) {
                var fromDot = highlightedDots[conn[0]];
                var toDot = highlightedDots[conn[1]];
                if (!fromDot || !toDot) return;
                particles.push({
                    from: conn[0],
                    to: conn[1],
                    progress: Math.random(),
                    speed: PARTICLE_SPEED + Math.random() * 0.001
                });
            });
        }

        // 调整Canvas尺寸
        function resizeCanvas() {
            var section = canvas.closest('.cases-section');
            if (!section) return;
            var dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // 绘制一帧
        function draw() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // 绘制连线（底层弧线）
            connections.forEach(function (conn) {
                var fromPt = svgToCanvas(highlightedDots[conn[0]].cx, highlightedDots[conn[0]].cy);
                var toPt = svgToCanvas(highlightedDots[conn[1]].cx, highlightedDots[conn[1]].cy);
                var mx = (fromPt.x + toPt.x) / 2;
                var my = (fromPt.y + toPt.y) / 2 - 30;

                ctx.beginPath();
                ctx.moveTo(fromPt.x, fromPt.y);
                ctx.quadraticCurveTo(mx, my, toPt.x, toPt.y);
                ctx.strokeStyle = 'rgba(201, 169, 97, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // 绘制移动粒子
            particles.forEach(function (p) {
                p.progress += p.speed;
                if (p.progress > 1) p.progress -= 1;

                var fromPt = svgToCanvas(highlightedDots[p.from].cx, highlightedDots[p.from].cy);
                var toPt = svgToCanvas(highlightedDots[p.to].cx, highlightedDots[p.to].cy);
                var mx = (fromPt.x + toPt.x) / 2;
                var my = (fromPt.y + toPt.y) / 2 - 30;

                var t = p.progress;
                var x = (1 - t) * (1 - t) * fromPt.x + 2 * (1 - t) * t * mx + t * t * toPt.x;
                var y = (1 - t) * (1 - t) * fromPt.y + 2 * (1 - t) * t * my + t * t * toPt.y;

                // 发光粒子
                var grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
                grad.addColorStop(0, 'rgba(201, 169, 97, 0.9)');
                grad.addColorStop(0.5, 'rgba(201, 169, 97, 0.3)');
                grad.addColorStop(1, 'rgba(201, 169, 97, 0)');
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // 核心亮点
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 241, 237, 0.95)';
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        }

        // IntersectionObserver：进入视口后启动动画
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animStarted) {
                    animStarted = true;
                    canvas.classList.add('visible');
                    resizeCanvas();
                    initParticles();
                    draw();
                }
            });
        }, { threshold: 0.15 });
        observer.observe(canvas);

        // ---- 圆形缩略图定位 + 点击Lightbox ----
        var thumbContainer = document.querySelector('.map-thumb-container');
        var thumbs = document.querySelectorAll('.map-thumb');
        var thumbLabels = document.querySelectorAll('.map-thumb-label');
        var lightbox = document.getElementById('mapLightbox');
        var lightboxImg = document.getElementById('lightboxImg');
        var lightboxCountry = document.getElementById('lightboxCountry');
        var lightboxTag = document.getElementById('lightboxTag');
        var lightboxQuote = document.getElementById('lightboxQuote');
        var lightboxName = document.getElementById('lightboxName');
        var lightboxLocation = document.getElementById('lightboxLocation');
        var lightboxClose = document.getElementById('lightboxClose');
        var lightboxPrev = document.getElementById('lightboxPrev');
        var lightboxNext = document.getElementById('lightboxNext');

        // 编号有序列表（用于前后导航）
        var dotOrder = [3, 1, 18, 14, 8, 10, 7, 4, 9, 21, 17, 20, 5];
        var currentLightboxIndex = 0;

        // 定位所有缩略图和标签到对应的SVG点位置
        function positionThumbs() {
            var thumbSize = window.innerWidth <= 767 ? 40 : 52;
            var labelOffset = thumbSize / 2 + 8;

            thumbs.forEach(function (thumb) {
                var dotNum = thumb.getAttribute('data-dot');
                var dotData = highlightedDots[dotNum];
                if (!dotData) return;
                var pos = svgToCanvas(dotData.cx, dotData.cy);
                thumb.style.left = (pos.x - thumbSize / 2) + 'px';
                thumb.style.top = (pos.y - thumbSize / 2) + 'px';
            });

            thumbLabels.forEach(function (label) {
                var dotNum = label.getAttribute('data-label');
                var dotData = highlightedDots[dotNum];
                if (!dotData) return;
                var pos = svgToCanvas(dotData.cx, dotData.cy);
                label.style.left = pos.x + 'px';
                label.style.top = (pos.y + labelOffset) + 'px';
            });
        }

        // 进入视口后显示缩略图和标签（逐个动画）
        var thumbObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    thumbs.forEach(function (thumb, i) {
                        setTimeout(function () {
                            thumb.classList.add('visible');
                        }, i * 80);
                    });
                    thumbLabels.forEach(function (label, i) {
                        setTimeout(function () {
                            label.classList.add('visible');
                        }, i * 80 + 200);
                    });
                    thumbObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (thumbContainer) {
            positionThumbs();
            thumbObserver.observe(thumbContainer);
        }

        // resize时重新定位
        window.addEventListener('resize', function () {
            if (animStarted) resizeCanvas();
            positionThumbs();
        });

        // 点击缩略图打开Lightbox
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var dotNum = thumb.getAttribute('data-dot');
                openLightbox(dotNum);
            });
            thumb.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var dotNum = thumb.getAttribute('data-dot');
                    openLightbox(dotNum);
                }
            });
        });

        function openLightbox(dotNum) {
            currentLightboxIndex = dotOrder.indexOf(Number(dotNum));
            if (currentLightboxIndex === -1) currentLightboxIndex = 0;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxContent() {
            var dotNum = dotOrder[currentLightboxIndex];
            var dotData = highlightedDots[dotNum];
            var review = dotReviews[dotNum];
            lightboxImg.src = 'images/case-' + dotNum + '.jpg';
            lightboxImg.alt = dotData ? dotData.label : '';
            lightboxCountry.textContent = dotData ? dotData.label : '';
            if (review) {
                lightboxTag.textContent = review.tag;
                lightboxQuote.textContent = review.quote;
                lightboxName.textContent = review.name;
                lightboxLocation.textContent = review.location;
            }
        }

        function prevLightbox() {
            currentLightboxIndex = (currentLightboxIndex - 1 + dotOrder.length) % dotOrder.length;
            updateLightboxContent();
        }

        function nextLightbox() {
            currentLightboxIndex = (currentLightboxIndex + 1) % dotOrder.length;
            updateLightboxContent();
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevLightbox);
        lightboxNext.addEventListener('click', nextLightbox);

        // 点击遮罩关闭
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        // 键盘导航
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
        });

    })();

});


