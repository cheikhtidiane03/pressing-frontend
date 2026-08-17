import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  options = signal<ConfirmOptions | null>(null);
  private resolver: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.options.set(options);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  respond(value: boolean): void {
    this.options.set(null);
    this.resolver?.(value);
    this.resolver = null;
  }
}
