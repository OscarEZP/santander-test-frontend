import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogData, AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employee-form-modal',
  templateUrl: './employee-form-modal.component.html',
  styleUrls: ['./employee-form-modal.component.scss']
})
export class EmployeeFormModalComponent {
  employeeForm: FormGroup;
  file: File | null = null;
  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeFormModalComponent>,
    public dialog: MatDialog,
    public employeeService: EmployeeService,
    public snackBarRef: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];

      const validExtensions = ['csv', 'xlsx', 'xls'];
      const fileExtension = this.file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && validExtensions.includes(fileExtension)) {
        this.fileError = null;
      } else {
        this.fileError = 'Invalid file type. Please upload a CSV or Excel file.';
        this.file = null;
      }
    }
  }

  onSubmit() {
    if (this.employeeForm.valid && this.file) {
      const formData = new FormData();
      formData.append('name', this.employeeForm.get('name')?.value);
      formData.append('surname', this.employeeForm.get('surname')?.value);
      formData.append('file', this.file);
      this.employeeService.uploadEmployeeData(formData)
        .subscribe((response: Employee) => {
          this.dialogRef.close(formData);
          this.snackBarRef.open(`Employee ${response.name} ${response.surname} was created`, 'Close');
        })
    }
  }

  onCancel() {
    this.employeeForm.reset();
    this.file = null;
    this.dialogRef.close();
  }

  showError(message: string): void {
    const dialogData: AlertDialogData = { message };
    this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: dialogData
    });
  }
}
