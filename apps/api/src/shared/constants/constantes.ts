import * as packageInfo from '../../../package.json';

export class Constantes {
  public static readonly API_VERSION = packageInfo.version;
  public static readonly API_NAME = packageInfo.name;
  public static readonly API_DESC = packageInfo.description;
  public static readonly API_TITLE = packageInfo.title;

  public static readonly MSG_DELETED_OK = 'Dato eliminado correctamente';
}
