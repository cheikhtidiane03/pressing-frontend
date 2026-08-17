import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ConcoursService } from '../../../core/services/concours.service';
import { Concours } from '../../../core/models/concours.model';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';

@Component({
  selector: 'app-concours-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './concours-list.component.html'
})
export class ConcoursListComponent implements OnInit {
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
