import { allRoutes } from '../routes/allRoutes';

export function getRoutesForRole(role) {
  switch (role) {
    case 'centralAdmin':
      return allRoutes.centralAdmin;
    case 'hospitalAdmin':
      return allRoutes.hospitalAdmin;
    case 'doctor':
      return allRoutes.doctor;
    case 'patient':
      return allRoutes.patient;
    case 'ambulanceDriver':
      return allRoutes.ambulanceDriver;
    default:
      return { pages: [] };
  }
}
