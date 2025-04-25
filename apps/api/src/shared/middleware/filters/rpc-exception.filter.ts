// import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { throwError } from 'rxjs';

// @Catch()
// export class LoggingGlobalFilter implements RpcExceptionFilter {
//   catch(exception: RpcException, host: ArgumentsHost) {
//     // Cast Argumentos a tipo RPC
//     const argumentsRPC = host.switchToRpc();
//     console.log('argumentsRPC', argumentsRPC);
//     console.log('exception', exception);
//     // const context = argumentsRPC.getContext<TcpContext>();

//     // const params = argumentsRPC.getData();
//     // const pattern = context.getPattern();
//     // const contextType = host.getType();
//     // const exceptionResponse = exception.getError();
//     // const status = exceptionResponse['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
//     // const formattedExceptionAsMessage = formatExceptionInfo(exceptionResponse);
//     // const { className, methodName } = getOriginExceptionInfo(exception);
//     // const formattedLog = formatLogInfo(params, status, contextType, pattern, className, methodName, formattedExceptionAsMessage);

//     // loggingRequest(formattedLog, status);

//     return throwError(() => exception);
//   }
// }
