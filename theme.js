// Gerenciador de Tema (Claro / Escuro) do Tropical Club
(function initTheme() {
    const saved = localStorage.getItem('tropical_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Padrão: claro (conforme preferência do usuário), ou o salvo anteriormente
    const theme = saved ? saved : (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tropical_theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tropical_theme', 'dark');
    }
    updateThemeToggleIcons();
    
    // Se existir função de re-renderização de cards na página, chama
    if (typeof filterWorkouts === 'function') {
        filterWorkouts();
    } else if (typeof loadWorkouts === 'function' && typeof currentRunnerId !== 'undefined') {
        loadWorkouts(currentRunnerId);
    }
}

function updateThemeToggleIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        if (isDark) {
            btn.innerHTML = '<i class="fa-solid fa-sun text-amber-400"></i>';
            btn.setAttribute('title', 'Mudar para tema claro');
            btn.setAttribute('aria-label', 'Mudar para tema claro');
        } else {
            btn.innerHTML = '<i class="fa-solid fa-moon text-slate-600"></i>';
            btn.setAttribute('title', 'Mudar para tema escuro');
            btn.setAttribute('aria-label', 'Mudar para tema escuro');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggleIcons();
});
