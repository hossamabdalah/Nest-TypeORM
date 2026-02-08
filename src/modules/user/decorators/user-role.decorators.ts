import { SetMetadata } from "@nestjs/common";
import { userType } from "src/utils/enums";


export const Roles=(...roles:userType[])=>SetMetadata('roles',roles )