import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaiementModel } from '../models/paiement-model';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private httpClient = inject(HttpClient);

  encaisser(ticketId: number, mode: string = 'especes') {
    return this.httpClient.post<{ paiement: PaiementModel; message: string }>(
      `${environment.apiUrl}/tickets/${ticketId}/paiement`,
      { mode }
    );
  }
}
