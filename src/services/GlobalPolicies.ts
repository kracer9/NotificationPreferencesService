import type RegionPolicy from "../domain/RegionPolicy.ts";
import type RepositoryInterface from "./RepositoryInterface.ts";
import { provideRepository } from "./RepositoryProvider.ts";

export default class GlobalPoliciesService {
    private repo: RepositoryInterface;

    public constructor() {
        this.repo = provideRepository();
    }

    public async getPolicies(): Promise<RegionPolicy[]> {
        const globalPolicies = await this.repo.getGlobalPolicies();
        return globalPolicies.getPolicies();
    }
}
