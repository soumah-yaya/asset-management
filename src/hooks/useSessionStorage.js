import { useState, useEffect } from "react";


const useSessionStorage = (key, initialValue) => {
    const [value, setValue] = useState(
        JSON.parse(sessionStorage.getItem(key)) || initialValue
    );

    useEffect(() => {
        // storing input name
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
export default useSessionStorage;