import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { AccessRules } from '../../common/models/access-rules';
import { AccessRulesApiRepository } from '../../../infraestructure/api/keycloak/repositories/access-rules.api.repository';
import { ClientApiRepository } from '../../../infraestructure/api/keycloak/repositories/client.api.repository';
import { Client } from '../../common/models/client';
import { AccessRulesDomService } from '../../common/services/access-rules.dom.service';

describe('AccessRulesDomService', () => {
  let service: AccessRulesDomService;
  let accessRulesRepository: AccessRulesApiRepository;
  let clientRepository: ClientApiRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRulesDomService,
        {
          provide: AccessRulesApiRepository,
          useValue: {
            findAccessRulesByRoleName: jest.fn(),
          },
        },
        {
          provide: ClientApiRepository,
          useValue: {
            findOneClientByClientId: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'KC_REALM') return 'msp-nacional';
              if (key === 'KC_CLIENTID') return 'api-rac';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AccessRulesDomService>(AccessRulesDomService);
    accessRulesRepository = module.get<AccessRulesApiRepository>(AccessRulesApiRepository);
    clientRepository = module.get<ClientApiRepository>(ClientApiRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAccessRulesByRoleName', () => {
    it('should return access rules if the role is found in the token', async () => {
      const context = {
        roleName: 'test-role',
        user: {
          resource_access: {
            'api-rac': {
              roles: ['test-role'],
            },
          },
        } as TokenInfo,
      };

      const client = {
        id: 'client-id',
      } as Client;
      const accessRules = {
        filterSimpleAccessRulesForRoles: jest.fn().mockResolvedValue(true),
      } as unknown as AccessRules;

      jest.spyOn(clientRepository, 'findOneClientByClientId').mockResolvedValue(client);
      jest.spyOn(accessRulesRepository, 'findAccessRulesByRoleName').mockResolvedValue(accessRules);

      const result = await service.findAccessRulesByRoleName(context);

      expect(clientRepository.findOneClientByClientId).toHaveBeenCalledWith('msp-nacional', 'api-rac');
      expect(accessRulesRepository.findAccessRulesByRoleName).toHaveBeenCalledWith('msp-nacional', 'api-rac', 'client-id');
      expect(accessRules.filterSimpleAccessRulesForRoles).toHaveBeenCalledWith(['test-role']);
      expect(result).toBe(accessRules);
    });

    it('should throw an exception if the role is not found in the token', async () => {
      const context = {
        roleName: 'test-role',
        user: {
          resource_access: {
            'api-rac': {
              roles: ['other-role'],
            },
          },
        } as TokenInfo,
      };

      await expect(service.findAccessRulesByRoleName(context)).rejects.toThrow(
        new HttpException(`${ErrorMessage.ACCESS_RULES_NOT_FOUND.MSG} test-role`, ErrorMessage.ACCESS_RULES_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the client is not found', async () => {
      const context = {
        roleName: 'test-role',
        user: {
          resource_access: {
            'api-rac': {
              roles: ['test-role'],
            },
          },
        } as TokenInfo,
      };

      jest.spyOn(clientRepository, 'findOneClientByClientId').mockResolvedValue(null);

      await expect(service.findAccessRulesByRoleName(context)).rejects.toThrow(
        new HttpException(ErrorMessage.CLIENT_NOT_FOUND.MSG, ErrorMessage.CLIENT_NOT_FOUND.CODE),
      );
    });
  });
});
