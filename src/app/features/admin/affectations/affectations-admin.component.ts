import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AffectationService } from '../../../core/services/affectation.service';
import { ConcoursService } from '../../../core/services/concours.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Affectation } from '../../../core/models/salle.model';
import { Concours } from '../../../core/models/concours.model';

@Component({
  selector: 'app-affectations-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, SpinnerComponent, LoadingBlockComponent],
  templateUrl: './affectations-admin.component.html'
})
export class AffectationsAdminComponent implements OnInit {
  concours = signal<Concours | null>(null);
  affectations = signal<Affectation[]>([]);
  loading = signal(true);
  loadingAction = signal(false);
  concoursId!: number;

  constructor(
    private route: ActivatedRoute,
    private affectationService: AffectationService,
    private concoursService: ConcoursService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.concoursId = Number(this.route.snapshot.paramMap.get('id'));
    this.concoursService.getById(this.concoursId).subscribe((c) => this.concours.set(c));
    this.charger();
  }

  charger() {
    this.affectationService.getByConcours(this.concoursId).subscribe((data) => {
      this.affectations.set(data);
      this.loading.set(false);
    });
  }

  repartir() {
    this.loadingAction.set(true);
    this.affectationService.repartir(this.concoursId).subscribe({
      next: (data) => {
        this.loadingAction.set(false);
        this.affectations.set(data);
        this.toast.success('Candidats répartis dans les salles');
      },
      error: () => this.loadingAction.set(false)
    });
  }
}
