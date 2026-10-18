type ServiceKey = string;

export class ServiceProvider {
  private static services = new Map<ServiceKey, unknown>();

  static register<T>(key: ServiceKey, service: T): void {
    this.services.set(key, service);
  }

  static get<T>(key: ServiceKey): T {
    const service = this.services.get(key);

    if (service === undefined) {
      throw new Error(`Service "${key}" is not registered`);
    }

    return service as T;
  }
}
