export const StageProcessesEnum = {
  RECEPCION_DOCUMENTAL: 1,
  REVISION_DOCUMENTAL: 2,
  CONTROL_TECNICO_MEDICO: 3,
  REVISION_TARIFAS: 4,
  ENVIO_A_PRESUPUESTO: 5,
  ENVIO_A_PAGO: 6,
  CUR_POR_DISPARAR: 7,
  FINALIZADO: 8,
};

export const StageProcessesMessages = {
  [StageProcessesEnum.RECEPCION_DOCUMENTAL]: 'RECEPCIÓN DOCUMENTAL',
  [StageProcessesEnum.REVISION_DOCUMENTAL]: 'REVISIÓN DOCUMENTAL',
  [StageProcessesEnum.CONTROL_TECNICO_MEDICO]: 'CONTROL TÉCNICO MÉDICO',
  [StageProcessesEnum.REVISION_TARIFAS]: 'REVISIÓN DE TARIFAS',
  [StageProcessesEnum.ENVIO_A_PRESUPUESTO]: 'ENVÍO A PRESUPUESTO',
  [StageProcessesEnum.ENVIO_A_PAGO]: 'ENVÍO A PAGO',
  [StageProcessesEnum.CUR_POR_DISPARAR]: 'CUR POR DISPARAR',
};

export const StatusProcessesEnum = {
  GUARDADO_BORRADOR: 25,
  PENDIENTE_REVISION: 26,
  ANULADO: 27,
  PENDIENTE_APROBACION_RETORNO: 28,
  APROBADO_RETORNO: 29,
  RECHAZADO_RETORNO: 30,
  FINALIZADO: 31,
};

export const StatusProcessMessages = {
  [StatusProcessesEnum.GUARDADO_BORRADOR]: 'GUARDADO COMO BORRADOR',
  [StatusProcessesEnum.PENDIENTE_REVISION]: 'PENDIENTE ENVÍO',
  [StatusProcessesEnum.ANULADO]: 'ANULADO',
  [StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO]: 'PENDIENTE APROBACIÓN PARA RETORNO',
  [StatusProcessesEnum.APROBADO_RETORNO]: 'APROBADO PARA RETORNO',
  [StatusProcessesEnum.RECHAZADO_RETORNO]: 'RECHAZADO PARA RETORNO',
  [StatusProcessesEnum.FINALIZADO]: 'FINALIZADO',
};

export enum ProcessReturnRequestStatusEnum {
  APPROVE = 29,
  REJECT = 30,
}

export const DaysToActivateDelayReasonByStage = {
  [StageProcessesEnum.REVISION_DOCUMENTAL]: 10, //CU003.FB6.1.1.2
  [StageProcessesEnum.CONTROL_TECNICO_MEDICO]: 45, //CU004.FB6.1.1.2
  [StageProcessesEnum.REVISION_TARIFAS]: 45, //CU005.FB6.1.1.2
  [StageProcessesEnum.ENVIO_A_PAGO]: 1,
  [StageProcessesEnum.CUR_POR_DISPARAR]: 1,
};
