import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ConcoursService } from '../../../core/services/concours.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { SalleService } from '../../../core/services/salle.service';
import { Concours } from '../../../core/models/concours.model';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, NgChartsModule, LoadingBlockComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  concours = signal<Concours[]>([]);
  nbUtilisateurs = signal(0);
  nbSalles = signal(0);
  loading = signal(true);

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } }
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  doughnutData = computed<ChartData<'doughnut'>>(() => {
    const publies = this.concours().filter((c) => c.resultatsPublies).length;
    const enCours = this.concours().length - publies;
    return {
      labels: ['En cours', 'Résultats publiés'],
      datasets: [{ data: [enCours, publies], backgroundColor: ['#3b82f6', '#10b981'] }]
    };
  });

  barData = computed<ChartData<'bar'>>(() => ({
    labels: this.concours().map((c) => c.titre.length > 15 ? c.titre.slice(0, 15) + '…' : c.titre),
    datasets: [{ label: 'Épreuves', data: this.concours().map((c) => c.epreuves.length), backgroundColor: '#2563eb', borderRadius: 6 }]
  }));

  constructor(
    private concoursService: ConcoursService,
    private utilisateurService: UtilisateurService,
    private salleService: SalleService
  ) {}

  ngOnInit() {
    this.concoursService.getAll().subscribe((data) => {
      this.concours.set(data);
      this.loading.set(false);
    });
    this.utilisateurService.getAll().subscribe((data) => this.nbUtilisateurs.set(data.length));
    this.salleService.getAll().subscribe((data) => this.nbSalles.set(data.length));
  }
}
