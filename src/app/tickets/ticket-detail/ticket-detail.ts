import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { PaiementService } from '../../services/paiement-service';
import { TicketModel, TicketStatut } from '../../models/ticket-model';
import { AuthService } from '../../services/auth-service';
import { Modal } from '../../shared/modal/modal';

const PROCHAIN_STATUT: Partial<Record<TicketStatut, { statut: TicketStatut; label: string }>> = {
  recu: { statut: 'en_traitement', label: 'Passer en traitement' },
  en_traitement: { statut: 'pret', label: 'Marquer comme prêt' },
  pret: { statut: 'recupere', label: 'Marquer comme récupéré' },
};

const LABELS_STATUT: Record<TicketStatut, string> = {
  recu: 'Reçu',
  en_traitement: 'En traitement',
  pret: 'Prêt',
  recupere: 'Récupéré',
  annule: 'Annulé',
};

const ETAPES = [
  { statut: 'recu' as TicketStatut, label: 'Reçu' },
  { statut: 'en_traitement' as TicketStatut, label: 'En traitement' },
  { statut: 'pret' as TicketStatut, label: 'Prêt' },
  { statut: 'recupere' as TicketStatut, label: 'Récupéré' },
];

@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink, Modal],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
  
})
export class TicketDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private paiementService = inject(PaiementService);
  protected authService = inject(AuthService);

  protected ticket = signal<TicketModel | null>(null);
  protected erreur = signal<string | null>(null);
  protected chargement = signal(false);
  protected chargementInitial = signal(true);
  protected confirmationAnnulationOuverte = signal(false);
  protected labels = LABELS_STATUT;
  protected etapes = ETAPES;

  protected estAnnule = computed(() => this.ticket()?.statut === 'annule');

  protected etapeActuelleIndex = computed(() => {
    const statut = this.ticket()?.statut;
    return ETAPES.findIndex((e) => e.statut === statut);
  });


  protected prochaineAction = computed(() => {
    const t = this.ticket();
    return t ? PROCHAIN_STATUT[t.statut] : undefined;
  });

  protected peutAnnuler = computed(() => {
    const t = this.ticket();
    return t ? ['recu', 'en_traitement'].includes(t.statut) : false;
  });

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.chargementInitial.set(true);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticketService.getOne(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.chargementInitial.set(false);
      },
      error: () => {
        this.erreur.set('Ticket introuvable.');
        this.chargementInitial.set(false);
      },
    });
  }

  changerStatut() {
    const t = this.ticket();
    const action = this.prochaineAction();
    if (!t || !action) return;

    this.erreur.set(null);
    this.chargement.set(true);

    this.ticketService.updateStatut(t.id, action.statut).subscribe({
      next: (res) => {
        this.chargement.set(false);
        this.ticket.set(res.ticket);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors du changement de statut.');
      },
    });
  }

  annuler() {
    if (!this.ticket()) return;
    this.confirmationAnnulationOuverte.set(true);
  }

  annulerLaConfirmation() {
    this.confirmationAnnulationOuverte.set(false);
  }

  confirmerAnnulation() {
    const t = this.ticket();
    if (!t) return;

    this.confirmationAnnulationOuverte.set(false);
    this.ticketService.annuler(t.id).subscribe({
      next: (res) => this.ticket.set(res.ticket),
      error: (err) => this.erreur.set(err.error?.message ?? "Erreur lors de l'annulation."),
    });
  }

  encaisser() {
    const t = this.ticket();
    if (!t) return;

    this.paiementService.encaisser(t.id).subscribe({
      next: () => this.charger(),
      error: (err) => this.erreur.set(err.error?.message ?? "Erreur lors de l'encaissement."),
    });
  }

  telechargerRecu() {
    const t = this.ticket();
    if (!t) return;

    this.ticketService.telechargerRecu(t.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu-${t.numero}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
