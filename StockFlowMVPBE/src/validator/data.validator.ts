import { z } from "zod";

export const validator = {
    string: (message?: string) => z.string(message),
    optionalString: (message?: string) => z.string(message).optional(),
    number: (message: string) => z.number(message),
    optionalNumber: (message?: string) => z.number(message).optional(),
    decimal: (message: string) => z.number(message), // use number for simplicity
    optionalDecimal: (message?: string) => z.number(message).optional(),
    boolean: (message: string) => z.boolean(message),
    optionalBoolean: (message?: string) => z.boolean(message).optional(),
    date: (message: string) => z.date(message),
    optionalDate: (message?: string) => z.date(message).optional(),
    list: (message: string) => z.array(
        z.enum(["xl", "l", "xxl", "xxxl", "x", "s", "m"], message)
    ),
    nonNegative: (message: string) =>
        (val?: number) => val === undefined || val >= 0 || message,

};