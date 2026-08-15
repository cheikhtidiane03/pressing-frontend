import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service-service';
import { TicketService } from '../../services/ticket-service';
import { ServiceModel } from '../../models/service-model';
import { AuthService } from '../../services/auth-service';
import { Modal } from '../../shared/modal/modal';
import { AddService } from '../add-service/add-service';

@Component({
  selector: 'app-service-list',
  imports: [Modal, AddService],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList {
  private serviceService = inject(ServiceService);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  protected authService = inject(AuthService);

  protected services = signal<ServiceModel[]>([]);
  protected recherche = signal('');
  protected chargement = signal(true);

  // --- édition/création (gestionnaire) ---
  protected modalOuvert = signal(false);
  protected serviceEnEdition = signal<ServiceModel | null>(null);

  // --- commande rapide (client) ---
  protected modalCommandeOuvert = signal(false);
  protected serviceACommander = signal<ServiceModel | null>(null);
  protected quantiteCommande = signal(1);
  protected commandeEnCours = signal(false);
  protected commandeErreur = signal<string | null>(null);
  protected confirmationArchivageOuverte = signal(false);
  protected serviceIdAArchiver = signal<number | null>(null);

  protected commandeTotal = computed(
    () => (this.serviceACommander()?.prix_unitaire ?? 0) * this.quantiteCommande()
  );

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.chargement.set(true);
    this.serviceService.getAll({ libelle: this.recherche() || undefined }).subscribe((res) => {
      this.services.set(res.services);
      this.chargement.set(false);
    });
  }

  onRechercheChange(valeur: string) {
    this.recherche.set(valeur);
    this.getAll();
  }

  // Clic sur une carte : édition pour le gestionnaire, commande rapide pour le client
  ouvrirCarte(service: ServiceModel) {
    if (this.authService.isGestionnaire()) {
      this.ouvrirEdition(service);
    } else {
      this.ouvrirCommande(service);
    }
  }

  ouvrirCreation() {
    this.serviceEnEdition.set(null);
    this.modalOuvert.set(true);
  }

  ouvrirEdition(service: ServiceModel) {
    this.serviceEnEdition.set(service);
    this.modalOuvert.set(true);
  }

  fermerModal() {
    this.modalOuvert.set(false);
  }

  onServiceEnregistre() {
    this.modalOuvert.set(false);
    this.getAll();
  }

  archiver(id?: number, event?: Event) {
    event?.stopPropagation();
    if (!id) return;
    this.serviceIdAArchiver.set(id);
    this.confirmationArchivageOuverte.set(true);
  }

  annulerArchivage() {
    this.confirmationArchivageOuverte.set(false);
    this.serviceIdAArchiver.set(null);
  }

  confirmerArchivage() {
    const id = this.serviceIdAArchiver();
    if (!id) return;
    this.serviceService.archiver(id).subscribe(() => {
      this.confirmationArchivageOuverte.set(false);
      this.getAll();
    });
  }

  ouvrirCommande(service: ServiceModel) {
    this.serviceACommander.set(service);
    this.quantiteCommande.set(1);
    this.commandeErreur.set(null);
    this.modalCommandeOuvert.set(true);
  }

  fermerModalCommande() {
    this.modalCommandeOuvert.set(false);
  }

  changerQuantite(valeur: string) {
    const n = Number(valeur);
    this.quantiteCommande.set(n > 0 ? n : 1);
  }

  confirmerCommande() {
    const service = this.serviceACommander();
    if (!service?.id) return;

    this.commandeEnCours.set(true);
    this.commandeErreur.set(null);

    this.ticketService
      .save({ services: [{ service_id: service.id, quantite: this.quantiteCommande() }] })
      .subscribe({
        next: (res) => {
          this.commandeEnCours.set(false);
          this.modalCommandeOuvert.set(false);
          this.router.navigate(['/tickets', res.ticket.id]);
        },
        error: (err) => {
          this.commandeEnCours.set(false);
          this.commandeErreur.set(err.error?.message ?? 'Erreur lors de la commande.');
        },
      });
  }
}