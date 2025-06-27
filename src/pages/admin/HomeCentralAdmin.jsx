// import React from "react";
// import {
//   Typography,
//   Card,
//   CardHeader,
//   CardBody,
//   IconButton,
//   Menu,
//   MenuHandler,
//   MenuList,
//   MenuItem,
//   Avatar,
//   Tooltip,
//   Progress,
// } from "@material-tailwind/react";
// import {
//   EllipsisVerticalIcon,
//   ArrowUpIcon,
// } from "@heroicons/react/24/outline";


// import {
//   statisticsCardsData,
//   statisticsChartsData,
//   projectsTableData,
//   ordersOverviewData,
// } from "@/data";
// import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
// import StatisticsCard from "@/components/cards/statistics-card";
// import StatisticsChart from "@/components/charts/statistics-chart";

// export function HomeCentralAdmin() {
//   return (
//     <div className="mt-12">
//       <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
//         {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
//           <StatisticsCard
//             key={title}
//             {...rest}
//             title={title}
//             icon={React.createElement(icon, {
//               className: "w-6 h-6 text-white",
//             })}
//             footer={
//               <Typography className="font-normal text-blue-gray-600">
//                 <strong className={footer.color}>{footer.value}</strong>
//                 &nbsp;{footer.label}
//               </Typography>
//             }
//           />
//         ))}
//       </div>
//       <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
//         {statisticsChartsData.map((props) => (
//           <StatisticsChart
//             key={props.title}
//             {...props}
//             footer={
//               <Typography
//                 variant="small"
//                 className="flex items-center font-normal text-blue-gray-600"
//               >
//                 <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
//                 &nbsp;{props.footer}
//               </Typography>
//             }
//           />
//         ))}
//       </div>
//       <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
//         <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
//           <CardHeader
//             floated={false}
//             shadow={false}
//             color="transparent"
//             className="m-0 flex items-center justify-between p-6"
//           >
//             <div>
//               <Typography variant="h6" color="blue-gray" className="mb-1">
//                 Projects
//               </Typography>
//               <Typography
//                 variant="small"
//                 className="flex items-center gap-1 font-normal text-blue-gray-600"
//               >
//                 <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
//                 <strong>30 done</strong> this month
//               </Typography>
//             </div>
//             <Menu placement="left-start">
//               <MenuHandler>
//                 <IconButton size="sm" variant="text" color="blue-gray">
//                   <EllipsisVerticalIcon
//                     strokeWidth={3}
//                     fill="currenColor"
//                     className="h-6 w-6"
//                   />
//                 </IconButton>
//               </MenuHandler>
//               <MenuList>
//                 <MenuItem>Action</MenuItem>
//                 <MenuItem>Another Action</MenuItem>
//                 <MenuItem>Something else here</MenuItem>
//               </MenuList>
//             </Menu>
//           </CardHeader>
//           <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//             <table className="w-full min-w-[640px] table-auto">
//               <thead>
//                 <tr>
//                   {["companies", "members", "budget", "completion"].map(
//                     (el) => (
//                       <th
//                         key={el}
//                         className="border-b border-blue-gray-50 py-3 px-6 text-left"
//                       >
//                         <Typography
//                           variant="small"
//                           className="text-[11px] font-medium uppercase text-blue-gray-400"
//                         >
//                           {el}
//                         </Typography>
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {projectsTableData.map(
//                   ({ img, name, members, budget, completion }, key) => {
//                     const className = `py-3 px-5 ${
//                       key === projectsTableData.length - 1
//                         ? ""
//                         : "border-b border-blue-gray-50"
//                     }`;

//                     return (
//                       <tr key={name}>
//                         <td className={className}>
//                           <div className="flex items-center gap-4">
//                             <Avatar src={img} alt={name} size="sm" />
//                             <Typography
//                               variant="small"
//                               color="blue-gray"
//                               className="font-bold"
//                             >
//                               {name}
//                             </Typography>
//                           </div>
//                         </td>
//                         <td className={className}>
//                           {members.map(({ img, name }, key) => (
//                             <Tooltip key={name} content={name}>
//                               <Avatar
//                                 src={img}
//                                 alt={name}
//                                 size="xs"
//                                 variant="circular"
//                                 className={`cursor-pointer border-2 border-white ${
//                                   key === 0 ? "" : "-ml-2.5"
//                                 }`}
//                               />
//                             </Tooltip>
//                           ))}
//                         </td>
//                         <td className={className}>
//                           <Typography
//                             variant="small"
//                             className="text-xs font-medium text-blue-gray-600"
//                           >
//                             {budget}
//                           </Typography>
//                         </td>
//                         <td className={className}>
//                           <div className="w-10/12">
//                             <Typography
//                               variant="small"
//                               className="mb-1 block text-xs font-medium text-blue-gray-600"
//                             >
//                               {completion}%
//                             </Typography>
//                             <Progress
//                               value={completion}
//                               variant="gradient"
//                               color={completion === 100 ? "green" : "blue"}
//                               className="h-1"
//                             />
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )}
//               </tbody>
//             </table>
//           </CardBody>
//         </Card>
//         <Card className="border border-blue-gray-100 shadow-sm">
//           <CardHeader
//             floated={false}
//             shadow={false}
//             color="transparent"
//             className="m-0 p-6"
//           >
//             <Typography variant="h6" color="blue-gray" className="mb-2">
//               Orders Overview
//             </Typography>
//             <Typography
//               variant="small"
//               className="flex items-center gap-1 font-normal text-blue-gray-600"
//             >
//               <ArrowUpIcon
//                 strokeWidth={3}
//                 className="h-3.5 w-3.5 text-green-500"
//               />
//               <strong>24%</strong> this month
//             </Typography>
//           </CardHeader>
//           <CardBody className="pt-0">
//             {ordersOverviewData.map(
//               ({ icon, color, title, description }, key) => (
//                 <div key={title} className="flex items-start gap-4 py-3">
//                   <div
//                     className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
//                       key === ordersOverviewData.length - 1
//                         ? "after:h-0"
//                         : "after:h-4/6"
//                     }`}
//                   >
//                     {React.createElement(icon, {
//                       className: `!w-5 !h-5 ${color}`,
//                     })}
//                   </div>
//                   <div>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className="block font-medium"
//                     >
//                       {title}
//                     </Typography>
//                     <Typography
//                       as="span"
//                       variant="small"
//                       className="text-xs font-medium text-blue-gray-500"
//                     >
//                       {description}
//                     </Typography>
//                   </div>
//                 </div>
//               )
//             )}
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default HomeCentralAdmin;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHospitalsAction,
  fetchGlobalAmbulancesAction,
} from "../../redux/adminSlice"; // adjust the path

