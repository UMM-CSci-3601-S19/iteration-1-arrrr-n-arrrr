import { Vehicle } from '../vehicles/vehicle'

export interface User{
  vehicles: Vehicle[];
  email: string;
  phone: string[];
  name: string
}
