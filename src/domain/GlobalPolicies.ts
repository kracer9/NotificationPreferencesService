import type RegionPolicy from "./RegionPolicy.ts";
import type { RegionPolicySymbol } from "./RegionPolicy.ts";
import type { NotificationChannel, NotificationType } from "./NotificationPreference.ts";

export default class GlobalPolicies {
    private policies: Map<RegionPolicySymbol, RegionPolicy>;

    public constructor(policies: RegionPolicy[]) {
        this.setPolicies(policies);
    }

    public setPolicies(policies: RegionPolicy[]) {
        this.policies = new Map(policies.map(policy => {
            return [policy.symbol, policy];
        }));
    }

    public getPolicies(): RegionPolicy[] {
        return [...this.policies.values()];
    }

    public getPolicy(
        region: string,
        type: NotificationType,
        channel: NotificationChannel,
    ): RegionPolicy | undefined {
        return this.policies.get(`${region}_${type}_${channel}`);
    }
}
