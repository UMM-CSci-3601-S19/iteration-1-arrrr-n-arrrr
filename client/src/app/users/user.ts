import { Vehicle } from '../vehicles/vehicle'

export interface User{
  user_id: string;
  vehicles: Vehicle[]; // is an id value in the seed for testing
  email: string;
  phone: string[];
  name: string
}
