import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ConcoursService } from '../../../core/services/concours.service';
import { CandidatureService } from '../../../core/services/candidature.service';
import { AuthService } from '../../../core/services/auth.service';
import { Concours } from '../../../core/models/concours.model';
import { Candidature } from '../../../core/models/candidature.model';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';

@Component({
  selector: 'app-candidat-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, NgChartsModule, LoadingBlockComponent],
  templateUrl: './candidat-dashboard.component.html'
})
export class CandidatDashboardComponent implements OnInit {
  concours = signal<Concours[]>([]);
  candidatures = signal<Candidature[]>([]);
  loading = signal(true);

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } }
  };

  statutData = computed<ChartData<'doughnut'>>(() => {
    const labels = ['En attente', 'Dossier complet', 'En attente délibération', 'Admis', 'Refusé'];
    const cles: Array<Candidature['statut']> = ['EN_ATTENTE', 'DOSSIER_COMPLET', 'EN_ATTENTE_DELIBERATION', 'ADMIS', 'REFUSE'];
    const data = cles.map((s) => this.candidatures().filter((c) => c.statut === s).length);
    return {
      labels,
      datasets: [{ data, backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#10b981', '#ef4444'] }]
    };
  });

  constructor(
    private concoursService: ConcoursService,
    private candidatureService: CandidatureService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.concoursService.getAll().subscribe((data) => {
      this.concours.set(data);
      this.loading.set(false);
    });
    this.candidatureService.mesCandidatures().subscribe((data) => this.candidatures.set(data));
  }

  nbAdmis(): number {
    return this.candidatures().filter((c) => c.statut === 'ADMIS').length;
  }
}
