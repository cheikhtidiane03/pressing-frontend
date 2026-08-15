import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../services/service-service';
import { ServiceModel } from '../../models/service-model';

@Component({
  selector: 'app-add-service',
  imports: [ReactiveFormsModule],
  templateUrl: './add-service.html',
  styleUrl: './add-service.css',
})
export class AddService {
  private serviceService = inject(ServiceService);

  // si renseigné, le formulaire s'ouvre en mode édition pré-rempli
  serviceExistant = input<ServiceModel | null>(null);

  enregistre = output<ServiceModel>();
  annule = output<void>();

  protected erreur = signal<string | null>(null);
  protected enCours = signal(false);

  serviceForm = new FormGroup({
    libelle: new FormControl('', [Validators.required]),
    prix_unitaire: new FormControl('', [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
    disponible: new FormControl(true),
  });

  ngOnInit() {
    const service = this.serviceExistant();
    if (service) {
      this.serviceForm.patchValue({
        libelle: service.libelle,
        prix_unitaire: String(service.prix_unitaire),
        description: service.description ?? '',
        disponible: service.disponible,
      });
    }
  }

  save() {
    if (this.serviceForm.invalid) return;

    this.erreur.set(null);
    this.enCours.set(true);
    const service = this.serviceExistant();

    const requete = service
      ? this.serviceService.update(service.id!, this.serviceForm.value as any)
      : this.serviceService.save(this.serviceForm.value as any);

    requete.subscribe({
      next: (res) => {
        this.enCours.set(false);
        this.enregistre.emit(res as ServiceModel);
      },
      error: (err) => {
        this.enCours.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de l\'enregistrement.');
      },
    });
  }
}