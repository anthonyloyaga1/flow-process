import { SimpleAccessRules } from '../interfaces/access-rules.interface';
import { Settings } from './settings';

export class AccessRules {
  realm: string;
  clientName?: string;
  clientUuid?: string;
  settings: Settings;
  simpleAccessRules: SimpleAccessRules[];

  constructor(data: { realm?: string; clientName?: string; clientUuid?: string; settings?: Settings }) {
    this.realm = data.realm;
    this.clientName = data.clientName;
    this.settings = new Settings(data.settings);
    this.clientUuid = data.clientUuid;
  }

  async reduceAccesRules(roleNames?: string[], groupNames?: string[]) {
    this.simpleAccessRules = await this.settings.reduceAccessRules(roleNames || [], groupNames || []);
  }

  async filterSimpleAccessRulesForRoles(roleNames?: string[]) {
    this.simpleAccessRules = await this.settings.getAccessRulesByRoles(roleNames || []);
  }
}
