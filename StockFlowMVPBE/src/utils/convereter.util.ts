export const toInt = (val: unknown) => {
    if (val === undefined || val === null || val === "") return undefined
    if (typeof val === "string") return parseInt(val, 10)
    return val
}

export const toFloat = (val: unknown) => {
    if (val === undefined || val === null || val === "") return undefined
    if (typeof val === "string") return parseFloat(val)
    return val
}


export const toBoolean = (val: unknown) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined;
};

export const toDate = (val: unknown) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;

    const parsed = new Date(val as string);
    return isNaN(parsed.getTime()) ? undefined : parsed;
};


export const toArray = (val: unknown) => {
    if (!val) return [];

    if (Array.isArray(val)) return val;

    if (typeof val === "string") {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
        } catch { }

        return val.split(",").map(v => v.trim());
    }

    return [];
};