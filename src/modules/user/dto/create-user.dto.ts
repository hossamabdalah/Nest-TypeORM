import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { userType } from "src/utils/enums";

export class CreateUserDto {
    @IsString()
    userName: string;
    @IsString({message:"Email must be a string"})
    email:string
    @IsString({message:"Password must be a string"})
    password:string
    @IsOptional()
    @IsEnum(userType)
    userType:userType
    @IsOptional()
    @IsBoolean()
    isActive:boolean
}
