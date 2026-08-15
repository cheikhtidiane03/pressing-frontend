import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { TicketModel, TicketStatut } from '../../models/ticket-model';
import { AuthService } from '../../services/auth-service';
import { Modal } from '../../shared/modal/modal';
import { DeposerTicket } from '../deposer-ticket/deposer-ticket';

const LABELS_STATUT: Record<TicketStatut, string> = {
  recu: 'Reçu',
  en_traitement: 'En traitement',
  pret: 'Prêt',
  recupere: 'Récupéré',
  annule: 'Annulé',
};

@Component({
  selector: 'app-ticket-list',
  imports: [Modal, DeposerTicket],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList {
  private ticketService = inject(TicketService);
  private router = inject(Router);
  protected authService = inject(AuthService);

  protected tickets = signal<TicketModel[]>([]);
  protected filtreStatut = signal<TicketStatut | ''>('');
  protected labels = LABELS_STATUT;
  protected chargement = signal(true);
  protected modalOuvert = signal(false);

  statuts: TicketStatut[] = ['recu', 'en_traitement', 'pret', 'recupere', 'annule'];

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.chargement.set(true);
    const statut = this.filtreStatut();
    this.ticketService.getAll(statut ? { statut } : undefined).subscribe((res) => {
      this.tickets.set(res.tickets);
      this.chargement.set(false);
    });
  }

  onFiltreChange(valeur: string) {
    this.filtreStatut.set(valeur as TicketStatut | '');
    this.getAll();
  }

  voirDetail(id: number) {
    this.router.navigate(['/tickets', id]);
  }

  onTicketDepose(ticket: TicketModel) {
    this.modalOuvert.set(false);
    this.router.navigate(['/tickets', ticket.id]);
  }
}