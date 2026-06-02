import type GlobalPolicies from "../../domain/GlobalPolicies";
import type { NotificationType, NotificationChannel } from "../../domain/NotificationPreference";

export default class GlobalePoliciesEvaluation {
    private globalPolicies: GlobalPolicies;

    public constructor(globalPolicies: GlobalPolicies) {
        this.globalPolicies = globalPolicies;
    }

    public checkPolicies(region: string, type: NotificationType, channel: NotificationChannel): boolean {
        const policy = this.globalPolicies.getPolicy(region, type, channel);
        if (!policy) return true;
        return policy.preference.enabled;
    }
}
