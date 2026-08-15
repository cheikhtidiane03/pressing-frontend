import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../services/auth-service';
import { ThemeService } from '../services/theme-service';
import { StatistiqueService } from '../services/statistique-service';
import { TicketService } from '../services/ticket-service';
import { CaParService, StatistiquesJour, TicketsParMois } from '../models/statistique-model';
import { TicketModel, TicketStatut } from '../models/ticket-model';

const MOIS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const LABELS_STATUT: Record<TicketStatut, string> = {
  recu: 'Reçu',
  en_traitement: 'En traitement',
  pret: 'Prêt',
  recupere: 'Récupéré',
  annule: 'Annulé',
};

function formatMoisCourt(mois: string): string {
  const [annee, moisNum] = mois.split('-');
  return `${MOIS_FR[Number(moisNum) - 1] ?? moisNum} ${annee.slice(2)}`;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private statistiqueService = inject(StatistiqueService);
  private ticketService = inject(TicketService);

  protected labels = LABELS_STATUT;
  protected chargement = signal(true);

  // --- gestionnaire ---
  protected jour = signal<StatistiquesJour | null>(null);
  protected ticketsParMois = signal<TicketsParMois[]>([]);
  protected caParService = signal<CaParService[]>([]);

  // --- client & gestionnaire : derniers tickets ---
  protected ticketsRecents = signal<TicketModel[]>([]);

  ticketsCanvas = viewChild<ElementRef<HTMLCanvasElement>>('ticketsCanvas');
  caCanvas = viewChild<ElementRef<HTMLCanvasElement>>('caCanvas');
  statutCanvas = viewChild<ElementRef<HTMLCanvasElement>>('statutCanvas');
  moisCanvas = viewChild<ElementRef<HTMLCanvasElement>>('moisCanvas');

  private chartTickets: Chart | null = null;
  private chartCA: Chart | null = null;
  private chartStatut: Chart | null = null;
  private chartMois: Chart | null = null;

  constructor() {
    effect(() => {
      this.themeService.theme();
      if (this.chargement()) return;
      if (this.authService.isGestionnaire()) {
        this.dessinerGraphiqueTickets();
        this.dessinerGraphiqueCA();
      } else {
        this.dessinerGraphiqueStatut();
        this.dessinerGraphiqueMois();
      }
    });
  }

  ngOnInit() {
    if (this.authService.isGestionnaire()) {
      forkJoin({
        jour: this.statistiqueService.jour(),
        mensuel: this.statistiqueService.mensuel(),
        parService: this.statistiqueService.parService(),
        recents: this.ticketService.getAll({ per_page: 5 }),
      }).subscribe(({ jour, mensuel, parService, recents }) => {
        this.jour.set(jour);
        this.ticketsParMois.set(mensuel.tickets_par_mois);
        this.caParService.set(parService.chiffre_affaires_par_service);
        this.ticketsRecents.set(recents.tickets);
        this.chargement.set(false);
        this.dessinerGraphiqueTickets();
        this.dessinerGraphiqueCA();
      });
    } else {
      this.ticketService.getAll({ per_page: 100 }).subscribe((res) => {
        this.ticketsRecents.set(res.tickets.slice(0, 5));
        this.calculerGraphiquesClient(res.tickets);
        this.chargement.set(false);
        this.dessinerGraphiqueStatut();
        this.dessinerGraphiqueMois();
      });
    }
  }

  private donneesStatutClient: { statut: string; total: number }[] = [];
  private donneesMoisClient: { mois: string; total: number }[] = [];

  private calculerGraphiquesClient(tickets: TicketModel[]) {
    const parStatut = new Map<string, number>();
    const parMois = new Map<string, number>();

    for (const t of tickets) {
      parStatut.set(t.statut, (parStatut.get(t.statut) ?? 0) + 1);
      if (t.created_at) {
        const mois = t.created_at.slice(0, 7);
        parMois.set(mois, (parMois.get(mois) ?? 0) + 1);
      }
    }

    this.donneesStatutClient = Array.from(parStatut.entries()).map(([statut, total]) => ({ statut, total }));
    this.donneesMoisClient = Array.from(parMois.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([mois, total]) => ({ mois, total }));
  }

  private couleurTexte(): string {
    return this.themeService.theme() === 'dark' ? '#93a0b3' : '#6b7280';
  }

  private couleurGrille(): string {
    return this.themeService.theme() === 'dark' ? '#2a2c3a' : '#e6e7f0';
  }

  private dessinerGraphiqueTickets() {
    const canvas = this.ticketsCanvas()?.nativeElement;
    if (!canvas || this.ticketsParMois().length === 0) return;

    this.chartTickets?.destroy();
    const data = this.ticketsParMois();
    const couleur = this.themeService.theme() === 'dark' ? '#8b83ec' : '#7c74e8';

    this.chartTickets = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((d) => formatMoisCourt(d.mois)),
        datasets: [{ data: data.map((d) => d.total), backgroundColor: couleur, borderRadius: 4, barThickness: 18 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0, color: this.couleurTexte(), font: { size: 10 } }, grid: { color: this.couleurGrille() } },
          x: { ticks: { color: this.couleurTexte(), font: { size: 10 } }, grid: { display: false } },
        },
      },
    });
  }

  private dessinerGraphiqueCA() {
    const canvas = this.caCanvas()?.nativeElement;
    if (!canvas || this.caParService().length === 0) return;

    this.chartCA?.destroy();

    const totaux = new Map<string, number>();
    for (const ligne of this.caParService()) {
      totaux.set(ligne.libelle, (totaux.get(ligne.libelle) ?? 0) + Number(ligne.chiffre_affaires));
    }

    this.chartCA = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Array.from(totaux.keys()),
        datasets: [{ data: Array.from(totaux.values()), backgroundColor: ['#7c74e8', '#f59e0b', '#16a34a', '#dc2626', '#2980b9', '#a855f7'] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: this.couleurTexte(), font: { size: 10 }, boxWidth: 10, padding: 8 } } },
      },
    });
  }

  private dessinerGraphiqueStatut() {
    const canvas = this.statutCanvas()?.nativeElement;
    if (!canvas || this.donneesStatutClient.length === 0) return;

    this.chartStatut?.destroy();

    this.chartStatut = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.donneesStatutClient.map((d) => this.labels[d.statut as TicketStatut] ?? d.statut),
        datasets: [{
          data: this.donneesStatutClient.map((d) => d.total),
          backgroundColor: ['#7c74e8', '#f59e0b', '#16a34a', '#6b7280', '#dc2626'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: this.couleurTexte(), font: { size: 10 }, boxWidth: 10, padding: 8 } } },
      },
    });
  }

  private dessinerGraphiqueMois() {
    const canvas = this.moisCanvas()?.nativeElement;
    if (!canvas || this.donneesMoisClient.length === 0) return;

    this.chartMois?.destroy();
    const couleur = this.themeService.theme() === 'dark' ? '#8b83ec' : '#7c74e8';

    this.chartMois = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.donneesMoisClient.map((d) => formatMoisCourt(d.mois)),
        datasets: [{ data: this.donneesMoisClient.map((d) => d.total), backgroundColor: couleur, borderRadius: 4, barThickness: 18 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0, color: this.couleurTexte(), font: { size: 10 } }, grid: { color: this.couleurGrille() } },
          x: { ticks: { color: this.couleurTexte(), font: { size: 10 } }, grid: { display: false } },
        },
      },
    });
  }
}