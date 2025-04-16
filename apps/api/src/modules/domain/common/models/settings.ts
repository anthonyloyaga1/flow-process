import { SimpleAccessRules } from '../interfaces/access-rules.interface';
import { ProvidersEnum } from '../enums/providers.enum';

export class Settings {
  allowRemoteResourceManagement: boolean;
  policyEnforcementMode: string;
  decisionStrategy: string;
  resources: any[];
  policies: any[];
  scopes: any[];

  constructor(data: {
    allowRemoteResourceManagement: boolean;
    policyEnforcementMode: string;
    decisionStrategy: string;
    resources: any[];
    policies: any[];
    scopes: any[];
  }) {
    this.allowRemoteResourceManagement = data?.allowRemoteResourceManagement;
    this.policyEnforcementMode = data?.policyEnforcementMode;
    this.decisionStrategy = data?.decisionStrategy;
    this.resources = data?.resources;
    this.policies = data?.policies;
    this.scopes = data?.scopes;
  }

  async reduceAccessRules(roleNames: string[], groupNames: string[]) {
    const policyNames = await this.getPolicyNamesForRolesAndGroups(roleNames, groupNames);
    const permissions = await this.getPermissionsByRoles(policyNames);
    return this.mergePermissionsForResource(permissions);
  }

  async getAccessRulesByRoles(roleNames: string[]) {
    const rolePolicies = this.getRolePolicies(roleNames);
    const permissions = await this.getPermissions(rolePolicies);
    const merged = this.mergePermissionsForResource(permissions);
    return merged;
  }

  private async getPolicyNamesForRolesAndGroups(roleNames: string[], groupNames: string[]) {
    const rolePolicies = this.getRolePolicies(roleNames);
    const groupPolicies = this.getGroupPolicies(groupNames);
    const policyNames = [...rolePolicies, ...groupPolicies];
    return policyNames;
  }

  private getRolePolicies(roleNames: string[]): string[] {
    return this.policies
      .filter((policy) => policy.type === ProvidersEnum.Role && roleNames.some((role) => policy.config.roles.includes(role)))
      .map((policy) => policy.name);
  }

  private getGroupPolicies(groupNames: string[]): string[] {
    return this.policies
      .filter((policy) => policy.type === ProvidersEnum.Group && groupNames.some((group) => policy.config.groups.includes(group)))
      .map((policy) => policy.name);
  }

  private async getPermissions(policyNames: string[]): Promise<SimpleAccessRules[]> {
    const permissions: SimpleAccessRules[] = [];
    for (const policy of this.policies) {
      if (
        (policy.type === ProvidersEnum.Scope || policy.type === ProvidersEnum.Resource) &&
        policy.config.applyPolicies &&
        policyNames.some((policyName) => policy.config.applyPolicies.includes(policyName))
      ) {
        const { resources, scopes } = policy.config;
        permissions.push({ rsname: JSON.parse(resources)[0], scopes: scopes ? JSON.parse(scopes) : ['all'] });
      }
    }
    return permissions;
  }

  private async getPermissionsByRoles(policyNames: string[]): Promise<SimpleAccessRules[]> {
    const permissions: SimpleAccessRules[] = [];
    for (const policy of this.policies) {
      if (
        (policy.type === ProvidersEnum.Scope || policy.type === ProvidersEnum.Resource) &&
        policy.config.applyPolicies &&
        policyNames.some((policyName) => policy.config.applyPolicies.includes(policyName))
      ) {
        const { resources, scopes } = policy.config;
        permissions.push({ rsname: JSON.parse(resources)[0], scopes: JSON.parse(scopes) });
      }
    }
    return permissions;
  }

  private mergePermissionsForResource(permission: SimpleAccessRules[]): SimpleAccessRules[] {
    const mergedPermissions: SimpleAccessRules[] = permission.reduce((acc, curr) => {
      const index = acc.findIndex((item) => item.rsname && curr.rsname && item.rsname === curr.rsname);
      if (index === -1) acc.push(curr);
      else acc[index].scopes = Array.from(new Set([...(acc[index].scopes || []), ...(curr.scopes || [])]));
      return acc;
    }, []);
    return mergedPermissions;
  }
}
