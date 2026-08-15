import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotificationModel } from '../models/notification-model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private httpClient = inject(HttpClient);

  API_URL = `${environment.apiUrl}/notifications`;

  getAll() {
    return this.httpClient.get<{ notifications: NotificationModel[]; non_lues: number }>(
      this.API_URL
    );
  }

  marquerLue(id: string) {
    return this.httpClient.patch(`${this.API_URL}/${id}/lue`, {});
  }
}
