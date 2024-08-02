/**
 * @swagger
 * components:
 *  schemas:
 *    PaginationResponse:
 *      type: object
 *      properties:
 *        currentPage:
 *          type: integer
 *          example: 1
 *          description: The current page number in the paginated result set.
 *        totalPages:
 *          type: integer
 *          example: 10
 *          description: The total number of pages in the result set.
 *        totalNumber:
 *          type: integer
 *          example: 95
 *          description: The total number of items in the result set.
 */
class PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalNumber: number;

  constructor(currentPage: number, totalPages: number, totalNumber: number) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalNumber = totalNumber;
  }
}

export default PaginationResponse;
