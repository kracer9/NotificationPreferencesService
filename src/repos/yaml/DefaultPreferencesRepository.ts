import fs from "fs/promises";
import yaml from "yaml";
import type { DefaultPreferencesRepositoryInterface } from "../../services/RepositoryInterface.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import DefaultPreference from "../../domain/DefaultPreference.ts";
import type { NotificationPreferenceValueData } from "../../domain/NotificationPreference.ts";

const configFilePath = 'src/configs/default_preferences.yaml';

type FileStructure = NotificationPreferenceValueData[];

export default class DefaultPreferencesRepository implements DefaultPreferencesRepositoryInterface {
    public async get(): Promise<DefaultPreferences> {
        // todo: нужна валидация и кэширование данных
        const file = await fs.readFile(configFilePath, 'utf-8');
        const data: FileStructure = yaml.parse(file);
        const preferences = data.map(item => new DefaultPreference(item));
        return new DefaultPreferences(preferences);
    }
}