import {
  Card,
  Typography,
} from "@material-tailwind/react";

export default function HomeCentralAdmin() {
  const dispatch = useDispatch();

  const { hopitals, ambulances, status } = useSelector((state) => state.admin_slice);

  useEffect(() => {
    dispatch(fetchAllHospitalsAction());
    dispatch(fetchGlobalAmbulancesAction());
  }, [dispatch]);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">Admin Dashboard</Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="p-4 shadow">
          <Typography variant="h6">Total Hospitals</Typography>
          <Typography variant="h2">{hopitals?.length || 0}</Typography>
        </Card>
        <Card className="p-4 shadow">
          <Typography variant="h6">Total Ambulances</Typography>
          <Typography variant="h2">{ambulances?.length || 0}</Typography>
        </Card>
        <Card className="p-4 shadow">
          <Typography variant="h6">Status</Typography>
          <Typography variant="h5" color={status === "success" ? "green" : "blue-gray"}>
            {status || "Loading..."}
          </Typography>
        </Card>
      </div>

      <Typography variant="h5" className="mb-2">Hospital List</Typography>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-blue-gray-100 shadow-sm">
          <thead className="bg-blue-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Admin</th>
            </tr>
          </thead>
          <tbody>
            {hopitals?.map((hosp) => (
              <tr key={hosp._id} className="border-t">
                <td className="px-4 py-2">{hosp.name}</td>
                <td className="px-4 py-2">{hosp.city}</td>
                <td className="px-4 py-2">{hosp.admin?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
