import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SalleService } from '../../../core/services/salle.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Salle } from '../../../core/models/salle.model';

@Component({
  selector: 'app-salles-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './salles-admin.component.html'
})
export class SallesAdminComponent implements OnInit {
  salles = signal<Salle[]>([]);
  loading = signal(true);
  modalOuvert = signal(false);
  editionId = signal<number | null>(null);

  form: Partial<Salle> = { nom: '', localisation: '', capacite: 30 };

  constructor(
    private salleService: SalleService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.salleService.getAll().subscribe((data) => {
      this.salles.set(data);
      this.loading.set(false);
    });
  }

  ouvrirCreation() {
    this.editionId.set(null);
    this.form = { nom: '', localisation: '', capacite: 30 };
    this.modalOuvert.set(true);
  }

  ouvrirEdition(s: Salle) {
    this.editionId.set(s.id);
    this.form = { nom: s.nom, localisation: s.localisation, capacite: s.capacite };
    this.modalOuvert.set(true);
  }

  fermerModal() {
    this.modalOuvert.set(false);
  }

  enregistrer() {
    const id = this.editionId();
    const action = id ? this.salleService.update(id, this.form) : this.salleService.creer(this.form);

    action.subscribe(() => {
      this.toast.success(id ? 'Salle mise à jour' : 'Salle créée');
      this.modalOuvert.set(false);
      this.charger();
    });
  }

  async supprimer(s: Salle) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Supprimer cette salle ?',
      message: `"${s.nom}" sera définitivement supprimée.`,
      confirmLabel: 'Supprimer',
      danger: true
    });
    if (!confirmed) return;
    this.salleService.delete(s.id).subscribe(() => {
      this.toast.success('Salle supprimée');
      this.charger();
    });
  }
}
