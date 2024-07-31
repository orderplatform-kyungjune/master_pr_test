import { RemovableRef, StorageSerializers, useStorage } from '@vueuse/core';

export type LocalStorageKey =
  | 'userAuth'
  | 'font-size'
  | 'orderListFilter'
  | 'is_pickup_on'
  | 'isCompactMenu'
  | 'autoClose';

// TODO: key 와 T 를 매칭하여 자동 타입 검증되게 하는 방법은 없을까??
export const useLocalStorageData = <T>(
  key: LocalStorageKey,
  defaultValue = null as T,
): RemovableRef<T> =>
  useStorage<T>(key, defaultValue, undefined, {
    serializer: StorageSerializers.object,
  });
