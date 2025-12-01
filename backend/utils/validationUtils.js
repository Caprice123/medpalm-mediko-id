import { ValidationError } from "../errors/validationError.js"

export class ValidationUtils {
    static async validate_fields({ request, requiredFields = [], optionalFields = [] }) {
        const collectedRequest = { ...request.params, ...request.query, ...request.body }

        for (let field of requiredFields) {
            if (!collectedRequest[field] || collectedRequest[field].trim().length == 0) {
                throw new ValidationError(`Params ${field} tidak boleh kosong`)
            }
        }
    }
}