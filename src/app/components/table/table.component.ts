import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetusersService } from 'src/app/services/getusers.service';
import { DeleteUserDialogComponentComponent } from '../delete-user-dialog-component/delete-user-dialog-component.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit,OnInit {
  displayedColumns: string[] = ['checkbox','id', 'name', 'email', 'role', 'actions'];
  selectedRows: string[] = [];
  dataSource!: MatTableDataSource<UserData>;
  originalData: UserData[] = []; // Store the original data
  displayedItems: UserData[] = [];
  editedUserId: string | null = null;

  @ViewChild(NgModel) ngModel!: NgModel;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _userService: GetusersService,
    private _dialog : MatDialog,
    private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadUserData();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.updateTable());
    this.sort.sortChange.subscribe(() => this.updateTable());
  }

  toggleCheckbox(userId: string): void {
    const index = this.selectedRows.indexOf(userId);
    if (index === -1) {
      this.selectedRows.push(userId);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedRows.includes(userId);
  }

  updateTable() {
    // Apply pagination and sorting to get the currently displayed items
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.displayedItems = this.dataSource.data.slice(startIndex, endIndex);
  }

  selectAll(event: MatCheckboxChange): void {
    this.updateTable()
    if (event.checked) {
      // Select only the visible items
      this.selectedRows = this.displayedItems.map(user => user.id);
    } else {
      this.selectedRows = [];
    }

    this.ngModel.control.setValue(this.selectedRows);
  }

  deleteSelectedRows(): void {
    const dialogRef = this._dialog.open(DeleteUserDialogComponentComponent, {
      data: { userIds: this.selectedRows }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed deletion, implement your delete logic here
        const visibleRowsToDelete = this.displayedItems.filter(user => this.selectedRows.includes(user.id));
        this.dataSource.data = this.dataSource.data.filter(user => !this.selectedRows.includes(user.id));
        this.selectedRows = [];

        console.log('Deleting selected rows:', visibleRowsToDelete);
      } else {
        // User canceled deletion
        console.log('User canceled deletion');
      }
    });
  }

  loadUserData() {
    this._userService.getUsers().subscribe({
      next: data => {
        this.originalData = data; // Save the original data
        this.dataSource = new MatTableDataSource<UserData>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: error => {
        console.log('Error fetching user data:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(userId: string) {
    const userToEdit = this.originalData.find(user => user.id === userId);
    const userToEditIndex = this.originalData.findIndex(user => user.id === userId);

    if (userToEdit) {
      const dialogRef = this._dialog.open(EditUserDialogComponent, {
        data: { user: userToEdit }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && !result.canceled) {
          // User confirmed edit, update the data locally
          this.dataSource.data = this.dataSource.data.map(user =>
            user.id === userId ? result.updatedUser : user
          );
          this.originalData[userToEditIndex] = result.updatedUser;
          console.log('Updating user with ID:', userId);
        } else {
          // User canceled edit
          console.log('User canceled edit');
        }
      });
    }
  }

  // editUser(userId: string) {
  //   // Set the currently edited user ID
  //   this.editedUserId = userId;
  // }

  // saveEdit(userId: string, newName: string, newEmail: string, newRole: string) {
  //   // Implement your logic to save the edited user data
  //   console.log('Saving edit for user with ID:', userId);
  //   const updatedData = this.dataSource.data.map(user =>
  //     user.id === userId
  //       ? { ...user, name: newName, email: newEmail, role: newRole }
  //       : user
  //   );
  //   this.dataSource.data = updatedData;
  //   // Reset the editedUserId to exit edit mode
  //   this.editedUserId = null;
  // }

  cancelEdit() {
    // Reset the editedUserId to exit edit mode
    this.editedUserId = null;
  }

  deleteUser(userId: string) {
    const dialogRef = this._dialog.open(DeleteUserDialogComponentComponent, {
      data: { userId: userId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed deletion, implement your delete logic here
        this.dataSource.data = this.dataSource.data.filter(user => user.id !== userId);
        console.log('Deleting user with ID:', userId);
      } else {
        // User canceled deletion
        console.log('User canceled deletion');
      }
    });
  }

}
