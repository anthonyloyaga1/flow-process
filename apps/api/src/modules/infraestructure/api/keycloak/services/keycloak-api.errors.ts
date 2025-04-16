import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

import { ErrorMessage } from '../../../../../shared/constants/error-messages';
import { Data } from './keycloak-api.interface';

export function handlerAxiosErrors(error: AxiosError<Data>) {
  const statusResponse = error.response ? error.response?.status : null;
  const message = error.response ? error.response?.data?.error : error.message;
  Logger.log(error.response?.data);

  switch (statusResponse) {
    case HttpStatus.UNAUTHORIZED: {
      const errorDescription = error.response.data?.error_description || error.response.data?.errorMessage || message || 'Unauthorized ';
      Logger.warn(errorDescription);
      throw new HttpException(errorDescription, HttpStatus.UNAUTHORIZED, { cause: error });
    }
    case HttpStatus.CONFLICT: {
      const errorDescription = error.response.data?.error_description || error.response.data?.errorMessage || message || 'Already exists';
      Logger.warn(errorDescription);
      throw new HttpException(errorDescription, HttpStatus.CONFLICT, { cause: error });
    }
    case HttpStatus.NOT_FOUND: {
      const errorDescription = error.response.data?.error_description || error.response.data?.errorMessage || message || 'Not found';
      Logger.warn(errorDescription);
      throw new HttpException(errorDescription, HttpStatus.NOT_FOUND, { cause: error });
    }
    case HttpStatus.BAD_REQUEST: {
      const errorDescription = error.response.data?.error_description || error.response.data?.errorMessage || message || 'Bad request';
      Logger.warn(errorDescription);
      throw new HttpException(errorDescription, HttpStatus.BAD_REQUEST, { cause: error });
    }
    default:
      throw new HttpException(ErrorMessage.API_ERROR.MSG, ErrorMessage.API_ERROR.CODE, { cause: error });
  }
}
