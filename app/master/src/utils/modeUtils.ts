const { VITE_REGION, MODE } = import.meta.env;

export const IS_DEV = MODE === 'development';
export const IS_PROD = MODE === 'production';
export const IS_STAGING = MODE === 'staging';
export const IS_ORIGIN = VITE_REGION === 'origin';
export const IS_US_EAST = VITE_REGION === 'us1';
