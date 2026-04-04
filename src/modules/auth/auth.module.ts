import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../users/user.service";


@Module({
  imports: [UserService],
  exports:[],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule{}