import { provideRepository } from "../RepositoryProvider.ts";
import type RepositoryInterface from "../RepositoryInterface.ts";
import type EvaluateRequestDTO from "../../dto/EvaluateRequestDTO.ts";
import type EvaluateResponseDTO from "../../dto/EvaluateResponseDTO.ts";
import UserEvaluation from "./UserEvaulation.ts";
import GlobalePoliciesEvaluation from "./GlobalPoliciesEvaluation.ts";
import NotFound from "../../errors/NotFound.ts";

export default class EvaluationService {
    private repo: RepositoryInterface;
    private policiesEvaluation: GlobalePoliciesEvaluation;
    private userEvaluation: UserEvaluation;

    public constructor() {
        this.repo = provideRepository();
    }

    public async evaluate(data: EvaluateRequestDTO): Promise<EvaluateResponseDTO> {
        await this.init(data);

        if (!this.checkGlobalPolicies(data)) {
            return {
                decision: 'deny',
                reason: 'blocked_by_global_policy',
            };
        }
        if (!this.checkUserQuiteHours(data)) {
            return {
                decision: 'deny',
                reason: 'blocked_by_user_quiet_hours',
            };
        }
        if (!this.checkUserPreferences(data)) {
            return {
                decision: 'deny',
                reason: 'blocked_by_user_notification_preferences',
            };
        }

        return { decision: 'allow' };
    }

    private async init(data: EvaluateRequestDTO): Promise<void> {
        await Promise.all([
            this.initGlobalPolicies(),
            this.initUserPreferences(data),
        ]);
    }

    private async initGlobalPolicies() {
        const globalPolicies = await this.repo.globalPolicies.get();
        this.policiesEvaluation = new GlobalePoliciesEvaluation(globalPolicies);
    }

    private async initUserPreferences({ userId }: EvaluateRequestDTO) {
        const user = await this.repo.userPreferences.get(userId);
        if (!user) {
            throw new NotFound('user_not_found');
        }
        this.userEvaluation = new UserEvaluation(user);
    }

    private checkGlobalPolicies({ region, type, channel }: EvaluateRequestDTO): boolean {
        return this.policiesEvaluation.checkPolicies(region, type, channel);
    }

    private checkUserQuiteHours({ datetime, type }: EvaluateRequestDTO): boolean {
        return this.userEvaluation.checkQuietHours(datetime, type);
    }

    private checkUserPreferences({ type, channel }: EvaluateRequestDTO): boolean {
        return this.userEvaluation.checkPreferences(type, channel);
    }
};
