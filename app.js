/**
 * ULTIMATE NINJA PORTFOLIO CORE (Hybrid Edition)
 * Features: Geometric Canvas, 3D Tilt, Glitch Text, Smooth Scroll, Data-Injection
 */


// 1. DATA SOURCE

const portfolioData = [
    {
        id: 1,
        title: "Stock Price Prediction LSTM",
        category: "model", // ใช้สำหรับ Filter
        type: "Deep Learning Model",
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=800",
        tech: ["Python", "TensorFlow", "Keras"],
        link: "#"
    },
    {
        id: 2,
        title: "E-Commerce Sales Analysis",
        category: "code",
        type: "Data Analysis",
        image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?auto=format&fit=crop&q=80&w=800",
        tech: ["SQL", "PostgreSQL", "Tableau"],
        link: "#"
    },
    {
        id: 3,
        title: "Statistical Genomic Research",
        category: "article",
        type: "Research Article",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
        tech: ["R", "Bioinformatics", "Markdown"],
        link: "#"
    },
    {
        id: 4,
        title: "High-Performance Memory Allocator",
        category: "code",
        type: "System Programming",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
        tech: ["C", "Linux", "Make"],
        link: "#"
    }
];

// 2. GEOMETRIC ENGINE

class GeometricCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.particleCount = 60;
        this.mouse = { x: null, y: null };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.particles = Array.from({ length: this.particleCount }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        }));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // movement
            p.x += p.vx;
            p.y += p.vy;

            // bounce
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // ===============================
            // 🖱️ Mouse Repel Interaction
            // ===============================
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    p.x -= dx * force * 0.03;
                    p.y -= dy * force * 0.03;
                }
            }

            // draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(0, 243, 255, 0.6)";
            this.ctx.fill();
        });

        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / 150})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener("resize", () => this.init());
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}



// 3. UI CONTROLLER (UPDATED VERSION)

class UIController {
    constructor() {
        this.gridContainer = document.querySelector(".grid-container");
        this.filterBtns = document.querySelectorAll(".filter-btn"); // 1. จับปุ่ม Filter ทั้งหมด
        this.init();
    }

    init() {
        this.renderProjects('all'); // 2. เริ่มต้นให้โชว์ทั้งหมด
        this.setupFilters();        // 3. เรียกใช้ระบบกรอง
        
        // เรียกฟังก์ชันเดิมที่มีอยู่แล้ว
        this.setupSmoothScroll();
        this.setupGlitch();
        this.setupContact();
        // ส่วน Tilt เราจะเรียกใช้หลังจาก Render เสร็จใน renderProjects
    }

    // --- ส่วนใหม่: จัดการปุ่มกด ---
    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // เอากรอบ Active ออกจากปุ่มเดิม
                document.querySelector(".filter-btn.active")?.classList.remove("active");
                // ใส่กรอบ Active ให้ปุ่มที่เพิ่งกด
                btn.classList.add("active");

                // ดึงค่าหมวดหมู่ (all, model, code, article) มาใช้งาน
                const filterValue = btn.getAttribute("data-filter");
                this.renderProjects(filterValue);
            });
        });
    }

    // --- ส่วนแก้ไข: แสดงผลตามหมวดหมู่ ---
    renderProjects(filter = 'all') {
        if (!this.gridContainer) return;

        // 1. กรองข้อมูลจาก portfolioData
        const filteredData = filter === 'all' 
            ? portfolioData 
            : portfolioData.filter(p => p.category === filter);

        // 2. สร้าง HTML ใหม่ (เพิ่ม Animation fadeIn ให้ดูนุ่มนวล)
        this.gridContainer.innerHTML = filteredData
            .map(p => `
            <article class="project-card reveal active" style="animation: fadeIn 0.6s ease;">
                <div class="card-visual">
                    <img src="${p.image}" alt="${p.title}">
                    <div class="card-overlay">
                        <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${p.title}</h3>
                    <p style="color:var(--accent-primary); font-size:0.8rem; margin-bottom:5px;">${p.type}</p>
                    <div class="tech-stack">
                        ${p.tech.map(t => `<span data-lang="${t}">#${t}</span>`).join(" ")}
                    </div>
                </div>
            </article>
        `).join("");

        // 3. เรียกใช้ Tilt effect ใหม่ (เพราะการ์ดถูกสร้างใหม่ event เดิมจะหายไป)
        this.setupTilt();
    }

    // --- ฟังก์ชันเดิม (คงไว้เหมือนเดิม) ---
    setupGlitch() {
        const el = document.querySelector(".glitch-text");
        if (!el) return;
        const original = el.dataset.text || el.innerText;
        const chars = "!<>-_\\/[]{}—=+*^?#________";
        setInterval(() => {
            el.innerText = original.split("").map(c => (Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : c)).join("");
            setTimeout(() => (el.innerText = original), 100);
        }, 3000);
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener("click", e => {
                e.preventDefault();
                const target = document.querySelector(a.getAttribute("href"));
                if (target) target.scrollIntoView({ behavior: "smooth" });
            });
        });
    }

    setupTilt() {
        // ล้าง Event เก่าก่อน (ป้องกันการซ้อนกัน)
        const cards = document.querySelectorAll(".project-card");
        
        cards.forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // ปรับองศาเอียง
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
            });
        });
    }

    setupContact() {
        const btn = document.getElementById("contact-trigger");
        const modal = document.getElementById("contact-modal");
        
        if (btn && modal) {
            btn.addEventListener("click", () => modal.showModal());
        }
    }
}


// 4. BOOTSTRAP

document.addEventListener("DOMContentLoaded", () => {
    new GeometricCanvas("geometry-canvas");
    new UIController();
});
