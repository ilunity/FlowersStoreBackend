//todo написать класс ошибок

class APIError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new APIError(404, message);
    }

    static internal(message) {
        return new APIError(500, message);
    }

    static forbidden(message) {
        return new APIError(403, message);
    }

    static unauthorized() {
        return new APIError(401, "User unauthorized");
    }

    static noParameters() {
        return APIError.badRequest("Not all parameters are entered");
    }
}

module.exports = APIError;