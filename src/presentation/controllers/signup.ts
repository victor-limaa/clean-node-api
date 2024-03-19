interface httpResponse {
  statusCode: number
}

export class SignUpController {
  handle(httpRequest: any): httpResponse {
    return {
      statusCode: 400,
    }
  }
}
