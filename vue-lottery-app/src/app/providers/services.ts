import { ServiceProvider } from "@/shared/api/service-provider";
import { UserService } from "@/entities/user/api/user.service";
import { AuthService } from "@/entities/session/api/auth.service";

ServiceProvider.register("users", new UserService());
ServiceProvider.register("auth", new AuthService());

export const userService = ServiceProvider.get<UserService>("users");
export const authService = ServiceProvider.get<AuthService>("auth");
