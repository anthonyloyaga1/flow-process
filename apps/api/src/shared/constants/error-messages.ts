import { HttpStatus } from '@nestjs/common';

import { DaysToActivateDelayReasonByStage, StageProcessesEnum } from './processes';

export const ErrorMessage = {
  INTERNAL_SERVER_ERROR: { CODE: HttpStatus.INTERNAL_SERVER_ERROR, MSG: 'Se produjo un error interno en el servidor' },
  DATABASE_ERROR: { CODE: HttpStatus.INTERNAL_SERVER_ERROR, MSG: 'Se produjo un error interno en procesos de BDD' },
  API_ERROR: { CODE: HttpStatus.INTERNAL_SERVER_ERROR, MSG: 'Error en el servicio API' },
  ERROR_SOAP: { CODE: HttpStatus.INTERNAL_SERVER_ERROR, MSG: 'Error en el servicio SOAP' },
  SOAP_PERSON_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró la persona en el servicio SOAP' },
  ACCESS_RULES_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontraron reglas de acceso con el rol: ' },
  CLIENT_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el cliente (En SSO)' },

  // Processes - Trámites
  PROCESS_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un trámite con ese código' },
  PROCESS_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el trámite' },
  PROCESS_ENTRY_TYPE_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el tipo de ingreso' },
  PROCESS_SAME_STAGE: { CODE: HttpStatus.CONFLICT, MSG: 'El trámite ya se encuentra en la etapa seleccionada' },
  PROCESS_NOT_ALLOWED_RETURN_STAGE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite retornar a la etapa indicada',
  },
  PROCESS_NOT_NEXT_STAGE: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'No existe una etapa siguiente' },
  PROCESS_NOT_DELETED: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'No se puede eliminar el trámite con un estado diferente a Guardado' },
  PROCESS_ALREADY_REJECTED: {
    CODE: HttpStatus.CONFLICT,
    MSG: 'El trámite RECHAZADO no puede volver a ser retornado a la etapa de RECEPCIÓN DOCUMENTAL',
  },
  PROCESS_NOT_ALLOWED_CHANGE_STAGE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'No se puede cambiar de etapa. Es necesario guardar la información de la etapa actual:',
  },
  PROCESS_NOT_ALLOWED_APPROVE_RETURN: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'No se puede aprobar el trámite. El trámite se encuentra: ',
  },
  PROCESS_SECOND_RECEPTION_DATE_INVALID: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'La fecha de segunda recepción no es válida. Debe ser hasta 1 mes después de la primera recepción',
  },
  PROCESS_CUR_REV_NOT_IN_PAYMENT_STATUS: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'No puede finalizar, el CUR no se encuentra en estado PAGADO',
  },
  PROCESS_REPORT_TYPE_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el tipo de reporte' },
  PROCESS_SECOND_RECEPTION_DATE_REQUIRED: { CODE: HttpStatus.BAD_REQUEST, MSG: 'La fecha de segunda recepción es requerida' },

  //Providers - Prestadores
  PROVIDER_INVALID_UNICODE: { CODE: HttpStatus.BAD_REQUEST, MSG: 'El código único debe ser un número o una cadena numérica' },
  PROVIDER_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un prestador con ese código' },
  PROVIDER_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró prestador' },

  //Provinces - Provincias
  PROVINCE_INVALID_CODE: { CODE: HttpStatus.BAD_REQUEST, MSG: 'El código debe ser un número o una cadena numérica' },
  PROVINCE_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró la provincia' },

  //Catalog - Catálogo
  CATALOG_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el catálogo' },

  //Organizations - Entidades
  ORGANIZATIONS_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró la entidad' },

  //Status Process - Estados de Proceso
  STATUS_PROCESS_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el estado del trámite' },

  //Documentary Review - Revisión Documental
  DOC_REV_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró Revisión Documental' },
  DOC_REV_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de revisión no es válida' },
  DOC_REV_FILES_DELIVERY_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de entrega de archivos no es válida' },
  PROCESS_NOT_IN_DOCUMENTARY_REVIEW: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite realizar la Revisión Documental. Estado actual: ',
  },
  DOC_REV_PROCESS_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el trámite para validación de fechas en Revisión Documental' },
  DOC_REV_DELAY_REASON_REQUIRED: { CODE: HttpStatus.BAD_REQUEST, MSG: 'El motivo del retraso es requerido. La fecha de revisión es mayor a 10 días' },
  DOC_REV_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe una revisión documental para este trámite' },
  DOC_REV_SECOND_REVIEW_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de segunda revisión no es válida' },
  DOC_REV_SECOND_REVIEW_DATE_REQUIRED: { CODE: HttpStatus.BAD_REQUEST, MSG: 'La fecha de segunda revisión es requerida' },

  //Medical Control - Control Médico
  MED_CTRL_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un Control Técnico Médico para este trámite' },
  MED_CTRL_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el Control Técnico Médico' },
  PROCESS_NOT_IN_MEDICAL_CONTROL: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite realizar el Control Técnico Médico. Estado actual: ',
  },
  MED_CTRL_START_DATE_RELEVANCE: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de incio de pertinencia no es válida' },
  MED_CTRL_DELAY_REASON_REQUIRED: { CODE: HttpStatus.BAD_REQUEST, MSG: 'El motivo del retraso es requerido. La fecha de inicio es mayor a 45 días' },
  MED_CTRL_FILES_DELIVERY_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de entrega de archivos no es válida' },

  //Tariff Control - Control de Tarifas
  TARIFF_CTRL_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un Control de Tarifas para este trámite' },
  TARIFF_CTRL_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el Control de Tarifas' },
  PROCESS_NOT_IN_TARIFF_CTRL_STAGE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite realizar el Control de Tarifas. Estado actual: ',
  },
  TARIFF_CTRL_START_DATE_RELEVANCE: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de incio de liquiación no es válida' },
  TARIFF_CTRL_DELAY_REASON_REQUIRED: {
    CODE: HttpStatus.BAD_REQUEST,
    MSG: `El motivo del retraso es requerido. La fecha de inicio es mayor a ${DaysToActivateDelayReasonByStage[StageProcessesEnum.REVISION_TARIFAS]} días`,
  },
  TARIFF_CTRL_FILES_DELIVERY_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de entrega de archivos no es válida' },
  TARIFF_CTRL_DOCUMENT_MANAGEMENT_SEND_DATE_INVALID: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'La fecha envío a gestión documental no es válida',
  },
  TARIFF_CTRL_OBJECTED_VALUE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El valor aprobado debe ser mayor o igual a 0 y menor o igual al valor solicitado',
  },

  //Budget Shipment - Envío a Presupuesto
  BUDGET_SHIP_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un envío a presupuesto para este trámite' },
  BUDGET_SHIP_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el envío a presupuesto' },
  PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite realizar el Envío a Presupuesto. Estado actual: ',
  },
  BUDGET_SHIP_DELAY_REASON_REQUIRED: {
    CODE: HttpStatus.BAD_REQUEST,
    MSG: 'El motivo del retraso es requerido. La fecha de entrega es mayor a 45 días',
  },
  BUDGET_SHIP_INVOICE_REQUEST_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de solicitud de factura no es válida' },
  BUDGET_SHIP_INVOICE_DELIVERY_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de entrega de factura no es válida' },
  BUDGET_SHIP_BUDGET_REQUEST_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de solicitud de presupuesto no es válida' },

  //Payment Shipment - Envío a Pago
  PAYMENT_SHIP_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un envío a pago para este trámite' },
  PAYMENT_SHIP_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el envío a pago' },
  PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de solicitud de pago no es válida' },

  //CUR Review - Revisión CUR
  CUR_REV_EXIST: { CODE: HttpStatus.CONFLICT, MSG: 'Ya existe un CUR por Disparar para este trámite' },
  CUR_REV_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el CUR por Disparar' },
  CUR_REV_DATE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'La fecha de CUR no es válida' },
  PROCESS_NOT_IN_CUR_REV_STAGE: {
    CODE: HttpStatus.UNPROCESSABLE_ENTITY,
    MSG: 'El estado del trámite no permite realizar el CUR por Disparar. Estado actual: ',
  },
  CUR_REV_DATE_RANGE_INVALID: { CODE: HttpStatus.UNPROCESSABLE_ENTITY, MSG: 'El rango de fecha de CUR por disparar no es válido' },

  //ReportsMatrixRac - Reporte Mtriz RAC

  REPORT_TYPE_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró el tipo de reporte' },
  REPORT_MATRIX_RAC_NOT_FOUND: { CODE: HttpStatus.NOT_FOUND, MSG: 'No se encontró data para la Matriz RAC' },
};
