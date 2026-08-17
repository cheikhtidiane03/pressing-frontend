import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { LoadingBlockComponent } from '../../../shared/components/loading-block/loading-block.component';
import { Utilisateur, RegisterRequest } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-utilisateurs-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoadingBlockComponent],
  templateUrl: './utilisateurs-admin.component.html'
})
export class UtilisateursAdminComponent implements OnInit {
  utilisateurs = signal<Utilisateur[]>([]);
  loading = signal(true);

  modalCreationOuvert = signal(false);
  formCreation: RegisterRequest = { nom: '', prenom: '', username: '', telephone: '', password: '' };

  modalEditionOuvert = signal(false);
  editionId: number | null = null;
  formEdition: Partial<Utilisateur> = { nom: '', prenom: '', username: '', telephone: '' };

  constructor(
    private utilisateurService: UtilisateurService,
    public auth: AuthService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.utilisateurService.getAll().subscribe((data) => {
      this.utilisateurs.set(data);
      this.loading.set(false);
    });
  }

  ouvrirCreation() {
    this.formCreation = { nom: '', prenom: '', username: '', telephone: '', password: '' };
    this.modalCreationOuvert.set(true);
  }

  creer() {
    this.utilisateurService.creerAdmin(this.formCreation).subscribe(() => {
      this.toast.success('Administrateur créé');
      this.modalCreationOuvert.set(false);
      this.charger();
    });
  }

  ouvrirEdition(u: Utilisateur) {
    this.editionId = u.id;
    this.formEdition = { nom: u.nom, prenom: u.prenom, username: u.username, telephone: u.telephone };
    this.modalEditionOuvert.set(true);
  }

  enregistrerEdition() {
    if (this.editionId === null) return;
    this.utilisateurService.update(this.editionId, this.formEdition).subscribe(() => {
      this.toast.success('Utilisateur mis à jour');
      this.modalEditionOuvert.set(false);
      this.charger();
    });
  }

  async supprimer(u: Utilisateur) {
    if (u.username === this.auth.currentUser()?.username) return;

    const confirmed = await this.confirmDialog.confirm({
      title: 'Supprimer cet utilisateur ?',
      message: `Le compte de "${u.prenom} ${u.nom}" (${u.username}) sera définitivement supprimé.`,
      confirmLabel: 'Supprimer',
      danger: true
    });
    if (!confirmed) return;

    this.utilisateurService.delete(u.id).subscribe(() => {
      this.toast.success('Utilisateur supprimé');
      this.charger();
    });
  }
}
