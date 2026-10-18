import { ServiceProvider } from "@/shared/api";
import { UserService } from "@/entities/user";
import { AuthService } from "@/entities/session";

ServiceProvider.register("users", new UserService());
ServiceProvider.register("auth", new AuthService());

export const userService = ServiceProvider.get<UserService>("users");
export const authService = ServiceProvider.get<AuthService>("auth");

