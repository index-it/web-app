import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";

export class IxApiError extends Error {
  public readonly ixApiErrorResponse: IxApiErrorResponse;

  constructor(ixApiErrorResponse: IxApiErrorResponse) {
    super(ixApiErrorResponse);
    this.ixApiErrorResponse = ixApiErrorResponse;
  }
}