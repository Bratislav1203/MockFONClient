export class Exam {
  constructor(
    public id: number,
    public subject: string,
    public date: string,
    public time: string,
    public price: number,
    public registrationStart: string,
    public registrationEnd: string
  ) {}
}
