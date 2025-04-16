import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportMatrixRacDto {
  @Expose()
  @ApiProperty({ example: 46, description: 'Id del trámite. (secuencial)' })
  processesId: number;

  @Expose()
  @ApiProperty({ example: 'Z01', description: 'Código de la zona del proveedor' })
  providerZoneCode: string;

  @Expose()
  @ApiProperty({ example: 'AZUAY', description: 'Nombre de la provincia del proveedor' })
  providerProvinceDescription: string;

  @Expose()
  @ApiProperty({ example: 'VB', description: 'Iniciales del usuario que creó el trámite' })
  createdByInitials: string;

  @Expose()
  @ApiProperty({ example: 'ENVÍO A PAGO / BORRADOR', description: 'Estado actual del trámite' })
  currentStageStatus: string;

  @Expose()
  @ApiProperty({ example: '2025-02-06T05:00:00.000Z', description: 'Fecha de creación del trámite' })
  receptionDate: string;

  @Expose()
  @ApiProperty({ example: 'Valeria Basantes', description: 'Nombre del usuario que creó el trámite' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'CZ01-AMB-2025-02-00076', description: 'Número de trámite' })
  caseNumber: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite tiene archivo' })
  hasFile: boolean;

  @Expose()
  @ApiProperty({ example: '0160006710001', description: 'RUC del proveedor' })
  providerRuc: string;

  @Expose()
  @ApiProperty({ example: 'LLACAO', description: 'Nombre del proveedor' })
  providerName: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite es catastrófico' })
  isCatastrophic: boolean;

  @Expose()
  @ApiProperty({ example: 1234, description: 'Número de archivos del trámite' })
  fileCount: number;

  @Expose()
  @ApiProperty({ example: '2 / 2025', description: 'Mes y año del servicio' })
  serviceMonthYear: string;

  @Expose()
  @ApiProperty({ example: 2025, description: 'Año del servicio' })
  serviceYear: number;

  @Expose()
  @ApiProperty({ example: '12345.67', description: 'Monto solicitado' })
  requestedAmount: number;

  @Expose()
  @ApiProperty({ example: 19, description: 'Nombre del tipo de entrada' })
  entryTypeName: number;

  @Expose()
  @ApiProperty({ example: 'PRIMERA VEZ', description: 'Nombre del número de entrada' })
  entryNumberName: string;

  @Expose()
  @ApiProperty({ example: 3, description: 'Número de caja' })
  boxNumber: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de revisión documental' })
  documentaryReviewDate: string;

  @Expose()
  @ApiProperty({ example: 'RS', description: 'Iniciales del usuario que creó la revisión documental' })
  documentaryReviewCreatedByInitials: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de inicio del control médico' })
  medicalControlStartDate: string;

  @Expose()
  @ApiProperty({ example: 'Renato Sosa', description: 'Nombre del usuario que creó el control médico' })
  medicalControlCreatedByName: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T20:11:30.764Z', description: 'Fecha de inicio de la etapa actual del control de tarifas' })
  tariffControlCurrentStageStartDate: string;

  @Expose()
  @ApiProperty({ example: 'Renato Sosa', description: 'Nombre del usuario que creó el control de tarifas' })
  tariffControlCreatedByName: string;

  @Expose()
  @ApiProperty({ example: '1234.00', description: 'Valor aprobado en el control de tarifas' })
  tariffControlApprovedValue: number;

  @Expose()
  @ApiProperty({ example: '123.00', description: 'Valor objetado en el control de tarifas' })
  tariffControlObjectedValue: number;

  @Expose()
  @ApiProperty({ example: '2025-02-07T17:06:18.714Z', description: 'Fecha de inicio de la etapa actual de la revisión documental' })
  documentaryReviewCurrentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: 'Renato Sosa', description: 'Nombre del usuario que creó la revisión documental' })
  documentaryReviewCreatedByName: string;

  @Expose()
  @ApiProperty({ example: '1234', description: 'Número de reporte del control de tarifas' })
  tariffControlReportNumber: string;

  @Expose()
  @ApiProperty({ example: 'M-1234', description: 'Número de memorándum del control de tarifas' })
  tariffControlMemorandumNumber: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de solicitud de presupuesto del envío de presupuesto' })
  budgetShipmentBudgetRequestDate: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de solicitud de factura del envío de presupuesto' })
  budgetShipmentInvoiceRequestDate: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de entrega de factura del envío de presupuesto' })
  budgetShipmentInvoiceDeliveryDate: string;

  @Expose()
  @ApiProperty({ example: 'INV12345', description: 'Número de factura' })
  invoiceNumber: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T21:28:13.950Z', description: 'Fecha de inicio de la etapa actual del envío de pago' })
  paymentShipmentCurrentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: '2025-02-10T05:00:00.000Z', description: 'Fecha de envío de archivo del envío de pago' })
  paymentShipmentFileShipmentDate: string;

  @Expose()
  @ApiProperty({ example: 'BRUCE LEANDRO VELIZ GARCIA', description: 'Nombre del responsable del archivo' })
  fileResponsibleName: string;

  @Expose()
  @ApiProperty({ example: 45, description: 'Cantidad de expedientes objetados' })
  totalObjectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: 'Detalle 1, Detalle 2', description: 'Detalles de pacientes objetados' })
  totalObjectedPatientsDetails: string;

  @Expose()
  @ApiProperty({ example: 4, description: 'Número de archivos objetados en la revisión documental' })
  documentaryReviewObjectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: 2, description: 'Número de archivos objetados en el control médico' })
  medicalControlObjectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Número de archivos objetados en el control de tarifas' })
  tariffControlObjectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: '2025-02-07, 2025-02-07', description: 'Fecha de entrega de archivos' })
  totalFilesDeliveryDate: string;

  @Expose()
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del coordinador de la zona de revisión de CUR' })
  curReviewZoneCoordinatorName: string;

  @Expose()
  @ApiProperty({ example: 'Observaciones del trámite', description: 'Observaciones del trámite' })
  observations: string;

  @Expose()
  @ApiProperty({ example: 45, description: 'Cantidad de expedientes objetados en Cur por disparar' })
  curReviewCurNumber: string;

  @Expose()
  @ApiProperty({ example: '2025-02-10', description: 'Fecha de revisión de CUR' })
  curReviewCurDate: string;

  @Expose()
  @ApiProperty({ example: 'ACHPE DIALIZADORAS', description: 'Nombre del grupo de proveedores' })
  providerGroupName: string;

  @Expose()
  @ApiProperty({ example: 'I NIVEL DE ATENCION', description: 'Nivel de atención del proveedor' })
  providerAttentionLevel: string;

  @Expose()
  @ApiProperty({ example: 'CENTRO DE SALUD TIPO A', description: 'Denominación del proveedor' })
  providerDenomination: string;

  @Expose()
  @ApiProperty({ example: 'DIALIZADORAS', description: 'Nombre del grupo agregado de proveedores' })
  providerGroupAggregatedName: string;

  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia del proveedor' })
  providerProvinceCode: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Id del proveedor' })
  providerId: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Id de la etapa del trámite' })
  processStageId: number;
}
