import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { PersonaSoapRepository } from '../../../infraestructure/soap/registro-civil/repositories/persona.soap.repository';
import { PersonSoapDomService } from '../services/person-soap.dom.service';

describe('PersonSoapDomService', () => {
  let service: PersonSoapDomService;
  let personSoapRepository: PersonaSoapRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonSoapDomService,
        {
          provide: PersonaSoapRepository,
          useValue: {
            busquedaPersonaPorNui: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PersonSoapDomService>(PersonSoapDomService);
    personSoapRepository = module.get<PersonaSoapRepository>(PersonaSoapRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPersonData', () => {
    it('should return person data for a given NUI', async () => {
      const nui = '1234567890';
      const personData = { name: 'John Doe', nui: '1234567890' };

      jest.spyOn(personSoapRepository, 'busquedaPersonaPorNui').mockResolvedValue(personData);

      const result = await service.getPersonData(nui);

      expect(result).toBe(personData);
      expect(personSoapRepository.busquedaPersonaPorNui).toHaveBeenCalledWith(nui);
    });

    it('should throw an exception if the person data is not found', async () => {
      const nui = '1234567890';

      jest.spyOn(personSoapRepository, 'busquedaPersonaPorNui').mockResolvedValue(null);

      await expect(service.getPersonData(nui)).rejects.toThrow(
        new HttpException(ErrorMessage.SOAP_PERSON_NOT_FOUND.MSG, ErrorMessage.SOAP_PERSON_NOT_FOUND.CODE),
      );
    });
  });
});
