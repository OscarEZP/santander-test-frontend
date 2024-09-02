import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { EmployeeFormModalComponent } from '../employee-form-modal/employee-form-modal.component';
import { Employee, SENIORITY } from '../models/employee';

const EMPLOYEE_DATA: Employee[] = [
  {id: 1, name: 'John', surname: 'Doe', seniority: SENIORITY.JUNIOR, years: 5, availability: true},
  {id: 2, name: 'Jane', surname: 'Smith', seniority: SENIORITY.JUNIOR, years: 2, availability: false},
  {id: 3, name: 'Mark', surname: 'Brown', seniority: SENIORITY.SENIOR, years: 3, availability: true},
];

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  displayedColumns: string[] = ['name', 'surname', 'seniority', 'years', 'availability','actions'];
  dataSource = EMPLOYEE_DATA;

  constructor(
    public dialog: MatDialog,
    private readonly employeeService: EmployeeService
    ) {}

  ngOnInit(): void {}

  openEmployeeForm(employee = null): void {
    const dialogRef = this.dialog.open(EmployeeFormModalComponent, {
      width: '400px',
      data: employee || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          Object.assign(employee, result);
        } else {
          this.dataSource.push(result);
        }
      }
    });
  }

  deleteEmployee(id: number) {

    const dialogData: ConfirmDialogData = {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this employee?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = this.dataSource.filter(employee => employee.id !== id);
        this.employeeService.deleteEmployee(id)
          .subscribe((result) => {
            console.log(result, 'RESULTADO')
          })
      }
    });
  }
}
