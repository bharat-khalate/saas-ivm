import type { Dispatch, SetStateAction } from "react";
import { SEARCH_DEBOUNCE_DELAY } from "./constants";

export const debounce = (search: Dispatch<SetStateAction<string>>) => {
    let timeOut: ReturnType<typeof setTimeout> | null = null;

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        if (timeOut) clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            search(e.target.value);
        }, SEARCH_DEBOUNCE_DELAY);
    };
}