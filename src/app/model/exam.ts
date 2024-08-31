export class Exam {
  constructor(
    public id: number,
    public name: string,
    public date: string,
    public time: string,
    public price: number,
    public registrationStart?: string,
    public registrationEnd?: string
  ) {}
}
