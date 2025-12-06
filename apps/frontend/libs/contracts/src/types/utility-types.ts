/**
 * Makes all properties of an object and its nested objects optional.
 * This is useful for creating partial updates for complex nested objects,
 * enhancing type safety for update operations where only a subset of properties is provided.
 *
 * @template T The type to make deeply partial.
 * @example
 * interface User {
 *   id: number;
 *   profile: {
 *     name: string;
 *     settings: {
 *       theme: 'dark' | 'light';
 *     };
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // PartialUser is equivalent to:
 * // {
 * //   id?: number | undefined;
 * //   profile?: {
 * //     name?: string | undefined;
 * //     settings?: {
 * //       theme?: 'dark' | 'light' | undefined;
 * //     } | undefined;
 * //   } | undefined;
 * // }
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>;
    }
  : T;

// يمكن إضافة أنواع مساعدة أخرى هنا لاحقاً
