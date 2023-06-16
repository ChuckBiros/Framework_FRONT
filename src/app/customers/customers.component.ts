import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const URL = 'http://localhost:3000';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
}

interface Depense {
  id: number;
  montant: number;
  description: string;
  utilisateur_id: number;
  categorie_id: number;
  date_paiement: Date;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public state: {
    utilisateur: Utilisateur,
  };

  depenses: Depense[] = [];
  userPaiements: number[] = [];
  sumAllPaiements: number = 0;
  sumUserPaiements: number = 0;
  allPaiements: number[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    this.state = navigation?.extras.state as {
      utilisateur: Utilisateur,
    };
  }

  ngOnInit(): void {
    fetch(`${URL}/depenses`)
      .then(response => response.json())
      .then(data => {
        this.depenses = data;
        this.userPaiements = this.depenses.filter(depense => depense.utilisateur_id === this.state?.utilisateur.id).map(depense => parseInt(depense.montant.toString()));
        this.sumUserPaiements = this.userPaiements.reduce((a, b) => a + b, 0);

        this.allPaiements = this.depenses.map(depense => parseInt(depense.montant.toString()));
        this.sumAllPaiements = this.allPaiements.reduce((a, b) => a + b, 0);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  }
}
