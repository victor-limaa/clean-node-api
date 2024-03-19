interface httpResponse {
  statusCode: number
  body: any
}

export class SignUpController {
  handle(httpRequest: any): httpResponse {
    return {
      statusCode: 400,
      body: new Error('Missing param: name'),
    }
  }
}
