import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ThemeService } from '../services/theme-service';

interface FaqItem {
  question: string;
  reponse: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected authService = inject(AuthService);
  protected themeService = inject(ThemeService);

  protected faqOuverte = signal<number | null>(0);

  protected faqs: FaqItem[] = [
    {
      question: 'Dois-je créer un compte pour déposer une commande ?',
      reponse:
        "Oui. Un compte client gratuit te permet de déposer tes commandes, suivre leur statut en direct et recevoir les notifications par email.",
    },
    {
      question: 'Comment est calculé le prix de ma commande ?',
      reponse:
        "Chaque service a un prix unitaire fixe. Le total de ta commande dépend des services choisis et des quantités indiquées.",
    },
    {
      question: 'Quand dois-je payer ma commande ?',
      reponse:
        "Le paiement peut être enregistré par le gestionnaire au moment du dépôt ou au moment du retrait, selon la politique du pressing.",
    },
    {
      question: 'Comment savoir quand ma commande est prête ?',
      reponse:
        "Tu reçois automatiquement un email dès que ton ticket passe au statut « Prêt », avec le reçu PDF en pièce jointe.",
    },
  ];

  toggleFaq(index: number) {
    this.faqOuverte.set(this.faqOuverte() === index ? null : index);
  }
}