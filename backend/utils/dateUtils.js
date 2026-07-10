import moment from "moment-timezone";

export const parseDateAsGMT7 = (dateString) => {
    return moment.tz(dateString, "YYYY-MM-DD", "Asia/Jakarta").toDate();
}

export const toJakartaISO = (date) => {
    if (!date) return null
    return moment(date).tz('Asia/Jakarta').format()
}