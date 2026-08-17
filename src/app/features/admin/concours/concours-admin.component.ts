import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ConcoursService } from '../../../core/services/concours.service';
import { ResultatService } from '../../../core/services/resultat.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Concours } from '../../../core/models/concours.model';

@Component({
  selector: 'app-concours-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './concours-admin.component.html'
})
export class ConcoursAdminComponent implements OnInit {
  concours = signal<Concours[]>([]);
  loading = signal(true);
  modalOuvert = signal(false);
  editionId = signal<number | null>(null);

  form: Partial<Concours> = { titre: '', description: '', dateLimiteCandidature: '', dateDeliberation: '' };

  constructor(
    private concoursService: ConcoursService,
    private resultatService: ResultatService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.concoursService.getAll().subscribe((data) => {
      this.concours.set(data);
      this.loading.set(false);
    });
  }

  ouvrirCreation() {
    this.editionId.set(null);
    this.form = { titre: '', description: '', dateLimiteCandidature: '', dateDeliberation: '' };
    this.modalOuvert.set(true);
  }

  ouvrirEdition(c: Concours) {
    this.editionId.set(c.id);
    this.form = {
      titre: c.titre,
      description: c.description,
      dateLimiteCandidature: c.dateLimiteCandidature,
      dateDeliberation: c.dateDeliberation
    };
    this.modalOuvert.set(true);
  }

  fermerModal() {
    this.modalOuvert.set(false);
  }

  enregistrer() {
    const id = this.editionId();
    const action = id
      ? this.concoursService.update(id, this.form)
      : this.concoursService.creer(this.form);

    action.subscribe(() => {
      this.toast.success(id ? 'Concours mis à jour' : 'Concours créé');
      this.modalOuvert.set(false);
      this.charger();
    });
  }

  async supprimer(c: Concours) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Supprimer ce concours ?',
      message: `"${c.titre}" sera définitivement supprimé, ainsi que ses épreuves et candidatures. Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      danger: true
    });
    if (!confirmed) return;
    this.concoursService.delete(c.id).subscribe(() => {
      this.toast.success('Concours supprimé');
      this.charger();
    });
  }

  async publierResultats(c: Concours) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Publier les résultats ?',
      message: `Les candidats de "${c.titre}" pourront voir leur statut Admis/Refusé. Cette action est irréversible.`,
      confirmLabel: 'Publier'
    });
    if (!confirmed) return;
    this.resultatService.publier(c.id).subscribe(() => {
      this.toast.success('Résultats publiés avec succès');
      this.charger();
    });
  }
}
