import { User } from '../users/user'

export interface Ride {
  _id: string;
  driver: {User, Vehicle}
  riders: User[]
  destination: string;
  origin: string;
  roundTrip: boolean;
  departureTime: Date;
  notes: string;
  driving: boolean;
}
