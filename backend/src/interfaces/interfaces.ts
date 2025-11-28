
export interface IUser{
    id: string;         // id do documento Firestore
    name: string;
    email: string;
    password: string;   // hash da senha
    role: string;
    [key: string]: any;
}

export interface IJwtPayload {
    id: string;
    name: string;
    role: string;
}

export interface IHabit {
  id?: string;          // id do documento no Firestore
  title: string;
  frequency: string;
  completedToday: boolean;
}
