import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getRoot(): string {
    return "IWAI API is running";
  }
}
