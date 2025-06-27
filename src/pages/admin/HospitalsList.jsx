import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewHospitalAction,
  fetchAllHospitalsAction,
} from "../../redux/adminSlice";
import SelectLocationMap from "../../components/common/SelectLocationMap";

export function HospitalsList() {
  const dispatch = useDispatch();
  const { hospitals = [] } = useSelector((state) => state.admin_slice);

  const [showForm, setShowForm] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [hasFetchedHospitals, setHasFetchedHospitals] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    type: "private",
    phone: "",
    email: "",
    website: "",
    area: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    lat: "",
    long: "",
    totalBeds: "",
    emergencyBeds: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
  });

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      await dispatch(fetchAllHospitalsAction());
      setLoadingHospitals(false);
    };

    if (!hasFetchedHospitals) {
      fetchHospitals();
      setHasFetchedHospitals(true);
    }
  }, [dispatch, hasFetchedHospitals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required field check
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`Please fill in the "${key}" field.`);
        return;
      }
    }

    setSubmittingForm(true);
    const result = await dispatch(createNewHospitalAction(formData));
    setSubmittingForm(false);

    if (result?.type === "admin/createNewHospital/fulfilled") {
      setShowForm(false);
      setFormData({
        name: "",
        registrationNumber: "",
        type: "private",
        phone: "",
        email: "",
        website: "",
        area: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        lat: "",
        long: "",
        totalBeds: "",
        emergencyBeds: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        adminPassword: "",
      });
    }
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
            Hospital Management
          </Typography>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="border px-3 py-1.5 rounded-md bg-white text-blue-800 hover:bg-blue-50 font-medium transition"
          >
            {showForm ? "Hide Form" : "Add Hospital"}
          </button>
        </CardHeader>

        {/* Hospital Form */}
        {showForm && (
          <CardBody className="px-6 pt-0">
            <Typography variant="h6" className="mb-4 text-blue-gray-700">
              Add New Hospital
            </Typography>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              {/* Hospital Info */}
              <Input label="Hospital Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
              <div>
                <Typography variant="small" className="mb-1 text-gray-700">Hospital Type</Typography>
                <Select value={formData.type} onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}>
                  <Option value="private">Private</Option>
                  <Option value="government">Government</Option>
                </Select>
              </div>
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Input label="Website" name="website" value={formData.website} onChange={handleChange} />

              {/* Location Info */}
              <Input label="Area" name="area" value={formData.area} onChange={handleChange} />
              <Input label="City" name="city" value={formData.city} onChange={handleChange} />
              <Input label="State" name="state" value={formData.state} onChange={handleChange} />
              <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
              <Input label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />

              <div className="md:col-span-2">
                <Typography variant="small" className="mb-2 text-gray-700">
                  Select Location on Map
                </Typography>
                <SelectLocationMap
                  onLocationSelect={({ lat, lng }) =>
                    setFormData((prev) => ({ ...prev, lat, long: lng }))
                  }
                />
              </div>
              <Input label="Latitude" name="lat" value={formData.lat} readOnly />
              <Input label="Longitude" name="long" value={formData.long} readOnly />

              {/* Bed Info */}
              <Input label="Total Beds" name="totalBeds" value={formData.totalBeds} onChange={handleChange} type="number" />
              <Input label="Emergency Beds" name="emergencyBeds" value={formData.emergencyBeds} onChange={handleChange} type="number" />

              {/* Admin Info */}
              <Input label="Admin Name" name="adminName" value={formData.adminName} onChange={handleChange} />
              <Input label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} />
              <Input label="Admin Phone" name="adminPhone" value={formData.adminPhone} onChange={handleChange} />
              <Input label="Admin Password" name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} />

              <div className="col-span-2">
                <Button type="submit" fullWidth disabled={submittingForm}>
                  {submittingForm ? <Spinner className="h-5 w-5" /> : "Add Hospital"}
                </Button>
              </div>
            </form>
          </CardBody>
        )}

        {/* Hospital Table */}
        <CardBody className="overflow-x-auto px-0 pt-0 pb-4">
          {loadingHospitals ? (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <table className="w-full min-w-[1000px] table-auto text-left">
              <thead>
                <tr className="bg-blue-50">
                  {[
                    "Name",
                    "Reg. No",
                    "Type",
                    "Beds",
                    "Emergency Beds",
                    "City",
                    "Admin Name",
                    "Admin Email",
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
                {hospitals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-blue-gray-400">
                      No hospitals found.
                    </td>
                  </tr>
                ) : (
                  hospitals.map((hosp, idx) => {
                    const rowClass = `py-3 px-5 ${idx !== hospitals.length - 1 ? "border-b border-blue-gray-50" : ""}`;
                    return (
                      <tr key={hosp._id} className="hover:bg-blue-50 transition">
                        <td className={rowClass}>{hosp.name}</td>
                        <td className={rowClass}>{hosp.registrationNumber}</td>
                        <td className={rowClass}>{hosp.type}</td>
                        <td className={rowClass}>{hosp.totalBeds}</td>
                        <td className={rowClass}>{hosp.emergencyBeds}</td>
                        <td className={rowClass}>{hosp.location?.city || "N/A"}</td>
                        <td className={rowClass}>{hosp.hospitalAdmin?.name || "N/A"}</td>
                        <td className={rowClass}>{hosp.hospitalAdmin?.email || "N/A"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default HospitalsList;
