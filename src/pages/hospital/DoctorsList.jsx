import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewDoctorAction,
  fetchAllDoctorsAction,
  fetchHospitalModelByUserIdAction,
} from "../../redux/hospitalSlice";

export function DoctorList() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const dispatch = useDispatch();

  const storedProfile = useMemo(() => {
    return JSON.parse(localStorage.getItem("profile"));
  }, []);

  const { hospital, doctors = [], hospitalId } = useSelector(
    (state) => state.hospital_slice
  );

  const [hasFetchedHospital, setHasFetchedHospital] = useState(false);
  const [hasFetchedDoctors, setHasFetchedDoctors] = useState(false);

  useEffect(() => {
    if (!hasFetchedHospital && storedProfile?.user?._id) {
      dispatch(fetchHospitalModelByUserIdAction(storedProfile.user._id));
      setHasFetchedHospital(true);
    }
  }, [dispatch, storedProfile, hasFetchedHospital]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!hasFetchedDoctors && hospital?._id) {
        setIsLoadingData(true);
        await dispatch(fetchAllDoctorsAction(hospital._id));
        setIsLoadingData(false);
        setHasFetchedDoctors(true);
      }
    };
    fetchDoctors();
  }, [dispatch, hospital, hasFetchedDoctors]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
    department: "",
    specialties: "",
    doctorType: "general",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).every((val) => val.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all fields.");
      return;
    }

    if (!hospitalId) {
      alert("Hospital ID not available. Please ensure you are logged in.");
      return;
    }

    setIsSubmitting(true);

    const newDoctor = {
      ...formData,
      hospitalId,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      availability: [],
    };

    await dispatch(createNewDoctorAction(newDoctor));
    setIsSubmitting(false);
    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      licenseNumber: "",
      department: "",
      specialties: "",
      doctorType: "general",
    });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-6 p-6 flex items-center justify-between"
        >
          <Typography variant="h6" color="white">
            Doctor Management
          </Typography>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="border px-3 py-1.5 rounded-md bg-white text-blue-800 hover:bg-blue-50 font-medium transition"
          >
            {showForm ? "Hide Form" : "Add Doctor"}
          </button>
        </CardHeader>

        {showForm && (
          <CardBody className="px-6 pt-0">
            <Typography variant="h6" className="mb-4 text-blue-gray-700">
              Add New Doctor
            </Typography>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                label="Specialties (comma-separated)"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div>
                <Typography variant="small" className="mb-1 text-gray-700">
                  Doctor Type
                </Typography>
                <Select
                  value={formData.doctorType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, doctorType: value }))
                  }
                  disabled={isSubmitting}
                >
                  <Option value="general">General</Option>
                  <Option value="emergency">Emergency</Option>
                </Select>
              </div>
              <div className="col-span-2">
                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Add Doctor"}
                </Button>
              </div>
            </form>
          </CardBody>
        )}

        <CardBody className="overflow-x-auto px-0 pt-0 pb-4">
          <table className="w-full min-w-[900px] table-auto text-left">
            <thead>
              <tr className="bg-blue-50">
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "License",
                  "Department",
                  "Specialties",
                  "Type",
                ].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 py-3 px-5"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-600"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoadingData ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-gray-400">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doc, idx) => {
                  const className = `py-3 px-5 ${
                    idx === doctors.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={doc._id} className="hover:bg-blue-50 transition">
                      <td className={className}>{doc?.user?.name || "N/A"}</td>
                      <td className={className}>{doc?.user?.email || "N/A"}</td>
                      <td className={className}>{doc?.user?.phone || "N/A"}</td>
                      <td className={className}>{doc.licenseNumber}</td>
                      <td className={className}>{doc.department}</td>
                      <td className={className}>
                        {doc.specialties?.join(", ") || "N/A"}
                      </td>
                      <td className={`${className} capitalize`}>
                        {doc.doctorType}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default DoctorList;
