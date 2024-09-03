import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { MatDialog } from '@angular/material/dialog';
import { Employee, SENIORITY } from '../employee/models/employee';
import { environment } from 'src/environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all employees', () => {
    // Arrange
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John', surname: 'Doe', seniority: SENIORITY.SENIOR, years: 5, availability: true },
      { id: 2, name: 'Jane', surname: 'Smith', seniority: SENIORITY.JUNIOR, years: 2, availability: false }
    ];

    // Act
    service.getAllEmployees().subscribe(employees => {
      // Assert
      expect(employees.length).toBe(2);
      expect(employees).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should handle error when retrieving employees', () => {
    // Arrange
    const errorMessage = 'Failed to load employees';

    // Act
    service.getAllEmployees().subscribe(
      () => fail('expected an error, not employees'),
      error => {
        // Assert
        expect(error.message).toContain(errorMessage);
        expect(dialogSpy.open).toHaveBeenCalled();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
