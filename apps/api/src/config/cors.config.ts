import { envValue } from '../shared/helpers/handler-env-value';

export const enabledCorsCustomConfig = {
  exposedHeaders: 'X-Request-ID',
  origin: envValue('ALLOWED_CORS', true),
  methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};
