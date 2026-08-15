import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'pressing_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>(this.lireThemeInitial());

  constructor() {
    this.appliquer(this.theme());
  }

  toggle() {
    const nouveau: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nouveau);
    this.appliquer(nouveau);
    localStorage.setItem(THEME_KEY, nouveau);
  }

  private appliquer(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  private lireThemeInitial(): Theme {
    const stocke = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stocke) return stocke;

    // sinon on suit la préférence système
    const prefereSombre = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefereSombre ? 'dark' : 'light';
  }
}
