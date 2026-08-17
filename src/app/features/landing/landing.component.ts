import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ThemeToggleComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  mobileMenuOpen = signal(false);

  fonctionnalites = [
    {
      icon: 'file-text',
      titre: 'Dépôt en ligne',
      description: 'Le candidat dépose sa candidature avec CV, photo et diplôme en quelques minutes, sans se déplacer.'
    },
    {
      icon: 'search',
      titre: 'Suivi en temps réel',
      description: "Chaque candidature affiche son statut exact : en attente, dossier complet, ou décision finale."
    },
    {
      icon: 'pencil',
      titre: 'Saisie sécurisée des notes',
      description: "Interface dédiée pour saisir les notes par épreuve, réservée aux administrateurs."
    },
    {
      icon: 'send',
      titre: 'Publication des résultats',
      description: "Un clic calcule les moyennes pondérées et publie les résultats Admis/Liste d'attente."
    },
    {
      icon: 'door-open',
      titre: 'Répartition en salles',
      description: "Affectation automatique des candidats aux salles d'examen selon leur capacité."
    },
    {
      icon: 'bar-chart-3',
      titre: 'Tableaux de bord',
      description: "Statistiques et graphiques en direct pour suivre l'activité de chaque concours."
    }
  ];

  etapes = [
    { numero: '1', titre: 'Créer un compte', description: 'Inscription en quelques secondes avec email ou téléphone.' },
    { numero: '2', titre: 'Choisir un concours', description: 'Parcourir les concours ouverts et leurs conditions.' },
    { numero: '3', titre: 'Déposer sa candidature', description: 'Upload des pièces justificatives requises.' },
    { numero: '4', titre: 'Suivre et consulter', description: 'Statut en temps réel, puis résultat final publié.' }
  ];

  faqs = signal([
    { question: 'SunuXam est-il gratuit pour les candidats ?', reponse: "Oui, l'inscription et le dépôt de candidature sont entièrement gratuits.", ouvert: false },
    { question: 'Comment savoir si mon dossier est complet ?', reponse: "Le statut de votre candidature est visible en temps réel dans votre espace candidat, mis à jour par l'administration.", ouvert: false },
    { question: 'Quand les résultats sont-ils disponibles ?', reponse: "Dès que l'administrateur du concours publie les résultats, généralement après la date de délibération indiquée.", ouvert: false },
    { question: 'Puis-je postuler à plusieurs concours ?', reponse: "Oui, vous pouvez déposer une candidature pour chaque concours ouvert qui vous intéresse.", ouvert: false }
  ]);

  toggleFaq(index: number) {
    this.faqs.update((list) =>
      list.map((f, i) => (i === index ? { ...f, ouvert: !f.ouvert } : f))
    );
  }
}
