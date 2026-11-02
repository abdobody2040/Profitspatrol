import { useTranslation as useRawTranslation } from "react-i18next";

export function useTranslation() {
  const res = useRawTranslation();
  return {
    ...res,
    t: res.t as (key: string, options?: any) => any,
  };
}
