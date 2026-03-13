/**
 * Service Response Types for Admin Services
 * 
 * These types provide consistent error handling across all service functions.
 */

/**
 * Successful service response containing data
 */
export type ServiceResponse<T> = {
  success: true;
  data: T;
};

/**
 * Error response from a service operation
 */
export type ServiceError = {
  success: false;
  error: string;
};

/**
 * Union type representing either a successful response or an error
 */
export type ServiceResult<T> = ServiceResponse<T> | ServiceError;
