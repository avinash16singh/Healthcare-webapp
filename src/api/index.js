import axios from "axios";

const API = axios.create({baseURL: "http://localhost:5000"});

API.interceptors.request.use(function (config) {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if(profile) {
        config.headers.Authorization = `Bearer ${profile.token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

//admin
export const fetchAllHospitalsApi = async () => (API.get('/admin/hospitals'));
export const fetchGlobalAmbulancesApi = async () => (API.get(`/admin/ambulance-drivers`));
export const createNewHospitalApi = async (formObj) => (API.post('/admin/hospitals', formObj)); 


//hospital
export const createNewDoctorApi = async (doctor) => (API.post('/hospital/doctors', doctor)); 
export const fetchAllDoctorsApi = async (id) => (API.get(`/hospital/doctors/${id}`));
export const fetchHospitalModelByUserIdApi = async (id) => (API.get(`/hospital/${id}`));
export const fetchAllAmbulancesApi = async (id) => (API.get(`/hospital/ambulances/${id}`));
// export const createNewAmbulanceApi = async (id) => (API.post(`/hospital/ambulances`));
export const createNewAmbulanceApi = async (ambulanceData) => (
  API.post(`/hospital/ambulances`, ambulanceData, {
    headers: {
      "Content-Type": "application/json",
    },
  })
);
export const fetchAllAppointmentsApi = async (id) => (API.get(`/hospital/appointments/${id}`));



//patient
export const createAppointmentApi = async (appointment) => (API.post('/patient/appointments', appointment)); 
export const fetchAllPatientAppointmentsApi = async (userId, role) => (API.get(`/patient/appointments?userId=${userId}&role=${role}`)); //?userId=xxx&role=patient/doctor
export const fetchMyRecordsApi = async (userId) => (API.get(`/patient/records/${userId}`));
export const createNewEmergencyApi = async (formObj) => (API.post('/patient/emergency/create-new', formObj));
export const fetchEmergencyModelApi = async (emergencyId) => (API.get(`/patient/emergencies/${emergencyId}`));
export const fetchActiveEmergencyByUserApi = async (userId) => (API.get(`/patient/emergencies/by-user/${userId}`));





//doctor
export const fetchAllDoctorAppointmentsApi = async (userId, role) => (API.get(`/doctor/appointments?userId=${userId}&role=${role}`)); //?userId=xxx&role=patient/doctor
export const fetchAllDoctorModelApi = async (userId) => (API.get(`/doctor/doctor-model/${userId}`));
export const createMedicalRecordApi = async (record) => (API.post(`/doctor/records`, record));
export const fetchMedicalRecordByApptIdApi = async (id) => (API.get(`/doctor/records/${id}`));
export const updateMedicalRecordApi = async (record, id) => (API.put(`/doctor/records/${id}`, record));


//auth
export const signInApi = async (formObj) => (API.post('/auth/signin', formObj));
export const signUpApi = async (formData) => (API.post('/auth/signup', formData));


//driver
export const fetchDriverModelByUserIdApi = async (id) => (API.get(`/driver/${id}`));
export const acceptEmergencyApi = async(formObj) => (API.put('driver/emergencies/accept-new', formObj));
export const fetchMyActiveEmergencyApi = async (userId) => (API.get(`/driver/emergencies/by-user/${userId}`));
export const fetchPastEmergenciesApi = async (userId) => (API.get(`/driver/emergencies/past/${userId}`));
export const fetchUnclaimedEmergenciesApi = async () => (API.get(`/driver/emergencies/unclaimed`));




