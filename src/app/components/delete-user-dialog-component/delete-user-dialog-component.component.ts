import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user-dialog-component',
  templateUrl: './delete-user-dialog-component.component.html',
  styleUrls: ['./delete-user-dialog-component.component.css']
})
export class DeleteUserDialogComponentComponent {

  verificationInput=''

  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ){}

  onCancelClick(): void {
    console.log('CANCEL')
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    console.log('DELETE')
    this.dialogRef.close(true);
  }
}
