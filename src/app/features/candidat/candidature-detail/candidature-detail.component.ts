import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CandidatureService } from '../../../core/services/candidature.service';
import { AffectationService } from '../../../core/services/affectation.service';
import { Candidature } from '../../../core/models/candidature.model';
import { Affectation } from '../../../core/models/salle.model';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './candidature-detail.component.html'
})
export class CandidatureDetailComponent implements OnInit {
  candidature = signal<Candidature | null>(null);
  affectation = signal<Affectation | null>(null);

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService,
    private affectationService: AffectationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.candidatureService.getById(id).subscribe((c) => {
      this.candidature.set(c);
      this.affectationService.monAffectation(c.concours.id).subscribe({
        next: (a) => this.affectation.set(a),
        error: () => {}
      });
    });
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      DOSSIER_COMPLET: 'Dossier complet',
      EN_ATTENTE_DELIBERATION: 'En attente de délibération',
      ADMIS: 'Admis',
      REFUSE: 'Refusé'
    };
    return labels[statut] ?? statut;
  }

  statutClass(statut: string): string {
    const classes: Record<string, string> = {
      EN_ATTENTE: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
      DOSSIER_COMPLET: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
      EN_ATTENTE_DELIBERATION: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
      ADMIS: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      REFUSE: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
    };
    return classes[statut] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  }
}
