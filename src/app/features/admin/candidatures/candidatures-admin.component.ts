import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CandidatureService } from '../../../core/services/candidature.service';
import { ConcoursService } from '../../../core/services/concours.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Candidature, StatutCandidature } from '../../../core/models/candidature.model';
import { Concours } from '../../../core/models/concours.model';

@Component({
  selector: 'app-candidatures-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './candidatures-admin.component.html'
})
export class CandidaturesAdminComponent implements OnInit {
  concours = signal<Concours | null>(null);
  candidatures = signal<Candidature[]>([]);
  loading = signal(true);
  concoursId!: number;

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService,
    private concoursService: ConcoursService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.concoursId = Number(this.route.snapshot.paramMap.get('id'));
    this.concoursService.getById(this.concoursId).subscribe((c) => this.concours.set(c));
    this.charger();
  }

  charger() {
    this.candidatureService.getByConcours(this.concoursId).subscribe((data) => {
      this.candidatures.set(data);
      this.loading.set(false);
    });
  }

  changerStatut(c: Candidature, statut: StatutCandidature) {
    this.candidatureService.changerStatut(c.id, statut).subscribe(() => {
      this.toast.success('Statut mis à jour');
      this.charger();
    });
  }
}
