import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'; // Import Angular forms
import { UserData } from '../table/table.component';

export interface EditUserDialogData {
  user: UserData;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent {
  editForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserDialogData
  ) {
    this.editForm = new FormGroup({
      name: new FormControl(data.user.name, [Validators.required]),
      email: new FormControl(data.user.email, [Validators.required, Validators.email]),
      role: new FormControl(data.user.role, [Validators.required]),
    });
  }

  onCancelClick(): void {
    // Set the form controls to their original values
    this.editForm.patchValue({
      name: this.data.user.name,
      email: this.data.user.email,
      role: this.data.user.role,
    });
    this.dialogRef.close(null); // Pass 'false' to indicate cancellation
  }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser: UserData = {
        id: this.data.user.id,
        name: this.editForm.value.name,
        email: this.editForm.value.email,
        role: this.editForm.value.role,
      };
      this.dialogRef.close({ updatedUser: updatedUser, canceled: false });
    }
  }

}
