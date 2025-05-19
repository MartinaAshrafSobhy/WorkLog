import attendanceModel from "../../../DB/models/attendance.model.js";
import userModel from "../../../DB/models/user.model.js"; 
import { asyncHandler } from "../../utils/errorHandler.js";

export const generateMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year, code } = req.query;

  const matchConditions = {};

  let user = null;

  if (code) {
    
    user = await userModel.findOne({ code });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    matchConditions.userId = user._id;
  }


  if (month && year) {
    const monthStr = month.toString().padStart(2, "0");
    const startDate = new Date(`${year}-${monthStr}-01T00:00:00.000Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
    matchConditions.date = { $gte: startDate, $lt: endDate };
  }

  const report = await attendanceModel.aggregate([
    { $match: matchConditions },
    {
      $addFields: {
        dailyPermission: {
          $sum: [
            { $toDouble: { $ifNull: ["$Epermission", "0"] } },
            { $toDouble: { $ifNull: ["$Mpermission", "0"] } }
          ]
        }
      }
    },
    {
      $group: {
        _id: "$userId",
        totalPresent: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        totalLate: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
        totalPermission: { $max: "$dailyPermission" },
        notes: { $push: "$note" },
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        code: "$user.code",
        shift: "$user.shift",
        totalPresent: 1,
        totalAbsent: 1,
        totalLate: 1,
        totalPermission: 1,
        notes: 1,
      }
    }
  ]);
  if (!report.length) {
    return res.status(404).json({ success: false, message: "No attendance records found" });
  }
  return res.json({ success: true, report })
}
)


export const generateYearReport = asyncHandler(async (req, res) => {
  
    
    let { year } = req.body;

    
    const startDate = new Date(year, 0, 1); 
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); 

   
    const report = await attendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
          totalIncentives: { $sum: "$incentives" },
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          role: "$user.role",
          department: "$user.department",
          shift: "$user.shift",
          totalPresent: 1,
          totalAbsent: 1,
          totalLate: 1,
          totalPermission: 1,
        },
      },
    ]);

  

     res.json({ message: "Done", report });

 return  res.status(500).json({ message: "false", message: "Server Error", error: error.message });
  
});








export const monthlyReportForUser = asyncHandler(async (req, res) => {
  const { month, year, code } = req.query;



  if (!code) {
    return res.status(400).json({ success: false, message: "Valid userCode is required" });
  }

  const user = await userModel.findOne({code});
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }


  const matchConditions = { userId: user._id };

  if (month && year) {
    const monthStr = month.toString().padStart(2, "0");
    const startDate = new Date(`${year}-${monthStr}-01T00:00:00.000Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
    matchConditions.date = { $gte: startDate, $lt: endDate };
  }

  const report = await attendanceModel.aggregate([
    { $match: matchConditions },
    {
      $addFields: {
        dailyPermission: {
          $sum: [
            { $toDouble: { $ifNull: ["$Epermission", "0"] } },
            { $toDouble: { $ifNull: ["$Mpermission", "0"] } },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalPresent: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        totalLate: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
        totalPermission: { $max: "$dailyPermission" },
        notes: { $push: "$note" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
      
        
      },
      
  
    { $unwind: { path: "$user" } },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        code: "$user.code",
        totalPresent: 1,
        totalAbsent: 1,
        totalLate: 1,
        totalPermission: 1,
        notes: 1,
      },
    },
  ]);

  if (!report.length) {
    return res.status(404).json({ success: false, message: "No attendance records found" });
  }

  return res.json({ success: true, report: report[0] });
});

