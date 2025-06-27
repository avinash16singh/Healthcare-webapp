import AmbulanceDriversList from '@/pages/admin/AmbulanceDriversList';
import Analytics from '@/pages/admin/Analytics';
import HomeCentralAdmin from '@/pages/admin/HomeCentralAdmin';
import HospitalAdminsList from '@/pages/admin/HospitalAdminsList';
import HospitalsList from '@/pages/admin/HospitalsList';
import HomeDoctor from '@/pages/doctor/HomeDoctor';
import MedicalRecords from '@/pages/doctor/MedicalRecords';
import MyAppointments from '@/pages/doctor/MyAppointments';
import EmergencyCalls from '@/pages/driver/EmergencyCalls';
import HomeDriver from '@/pages/driver/HomeDriver';
import AmbulancesList from '@/pages/hospital/AmbulancesList';
import Appointments from '@/pages/hospital/Appointments';
import DoctorsList from '@/pages/hospital/DoctorsList';
import HomeHospitalAdmin from '@/pages/hospital/HomeHospitalAdmin';
import PatientsList from '@/pages/hospital/PatientsList';
import BookAppointment from '@/pages/patient/BookAppointment';
import Consultations from '@/pages/patient/Consultations';
import Emergency from '@/pages/patient/Emergency';
import HomePatient from '@/pages/patient/HomePatient';
import MyRecords from '@/pages/patient/MyRecords';
import Profile from '@/pages/patient/Profile';
import {
    HomeIcon,
    BuildingOfficeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    BriefcaseIcon,
    TruckIcon,
    CalendarDaysIcon,
    ChatBubbleBottomCenterTextIcon,
    ClipboardIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
  } from '@heroicons/react/24/solid';
  
  const icon = { className: 'w-5 h-5 text-inherit' };
  
  // Add your <Component /> imports here.
  
  export const allRoutes = {
    centralAdmin: {
      pages: [
        //{ icon: <HomeIcon {...icon} />, name: 'dashboard', path: '/admin/dashboard', element: <HomeCentralAdmin /> },
        { icon: <BuildingOfficeIcon {...icon} />, name: 'hospitals', path: '/admin/hospitals', element: <HospitalsList /> },
        //{ icon: <UserGroupIcon {...icon} />, name: 'hospital admins', path: '/admin/hospital-admins', element: <HospitalAdminsList /> },
        { icon: <TruckIcon {...icon} />, name: 'ambulance drivers', path: '/admin/ambulance-drivers', element: <AmbulanceDriversList /> },
        //{ icon: <TableCellsIcon {...icon} />, name: 'analytics', path: '/admin/analytics', element: <Analytics /> },
        //{ icon: <UserCircleIcon {...icon} />, name: 'profile', path: '/admin/profile', element: <Profile /> },
        // { icon: <Cog6ToothIcon {...icon} />, name: 'settings', path: '/admin/settings', element: <Settings /> },
      ],
    },
    hospitalAdmin: {
      pages: [
        //{ icon: <HomeIcon {...icon} />, name: 'dashboard', path: '/hospital/dashboard', element: <HomeHospitalAdmin /> },
        { icon: <ClipboardDocumentListIcon {...icon} />, name: 'appointments', path: '/hospital/appointments', element: <Appointments /> },
        { icon: <UserGroupIcon {...icon} />, name: 'doctors', path: '/hospital/doctors', element: <DoctorsList /> },
        //{ icon: <UserGroupIcon {...icon} />, name: 'patients', path: '/hospital/patients', element: <PatientsList /> },
        { icon: <TruckIcon {...icon} />, name: 'ambulances', path: '/hospital/ambulances', element: <AmbulancesList /> },
        //{ icon: <UserCircleIcon {...icon} />, name: 'profile', path: '/hospital/profile', element: <Profile /> },
      ],
    },
    doctor: {
      pages: [
        //{ icon: <HomeIcon {...icon} />, name: 'dashboard', path: '/doctor/dashboard', element: <HomeDoctor /> },
        { icon: <ClipboardDocumentListIcon {...icon} />, name: 'my appointments', path: '/doctor/appointments', element: <MyAppointments /> },
        //{ icon: <ClipboardIcon {...icon} />, name: 'medical records', path: '/doctor/records', element: <MedicalRecords /> },
        //{ icon: <UserCircleIcon {...icon} />, name: 'profile', path: '/doctor/profile', element: <Profile /> },
      ],
    },
    patient: {
      pages: [
        //{ icon: <HomeIcon {...icon} />, name: 'dashboard', path: '/patient/dashboard', element: <HomePatient /> },
        { icon: <CalendarDaysIcon {...icon} />, name: 'book appointment', path: '/patient/book', element: <BookAppointment /> },
        { icon: <ClipboardIcon {...icon} />, name: 'my records', path: '/patient/records', element: <MyRecords /> },
        { icon: <ChatBubbleBottomCenterTextIcon {...icon} />, name: 'my consultations', path: '/patient/consultations', element: <Consultations /> },
        { icon: <ExclamationTriangleIcon {...icon} />, name: 'Emergency', path: '/patient/emergency', element: <Emergency /> },
      ],
    },
    ambulanceDriver: {
      pages: [
        //{ icon: <HomeIcon {...icon} />, name: 'dashboard', path: '/driver/dashboard', element: <HomeDriver /> },
        { icon: <ExclamationTriangleIcon {...icon} />, name: 'emergency calls', path: '/driver/emergencies', element: <EmergencyCalls /> },
        //{ icon: <UserCircleIcon {...icon} />, name: 'profile', path: '/driver/profile', element: <Profile /> },
      ],
    },
  };