/* ============================================================
   北京心潮科技有限公司 — 官网交互脚本
   粒子网络背景 / 滚动动效 / 数字滚动 / 3D 卡片 / 终端打字机
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 页面加载动画 ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("done");
    }, 600);
  });

  /* ---------- 粒子网络背景 ---------- */
  var canvas = document.getElementById("particle-canvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: null, y: null };
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var LINK_DIST = 140;

  function resizeCanvas() {
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initParticles();
  }

  function initParticles() {
    var count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 130);
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() < 0.7 ? 187 : 258 // 青色为主，紫色点缀
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var i, j, p, q, dx, dy, dist;

    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // 鼠标轻微吸引
      if (mouse.x !== null) {
        dx = mouse.x - p.x;
        dy = mouse.y - p.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 0.001) {
          p.x += (dx / dist) * 0.35;
          p.y += (dy / dist) * 0.35;
        }
      }

      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(" + p.hue + ", 100%, 65%, 0.75)";
      ctx.fill();
    }

    // 粒子连线
    for (i = 0; i < particles.length; i++) {
      for (j = i + 1; j < particles.length; j++) {
        p = particles[i];
        q = particles[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        dist = dx * dx + dy * dy;
        if (dist < LINK_DIST * LINK_DIST) {
          var alpha = (1 - Math.sqrt(dist) / LINK_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "hsla(200, 100%, 70%, " + alpha + ")";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    var glow = document.querySelector(".cursor-glow");
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  });
  window.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  drawParticles();

  /* ---------- 导航栏 ---------- */
  var navbar = document.getElementById("navbar");
  var navLinks = document.getElementById("navLinks");
  var navToggle = document.getElementById("navToggle");
  var sections = document.querySelectorAll("section[id]");
  var links = navLinks.querySelectorAll("a");

  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    // 滚动高亮当前栏目
    var current = "";
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 220) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }, { passive: true });

  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
    });
  });

  /* ---------- 滚动浮现 ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- 数字滚动 ---------- */
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".stat-num").forEach(function (el) {
    countObserver.observe(el);
  });

  /* ---------- 技术能力进度条 ---------- */
  document.querySelectorAll(".tech-bar").forEach(function (bar) {
    bar.style.setProperty("--w", bar.dataset.value + "%");
  });

  /* ---------- 3D 倾斜卡片 + 光晕跟随 ---------- */
  document.querySelectorAll(".tilt-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rx = ((y / rect.height) - 0.5) * -10;
      var ry = ((x / rect.width) - 0.5) * 10;
      card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  /* ---------- 终端打字机 ---------- */
  var terminalLines = [
    { text: "$ xinchao --init core-engine", cls: "tg" },
    { text: "[OK] 神经网络推理引擎 已加载", cls: "" },
    { text: "[OK] 实时数据流水线 已连接  · 吞吐 1.2M msg/s", cls: "" },
    { text: "[OK] 云原生集群 已就绪      · 节点 128 / 128", cls: "" },
    { text: "$ xinchao --status", cls: "tg" },
    { text: "  MODE   : FUTURE-READY", cls: "tv" },
    { text: "  UPTIME : 99.99%", cls: "tv" },
    { text: "  MISSION: 心之所向，潮起未来 ✦", cls: "tv" }
  ];
  var terminalBody = document.getElementById("terminalBody");
  var terminalStarted = false;

  function typeTerminal() {
    var lineIdx = 0, charIdx = 0;
    var cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    terminalBody.appendChild(cursor);

    function typeChar() {
      if (lineIdx >= terminalLines.length) return;
      var line = terminalLines[lineIdx];
      if (charIdx === 0) {
        var span = document.createElement("span");
        if (line.cls) span.className = line.cls;
        terminalBody.insertBefore(span, cursor);
        line._span = span;
      }
      if (charIdx < line.text.length) {
        line._span.textContent += line.text[charIdx];
        charIdx++;
        setTimeout(typeChar, line.text[0] === "$" ? 38 : 14);
      } else {
        terminalBody.insertBefore(document.createTextNode("\n"), cursor);
        lineIdx++;
        charIdx = 0;
        setTimeout(typeChar, 260);
      }
    }
    typeChar();
  }

  var terminalObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !terminalStarted) {
      terminalStarted = true;
      typeTerminal();
      terminalObserver.disconnect();
    }
  }, { threshold: 0.4 });
  terminalObserver.observe(terminalBody);

  /* ---------- 联系表单 ---------- */
  document.getElementById("sendBtn").addEventListener("click", function () {
    var name = document.getElementById("fName").value.trim();
    var mail = document.getElementById("fMail").value.trim();
    var msg = document.getElementById("fMsg").value.trim();
    if (!name || !mail || !msg) return;
    // 静态站点：通过 mailto 唤起邮件客户端发送
    var subject = encodeURIComponent("【官网合作意向】来自 " + name);
    var body = encodeURIComponent("姓名：" + name + "\n邮箱：" + mail + "\n\n" + msg);
    window.location.href = "mailto:busejinoer@gmail.com?subject=" + subject + "&body=" + body;
  });

  /* ---------- 页脚年份 ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
