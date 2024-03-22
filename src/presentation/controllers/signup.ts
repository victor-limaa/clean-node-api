/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamsError } from '../errors'
import { badRequest, serverError, success } from '../helpers/http-helper'
import {
  type HttpRequest,
  type HttpResponse,
  type EmailValidator,
  type Controller,
} from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      })

      return await new Promise((resolve) => {
        resolve(success(account))
      })
    } catch (error) {
      return serverError()
    }
  }
}
