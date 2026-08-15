import { Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../services/service-service';
import { TicketService } from '../../services/ticket-service';
import { ServiceModel } from '../../models/service-model';
import { TicketModel } from '../../models/ticket-model';

interface LigneCommande {
  service: ServiceModel;
  quantite: number;
}

@Component({
  selector: 'app-deposer-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './deposer-ticket.html',
  styleUrl: './deposer-ticket.css',
})
export class DeposerTicket {
  private serviceService = inject(ServiceService);
  private ticketService = inject(TicketService);

  enregistre = output<TicketModel>();
  annule = output<void>();

  protected servicesDisponibles = signal<ServiceModel[]>([]);
  protected panier = signal<LigneCommande[]>([]);
  protected erreur = signal<string | null>(null);
  protected chargement = signal(false);

  protected total = computed(() =>
    this.panier().reduce((somme, ligne) => somme + ligne.service.prix_unitaire * ligne.quantite, 0)
  );

  ajoutForm = new FormGroup({
    service_id: new FormControl('', [Validators.required]),
    quantite: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  ngOnInit() {
    this.serviceService.getAll({ per_page: 100 }).subscribe((res) => {
      this.servicesDisponibles.set(res.services);
    });
  }

  ajouterLigne() {
    if (this.ajoutForm.invalid) return;

    const serviceId = Number(this.ajoutForm.value.service_id);
    const quantite = Number(this.ajoutForm.value.quantite);
    const service = this.servicesDisponibles().find((s) => s.id === serviceId);
    if (!service) return;

    const dejaPresente = this.panier().find((l) => l.service.id === serviceId);
    if (dejaPresente) {
      this.panier.set(
        this.panier().map((l) =>
          l.service.id === serviceId ? { ...l, quantite: l.quantite + quantite } : l
        )
      );
    } else {
      this.panier.set([...this.panier(), { service, quantite }]);
    }

    this.ajoutForm.reset({ service_id: '', quantite: 1 });
  }

  retirerLigne(serviceId?: number) {
    this.panier.set(this.panier().filter((l) => l.service.id !== serviceId));
  }

  deposer() {
    if (this.panier().length === 0) {
      this.erreur.set('Ajoute au moins un service à ta commande.');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const payload = {
      services: this.panier().map((l) => ({ service_id: l.service.id!, quantite: l.quantite })),
    };

    this.ticketService.save(payload).subscribe({
      next: (res) => {
        this.chargement.set(false);
        this.enregistre.emit(res.ticket);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors du dépôt de la commande.');
      },
    });
  }
}