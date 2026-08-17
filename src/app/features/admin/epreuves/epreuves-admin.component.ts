import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { EpreuveService } from '../../../core/services/epreuve.service';
import { ConcoursService } from '../../../core/services/concours.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Epreuve, Concours } from '../../../core/models/concours.model';

@Component({
  selector: 'app-epreuves-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './epreuves-admin.component.html'
})
export class EpreuvesAdminComponent implements OnInit {
  concours = signal<Concours | null>(null);
  epreuves = signal<Epreuve[]>([]);
  loading = signal(true);
  modalOuvert = signal(false);
  concoursId!: number;

  form: Partial<Epreuve> = { nom: '', coefficient: 1, dureeMinutes: 60 };

  constructor(
    private route: ActivatedRoute,
    private epreuveService: EpreuveService,
    private concoursService: ConcoursService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.concoursId = Number(this.route.snapshot.paramMap.get('id'));
    this.concoursService.getById(this.concoursId).subscribe((c) => this.concours.set(c));
    this.charger();
  }

  charger() {
    this.epreuveService.getByConcours(this.concoursId).subscribe((data) => {
      this.epreuves.set(data);
      this.loading.set(false);
    });
  }

  ajouter() {
    this.epreuveService.ajouter(this.concoursId, this.form).subscribe(() => {
      this.toast.success('Épreuve ajoutée');
      this.modalOuvert.set(false);
      this.form = { nom: '', coefficient: 1, dureeMinutes: 60 };
      this.charger();
    });
  }

  async supprimer(e: Epreuve) {
    const confirmed = await this.confirmDialog.confirm({
      title: "Supprimer l'épreuve ?",
      message: `"${e.nom}" sera définitivement supprimée.`,
      confirmLabel: 'Supprimer',
      danger: true
    });
    if (!confirmed) return;
    this.epreuveService.delete(e.id).subscribe(() => {
      this.toast.success('Épreuve supprimée');
      this.charger();
    });
  }
}
