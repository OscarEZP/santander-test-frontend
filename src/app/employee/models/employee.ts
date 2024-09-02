export enum SENIORITY {
  JUNIOR = 'Junior',
  SENIOR = 'Senior'
}

export interface Employee {
  id?: number;
  name: string;
  surname: string;
  seniority: SENIORITY,
  years: number,
  availability: boolean
}
