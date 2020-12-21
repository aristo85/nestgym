export class CreateUserDto {
  readonly username: string;
  readonly role: string;
  readonly phone: number;
  readonly email: string;
  readonly password: string;
  // readonly profileId: number;
  readonly searchCoachId: number;
  readonly photosId: number;
}
