import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as qs from 'qs';
import { firstValueFrom, map } from 'rxjs';

import { ErrorMessage } from '../../../../../shared/constants/error-messages';
import { urlGetToken } from './keycloak-api.endpoints';
import { handlerAxiosErrors } from './keycloak-api.errors';
import { Data, Token } from './keycloak-api.interface';

type ApiRequestConfig = {
  url: string;
  accessToken?: string;
  params?;
  body?;
};

@Injectable()
export class KeycloakApiService {
  private token: Token;
  private retryCount = 0;
  readonly urlToken = urlGetToken(this.config.get('KC_REALM'));

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  private setToken(token: Token) {
    this.token = token;
  }

  getBearerToken() {
    if (this.token?.access_token) return `Bearer ${this.token.access_token}`;
  }

  private async fetchValidToken(accessToken: string) {
    if (accessToken) return accessToken;

    const now = new Date();
    if (!this.token || now >= this.token.expiresAt) await this.createToken();

    return this.getBearerToken();
  }

  private async createToken() {
    const body = qs.stringify({
      client_id: this.config.get('KC_CLIENTID'),
      client_secret: this.config.get('KC_SECRET'),
      grant_type: 'client_credentials',
    });
    const token = await this.authentication<Token>({ url: this.urlToken, body });
    this.setTokenExpiration(token);
    this.setToken(token);
  }

  private setTokenExpiration(token: Token) {
    //* 30 seconds before the token expires
    token.expiresAt = new Date(Date.now() + (token.expires_in - 30) * 1000);
  }

  private async authentication<T>(apiInfo: { url: string; body?: any }): Promise<T> {
    try {
      const { url, body } = apiInfo;
      return await firstValueFrom(this.httpService.post<T>(url, body).pipe(map((response) => response.data)));
    } catch (error) {
      const axiosError = error as AxiosError<Data>;
      handlerAxiosErrors(axiosError);
    }
  }

  async permissions<T>(apiInfo: { url: string; accessToken: string; body?: any }): Promise<AxiosResponse<T>> {
    try {
      const { url, accessToken, body } = apiInfo;
      const headers: AxiosRequestConfig = { headers: { Authorization: accessToken } };
      const response = await firstValueFrom(this.httpService.post<T>(url, body, headers));
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<Data>;
      handlerAxiosErrors(axiosError);
    }
  }

  private async retryTokenUnauthorized() {
    if (this.retryCount >= 3) throw new HttpException(`${ErrorMessage.API_ERROR.MSG}. No se pudo obtener el token`, ErrorMessage.API_ERROR.CODE);
    await this.createToken();
    this.retryCount++;
  }

  async get<T>({ url, accessToken, params }: ApiRequestConfig): Promise<AxiosResponse<T>> {
    try {
      accessToken = await this.fetchValidToken(accessToken);
      const headers: AxiosRequestConfig = { headers: { Authorization: accessToken }, params };
      const response = await firstValueFrom(this.httpService.get<T>(url, headers));
      return response;
    } catch (error) {
      handlerAxiosErrors(error);
    }
  }

  async post<T>({ url, accessToken, params, body }: ApiRequestConfig): Promise<AxiosResponse<T>> {
    try {
      accessToken = await this.fetchValidToken(accessToken);
      const headers: AxiosRequestConfig = { headers: { Authorization: accessToken }, params };
      const response = await firstValueFrom(this.httpService.post<T>(url, body, headers));
      return response;
    } catch (error) {
      handlerAxiosErrors(error);
    }
  }

  async put<T>({ url, accessToken, params, body }: ApiRequestConfig): Promise<AxiosResponse<T>> {
    try {
      accessToken = await this.fetchValidToken(accessToken);
      const headers: AxiosRequestConfig = { headers: { Authorization: accessToken }, params };
      const response = await firstValueFrom(this.httpService.put<T>(url, body, headers));
      return response;
    } catch (error) {
      handlerAxiosErrors(error);
    }
  }

  async delete<T>({ url, accessToken, params }: ApiRequestConfig): Promise<AxiosResponse<T>> {
    try {
      accessToken = await this.fetchValidToken(accessToken);
      const headers: AxiosRequestConfig = { headers: { Authorization: accessToken }, params };
      const response = await firstValueFrom(this.httpService.delete<T>(url, headers));
      return response;
    } catch (error) {
      handlerAxiosErrors(error);
    }
  }
}
