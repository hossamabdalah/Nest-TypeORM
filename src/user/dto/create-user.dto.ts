import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    firstName: string;
    @IsString({message:"Last name must be a string"})
    lastName:string
    
}
