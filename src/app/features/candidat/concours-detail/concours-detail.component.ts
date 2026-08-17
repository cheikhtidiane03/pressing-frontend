import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ConcoursService } from '../../../core/services/concours.service';
import { CandidatureService } from '../../../core/services/candidature.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Concours } from '../../../core/models/concours.model';
import { Candidature } from '../../../core/models/candidature.model';

interface PieceForm {
  type: string;
  label: string;
  icon: string;
  file: File | null;
}

@Component({
  selector: 'app-concours-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SpinnerComponent],
  templateUrl: './concours-detail.component.html'
})
export class ConcoursDetailComponent implements OnInit {
  concours = signal<Concours | null>(null);
  mesCandidature = signal<Candidature | null>(null);
  loading = signal(false);
  concoursId!: number;

  pieces: PieceForm[] = [
    { type: 'CV', label: 'CV', icon: 'file-text', file: null },
    { type: 'PHOTO', label: 'Photo', icon: 'circle-user-round', file: null },
    { type: 'DIPLOME', label: 'Diplôme', icon: 'graduation-cap', file: null }
  ];

  constructor(
    private route: ActivatedRoute,
    private concoursService: ConcoursService,
    private candidatureService: CandidatureService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.concoursId = Number(this.route.snapshot.paramMap.get('id'));
    this.concoursService.getById(this.concoursId).subscribe((data) => this.concours.set(data));

    this.candidatureService.mesCandidatures().subscribe((list) => {
      const found = list.find((c) => c.concours.id === this.concoursId);
      if (found) this.mesCandidature.set(found);
    });
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pieces[index].file = input.files[0];
    }
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

  deposer() {
    const selected = this.pieces.filter((p) => p.file !== null);
    const fichiers = selected.map((p) => p.file as File);
    const types = selected.map((p) => p.type);

    this.loading.set(true);
    this.candidatureService.deposer(this.concoursId, fichiers, types).subscribe({
      next: (candidature) => {
        this.loading.set(false);
        this.toast.success('Candidature envoyée avec succès !');
        this.mesCandidature.set(candidature);
      },
      error: () => this.loading.set(false)
    });
  }
}
