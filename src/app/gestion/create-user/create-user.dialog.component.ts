import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const URL = 'http://localhost:3000';

export interface DialogData {
  nom: string;
  email: string;
}

interface Utilisateur {
  id?: number;
  nom: string;
  email: string;
}


@Component({
  selector: 'app-create-user.dialog',
  templateUrl: './create-user.dialog.component.html',
  styleUrls: ['./create-user.dialog.component.scss']
})
export class CreateUserDialogComponent {
  utilisateurForm: FormGroup;
  nomFormControl: FormControl;
  emailFormControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.nomFormControl = new FormControl('', Validators.required);
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.utilisateurForm = new FormGroup({
      nomFormControl: this.nomFormControl,
      emailFormControl: this.emailFormControl
    });
  }

  public onSubmit(): void {
    if (this.utilisateurForm.valid) {
      const utilisateur = {
        email: this.utilisateurForm.value.emailFormControl,
        nom: this.utilisateurForm.value.nomFormControl
      };

      this.ajouterUtilisateur(utilisateur);
      this.utilisateurForm.reset();
      this.dialogRef.close(utilisateur);
    }
  }

  public close() {
    this.dialogRef.close();
  }

  public ajouterUtilisateur(utilisateur: Utilisateur): void {
    fetch(`${URL}/utilisateurs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(utilisateur)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Utilisateur ajouté :', data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
      });
  }

}
