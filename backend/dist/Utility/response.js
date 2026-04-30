export default function response(res, statusCode, message, data = null) {
    if (statusCode >= 200 && statusCode < 400) {
        return res.status(statusCode).json({ isSuccess: true, message, data });
    }
    return res.status(statusCode).json({ isSuccess: false, message });
}
