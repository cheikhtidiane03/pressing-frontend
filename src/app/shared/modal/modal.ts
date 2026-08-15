import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  titre = input.required<string>();
  fermer = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.fermer.emit();
  }
}