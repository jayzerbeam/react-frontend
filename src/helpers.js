export const getFromSessionStorage = (val) => {
    return window.sessionStorage.getItem(val);
};
export const addToSessionStorage = (key, val) => {
    return window.sessionStorage.setItem(key, val);
};
export const isPositiveNum = (value, name = '') => {
    const onlyNumsRegex = /[^0-9]/;

    if (name === 'battery_kwh') {
        if (value !== '') {
            return !value.match(onlyNumsRegex) && Number(value) > 0;
        } else {
            return !value.match(onlyNumsRegex);
        }
    }
    return !value.match(onlyNumsRegex) && value !== '' && Number(value) > 0;
};
export const classNames = {
    inputCol: 'flex flex-col mb-3',
    inputRow: 'flex flex-row',
    errorInputLabel: 'text-sm mb-1 font-semibold text-red-600',
    input: 'border-black',
    disabledInput: 'border-gray-200 bg-gray-200',
    errorInput: 'border-red-600 bg-red-50',
};
