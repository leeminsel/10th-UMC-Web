import { Children, cloneElement, useMemo } from 'react';
import { useCurrentPath } from './hooks';

export const Routes = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children);
    return routes.find((route: any) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};