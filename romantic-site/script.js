/* =========================================================
   Логика романтического сайта
   - фон с парящими сердечками и звёздами
   - переход со страницы приветствия на страницу счётчика
   - счётчик времени от даты начала отношений
   ========================================================= */

// =========================================================
// НАСТРОЙКА: дата начала отношений (год, месяц-1, день, часы, минуты)
// Месяцы в JS считаются с нуля: 0 — январь, 1 — февраль, ..., 9 — октябрь
// =========================================================
const RELATIONSHIP_START = new Date(2026, 9, 16, 22, 1); // 16 октября 2026

// Склонение слов: день/дня/дней
function plural(n, one, few, many) {
    const mod100 = n % 100;
    const mod10 = n % 10;
    if (mod100 >= 11 && mod100 <= 14) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}

// Добиваем число нулём слева: 8 -> "08"
function pad2(n) {
    return String(n).padStart(2, '0');
}

// ---------- Фон с парящими частицами ----------

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    // Учитываем пожелание об отключении анимаций
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const symbols = [
        { char: '♥', cls: 'particle--heart', weight: 0.6 },
        { char: '✦', cls: 'particle--star', weight: 0.3 },
        { char: '❥', cls: 'particle--heart', weight: 0.1 },
    ];

    // На телефонах — меньше частиц, чтобы не тормозило
    const isMobile = window.innerWidth < 600;
    const count = isMobile ? 18 : 34;

    for (let i = 0; i < count; i++) {
        const pick = Math.random();
        let symbol = symbols[0];
        let acc = 0;
        for (const s of symbols) {
            acc += s.weight;
            if (pick <= acc) { symbol = s; break; }
        }

        const el = document.createElement('span');
        el.className = `particle ${symbol.cls}`;
        el.textContent = symbol.char;
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (8 + Math.random() * 14) + 'px';
        el.style.animationDuration = (9 + Math.random() * 10) + 's';
        el.style.animationDelay = (-Math.random() * 18) + 's'; // старт в разных точках
        container.appendChild(el);
    }
}

// ---------- Кнопка «Открыть нашу историю» ----------

function setupOpenButton() {
    const btn = document.getElementById('openStory');
    const card = document.getElementById('card');
    const particles = document.getElementById('particles');
    if (!btn || !card) return;

    btn.addEventListener('click', () => {
        // Карточка плавно исчезает
        card.classList.add('card--leaving');

        // Сердечки разлетаются вверх быстрее
        if (particles) {
            particles.querySelectorAll('.particle').forEach(el => {
                el.style.animationDuration = '1.2s';
            });
        }

        // Переход на вторую страницу после анимации
        setTimeout(() => {
            window.location.href = 'counter.html';
        }, 850);
    });
}

// ---------- Счётчик времени ----------

function updateCounter() {
    const counterEl = document.getElementById('counter');
    if (!counterEl) return;

    // Дата не настроена — показываем понятное сообщение
    if (!(RELATIONSHIP_START instanceof Date) || isNaN(RELATIONSHIP_START.getTime())) {
        counterEl.innerHTML = `
            <div class="counter__error">
                Дата начала отношений ещё не указана.<br>
                Открой файл <code>script.js</code> и задай её в строке
                <code>const RELATIONSHIP_START = new Date(2026, 9, 16)</code>
            </div>`;
        return;
    }

    const now = new Date();
    // Разница в миллисекундах, без отрицательных значений
    const diffMs = Math.max(0, now - RELATIONSHIP_START);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = pad2(hours);
    document.getElementById('minutes').textContent = pad2(minutes);
    document.getElementById('seconds').textContent = pad2(seconds);

    document.getElementById('daysLabel').textContent =
        plural(days, 'день', 'дня', 'дней');
}

function startCounter() {
    if (!document.getElementById('counter')) return;
    updateCounter();
    setInterval(updateCounter, 1000); // обновление каждую секунду
}

// ---------- Запуск ----------

createParticles();
setupOpenButton();
startCounter();
