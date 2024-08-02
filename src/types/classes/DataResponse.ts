import { Request } from "express";
import PaginationResponse from "./PaginationResponse";

/**
 * @swagger
 * components:
 *  schemas:
 *    DataResponse:
 *      type: object
 *      properties:
 *        httpCode:
 *          type: integer
 *          example: 200
 *          description: HTTP status code of the response.
 *        message:
 *          type: string
 *          example: "Successfully retrieved data"
 *          description: A message describing the outcome of the request.
 *        data:
 *          type: array
 *          items: {}
 *          description: The data payload of the response. Can be any type or structure, depending on the specific API endpoint.
 *        pagination:
 *          $ref: '#/components/schemas/PaginationResponse'
 */
class DataResponse {
  httpCode: number;
  message: string;
  data: any;
  pagination?: PaginationResponse;

  constructor(
    req: Request,
    httpCode: number,
    messageKey: string,
    data?: any,
    pagination?: PaginationResponse
  ) {
    this.httpCode = httpCode;
    this.message = req.t(messageKey, { lng: req.body.user.language });
    this.data = data;
    this.pagination = pagination;
  }
}

export default DataResponse;
