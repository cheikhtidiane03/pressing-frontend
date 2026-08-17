import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}
}
