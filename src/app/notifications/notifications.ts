import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../services/notification-service';
import { NotificationModel } from '../models/notification-model';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private notificationService = inject(NotificationService);

  protected notifications = signal<NotificationModel[]>([]);
  protected nonLues = signal(0);
  protected chargement = signal(true);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.notificationService.getAll().subscribe((res) => {
      this.notifications.set(res.notifications);
      this.nonLues.set(res.non_lues);
      this.chargement.set(false);
    });
  }

  marquerLue(notif: NotificationModel) {
    if (notif.read_at) return; // déjà lue
    this.notificationService.marquerLue(notif.id).subscribe(() => this.charger());
  }
}