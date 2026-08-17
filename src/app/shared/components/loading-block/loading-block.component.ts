import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-loading-block',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './loading-block.component.html'
})
export class LoadingBlockComponent {
  @Input() label = 'Chargement...';
}
