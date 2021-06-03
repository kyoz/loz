import { LocaleValue } from './locale-value';

export interface Locale {
  key: string;
  path: string;
  values: LocaleValue[];
  children: Locale[];
}
