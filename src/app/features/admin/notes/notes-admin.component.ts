import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CandidatureService } from '../../../core/services/candidature.service';
import { ConcoursService } from '../../../core/services/concours.service';
import { EpreuveService } from '../../../core/services/epreuve.service';
import { NoteService } from '../../../core/services/note.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Candidature } from '../../../core/models/candidature.model';
import { Concours, Epreuve } from '../../../core/models/concours.model';

@Component({
  selector: 'app-notes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './notes-admin.component.html'
})
export class NotesAdminComponent implements OnInit {
  concours = signal<Concours | null>(null);
  candidatures = signal<Candidature[]>([]);
  epreuves = signal<Epreuve[]>([]);
  loading = signal(true);
  concoursId!: number;

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService,
    private concoursService: ConcoursService,
    private epreuveService: EpreuveService,
    private noteService: NoteService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.concoursId = Number(this.route.snapshot.paramMap.get('id'));
    this.concoursService.getById(this.concoursId).subscribe((c) => this.concours.set(c));
    this.epreuveService.getByConcours(this.concoursId).subscribe((data) => this.epreuves.set(data));
    this.charger();
  }

  charger() {
    this.candidatureService.getByConcours(this.concoursId).subscribe((data) => {
      this.candidatures.set(data);
      this.loading.set(false);
    });
  }

  getNote(c: Candidature, epreuveId: number): number | null {
    const note = c.notes.find((n) => n.epreuve?.id === epreuveId);
    return note ? note.valeur : null;
  }

  // Calcul cote frontend, en direct, a partir des notes deja saisies (meme logique ponderee que le backend)
  moyenneProvisoire(c: Candidature): number | null {
    if (c.notes.length === 0) return null;

    let sommePonderee = 0;
    let sommeCoefficients = 0;

    for (const note of c.notes) {
      const coefficient = note.epreuve?.coefficient ?? 1;
      sommePonderee += note.valeur * coefficient;
      sommeCoefficients += coefficient;
    }

    return sommeCoefficients > 0 ? sommePonderee / sommeCoefficients : null;
  }

  saisirNote(c: Candidature, epreuveId: number, event: Event) {
    const valeur = Number((event.target as HTMLInputElement).value);
    if (isNaN(valeur)) return;

    this.noteService.saisir(c.id, epreuveId, valeur).subscribe(() => {
      this.toast.success('Note enregistrée');
      this.charger();
    });
  }
}
