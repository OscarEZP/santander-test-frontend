import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<EmployeeFormModalComponent>
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
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.employeeForm.reset();
    this.file = null;
    this.dialogRef.close();
  }
}
