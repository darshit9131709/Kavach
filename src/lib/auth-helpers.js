/**
 * Authentication helper utilities
 * Role-based access control and permission checking
 */

import { ROLES } from './constants';

/**
 * Check if a user has a specific role
 * @param {string} userRole - The user's role
 * @param {string} requiredRole - The required role
 * @returns {boolean} - True if user has the required role
 */
export function hasRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) {
    return false;
  }
  return userRole === requiredRole;
}

/**
 * Check if a user has admin role
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(userRole) {
  return hasRole(userRole, ROLES.ADMIN);
}

/**
 * Check if a user has company role
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is company
 */
export function isCompany(userRole) {
  return hasRole(userRole, ROLES.COMPANY);
}

/**
 * Check if a user has user role
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user has user role
 */
export function isUser(userRole) {
  return hasRole(userRole, ROLES.USER);
}

/**
 * Check if user has access to a route
 * @param {string} userRole - The user's role
 * @param {string} pathname - The route pathname
 * @param {Function} getRequiredRoleFn - Function to get required role (injected to avoid circular dependency)
 * @returns {boolean} - True if user has access
 */
export function hasRouteAccess(userRole, pathname, getRequiredRoleFn) {
  const requiredRole = getRequiredRoleFn(pathname);
  
  if (!requiredRole) {
    // Route doesn't require specific role, allow access
    return true;
  }

  return hasRole(userRole, requiredRole);
}
