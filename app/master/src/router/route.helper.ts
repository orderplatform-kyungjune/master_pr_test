import { NavigationFailure } from 'vue-router';
import router, { RouteNameType } from '@router/index';

export const pushPage = (
  routeName: RouteNameType | string,
): Promise<NavigationFailure | void | undefined> => router.push({ name: routeName });

export const pushPagePath = (
  routePath: RouteNameType,
): Promise<NavigationFailure | void | undefined> => router.push({ path: routePath });

export const pushPageWithQuery = (routeName: RouteNameType, query: any) =>
  router.push({
    name: routeName,
    query,
  });

export const pushPageWithParams = (routeName: RouteNameType, id: number) =>
  router.push({
    name: routeName,
    params: { id },
  });

export const goBack = () => router.back();
