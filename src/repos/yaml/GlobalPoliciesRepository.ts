import fs from "fs/promises";
import yaml from "yaml";
import type { GlobalPoliciesRepositoryInterface } from "../../services/RepositoryInterface";
import GlobalPolicies from "../../domain/GlobalPolicies";
import RegionPolicy from "../../domain/RegionPolicy";
import type { NotificationPreferenceValueData } from "../../domain/NotificationPreference";

const configFilePath = 'src/configs/global_policies.yaml';

type FileStructure = {
    [region: string]: NotificationPreferenceValueData;
};

export default class GlobalPoliciesRepository implements GlobalPoliciesRepositoryInterface {
    public async get(): Promise<GlobalPolicies> {
        // todo: нужна валидация и кэширование данных
        const file = await fs.readFile(configFilePath, 'utf-8');
        const data: FileStructure = yaml.parse(file);
        const policies = Object.keys(data).map(region => {
            return new RegionPolicy({ region, ...data[region] });
        })
        return new GlobalPolicies(policies);
    }
}
