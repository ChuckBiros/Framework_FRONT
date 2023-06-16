import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateDepenseDialogComponent } from './create-depense/create-depense.dialog.component';
import { DatePipe } from '@angular/common';
import { CreateUserDialogComponent } from './create-user/create-user.dialog.component';

const URL = 'http://localhost:3000';

interface Depense {
  id: number;
  montant: number;
  description: string;
  utilisateur_id: number;
  categorie_id: number;
  date_paiement: Date;
}

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
}

interface Categorie {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  public utilisateurs: Utilisateur[] = [];
  depenses: Depense[] = [];
  categories: Categorie[] = [];

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, public datepipe: DatePipe) {
    this.categories = [
      { id: 1, nom: 'Nourriture' },
      { id: 2, nom: 'Loyer' },
      { id: 3, nom: 'Services publics' }
    ];
  }


  public ngOnInit(): void {
    fetch(`${URL}/utilisateurs`)
      .then(response => response.json())
      .then(data => {
        this.utilisateurs = data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });

    fetch(`${URL}/depenses`)
      .then(response => response.json())
      .then(data => {
        this.depenses = data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des dépenses:', error);
      });
  }

  public supprimerUtilisateur(utilisateurId: number) {
    fetch(`${URL}/utilisateurs/${utilisateurId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          this.utilisateurs = this.utilisateurs.filter(utilisateur => utilisateur.id != utilisateurId)
        } else {
          console.error('Erreur lors de la suppression de l\'utilisateur:', response.status);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      });
  }

  public openUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.utilisateurs.push(result);
      }
    });
  }

  public openDetail(utilisateur: Utilisateur): void {
    this.router.navigate(['/details'], { relativeTo: this.route, state: { 'utilisateur': utilisateur } });
  }

  public openDepenseDialog(): void {
    const dialogRef = this.dialog.open(CreateDepenseDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datepipe.transform(result.date_paiement, 'yyyy/MM/dd')
        this.depenses.push(result);
      }
    });
  }

  public getUtilisateurName(utilisateurId: number): string {
    return this.utilisateurs.find(utilisateur => utilisateur.id === utilisateurId)?.nom ?? '';;
  }

  public getCategorieName(categorieId: number): string {
    return this.categories.find(categorie => categorie.id === categorieId)?.nom ?? '';
  }
}
