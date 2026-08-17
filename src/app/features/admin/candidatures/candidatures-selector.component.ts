import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ConcoursService } from '../../../core/services/concours.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Concours } from '../../../core/models/concours.model';

@Component({
  selector: 'app-candidatures-selector',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './candidatures-selector.component.html'
})
export class CandidaturesSelectorComponent implements OnInit {
  concours = signal<Concours[]>([]);
  loading = signal(true);

  constructor(private concoursService: ConcoursService) {}

  ngOnInit() {
    this.concoursService.getAll().subscribe((data) => {
      this.concours.set(data);
      this.loading.set(false);
    });
  }
}
