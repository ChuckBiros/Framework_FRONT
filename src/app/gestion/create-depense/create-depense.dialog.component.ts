import { Component, Inject } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const URL = 'http://localhost:3000';

export interface DialogData {
  montant: number;
  description: string;
  utilisateur_id: number;
  categorie_id: number;
  date_paiement: Date;
}

interface Depense {
  id?: number;
  montant: number;
  description: string;
  utilisateur_id: number;
  categorie_id: number;
  date_paiement: Date;
}

interface Categorie {
  id: number;
  nom: string;
}

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
}

@Component({
  selector: 'app-create-depense.dialog',
  templateUrl: './create-depense.dialog.component.html',
  styleUrls: ['./create-depense.dialog.component.scss']
})
export class CreateDepenseDialogComponent {
  depenseFormGroup: FormGroup;
  montantFormControl: FormControl;
  descriptionFormControl: FormControl;
  utilisateurIdFormControl: FormControl;
  categorieIdFormControl: FormControl;
  datePaiementFormControl: FormControl;

  categories: Categorie[];
  utilisateurs: Utilisateur[];

  constructor(
    public dialogRef: MatDialogRef<CreateDepenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.categories = [
      { id: 1, nom: 'Nourriture' },
      { id: 2, nom: 'Loyer' },
      { id: 3, nom: 'Services publics' }
    ];
    this.utilisateurs = [];
    fetch(`${URL}/utilisateurs`)
      .then(response => response.json())
      .then(data => {
        this.utilisateurs = data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });

    this.montantFormControl = new FormControl('', Validators.required);
    this.descriptionFormControl = new FormControl('', Validators.required);
    this.utilisateurIdFormControl = new FormControl('', Validators.required);
    this.categorieIdFormControl = new FormControl('', Validators.required);
    this.datePaiementFormControl = new FormControl('', Validators.required);
    this.depenseFormGroup = new FormGroup({
      montantFormControl: this.montantFormControl,
      descriptionFormControl: this.descriptionFormControl,
      utilisateurIdFormControl: this.utilisateurIdFormControl,
      categorieIdFormControl: this.categorieIdFormControl,
      datePaiementFormControl: this.datePaiementFormControl
    });
  }

  public onSubmit(): void {
    if (this.depenseFormGroup.valid) {
      const depense = {
        montant: this.depenseFormGroup.value.montantFormControl,
        description: this.depenseFormGroup.value.descriptionFormControl,
        utilisateur_id: this.depenseFormGroup.value.utilisateurIdFormControl,
        categorie_id: this.depenseFormGroup.value.categorieIdFormControl,
        date_paiement: this.depenseFormGroup.value.datePaiementFormControl,
      };

      this.ajouterDepense(depense);
      this.depenseFormGroup.reset();
      this.dialogRef.close(depense);
    }
  }

  public close() {
    this.dialogRef.close();
  }

  public ajouterDepense(depense: Depense): void {
    fetch(`${URL}/depenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(depense)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Depense ajouté :', data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la depense :', error);
      });
  }

}
