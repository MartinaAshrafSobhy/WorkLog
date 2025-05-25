import { asyncHandler } from "../../utils/errorHandler.js"
import userModel from "../../../DB/models/user.model.js";
import shiftModel from "../../../DB/models/shift.model.js";
import attendanceModel from "../../../DB/models/attendance.model.js";
import fs from "fs"
import xlsx from "xlsx"





  function parseShiftTimeRange(timeRangeStr) {
  if (!timeRangeStr || typeof timeRangeStr !== 'string') {
    return { startTime: null, endTime: null };
  }

  const [startRaw, endRaw] = timeRangeStr.split('-').map(t => t.trim());

  const normalizeTime = (t) => {
    if (!t) return null;
    const parts = t.split(':');
    const h = parts[0].padStart(2, '0');
    const m = parts[1] ? parts[1].padStart(2, '0') : '00';
    return `${h}:${m}`;
  };

  return {
    startTime: normalizeTime(startRaw),
    endTime: normalizeTime(endRaw),
  };
}

function toMinutes(timeStr) {
 
  if (typeof timeStr === 'number') {

    const totalMinutes = Math.round(timeStr * 24 * 60);
    return totalMinutes;
  }

  
  if (typeof timeStr === 'string') {
    const date = new Date(`1970-01-01T${timeStr}`);
    if (!isNaN(date)) {
      return date.getHours() * 60 + date.getMinutes();
    }
  }

  return null; 
}


  
  export const importAttendance = async (req, res) => {
    try {
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      for (const row of data) {
        const name = row["name"]?.trim();
        const code = row["code"];
        const Mpermission= row["إذن ص"] ||null;
        const Epermission= row["إذن م"] ||null;
        const note=row["note"]||null;
        const day=row['day'];
        const building=row['building'] || 'Old-Building';

        let rawDate = row["date"];
        let date
        if (typeof rawDate === "number") {
          date = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
        } else {
          date = new Date(rawDate);
        }
  
        const arrivalTime = row["arrives"] || null;
        const leavingTime = row["leaves"] || null;
        const shiftNumber = row["shiftNumber"] || "default";
        const shiftTimeRange = row["time"]; 
        const { startTime, endTime } = parseShiftTimeRange(shiftTimeRange);
  
        if (!name || !date || isNaN(date.getTime())) continue;
  
       
        let user = await userModel.findOne({ name });
     
        
        if (!user) {
          user = await userModel.create({ name, code });
        }
  
       
        let shift = await shiftModel.findOne({ number: shiftNumber });
        if (!shift) {
          shift = await shiftModel.create({
            number: shiftNumber,
            startTime,
            endTime,
          });
        }
  
       
let status = "absent";

if (arrivalTime) {
  const shiftStart = toMinutes(shift.startTime);
  const arrival = toMinutes(arrivalTime);
  const gracePeriod = 15;

  if (arrival <= shiftStart + gracePeriod) {
    status = "present";
  } else {
    status = "late";
  }
}

      
        const existing = await attendanceModel.findOne({ userId: user._id, date });
        if (existing) continue;
  
        const attendance = new attendanceModel({
          userId: user._id,
          shiftId: shift._id,
          date,
          arrivalTime,
          leavingTime,
          status,
          Mpermission,
          Epermission,
          note,
          day,
          building,

        });
  
        await attendance.save();
      }
  
      res.status(201).json({ message: "تم الاستيراد والتخزين بنجاح" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "حدث خطأ أثناء الاستيراد" });
    }
  };
  
  export const allSheets=async(req,res,next)=>{
   
          const sheet=await attendanceModel.find()
          .populate({
            'path':"userId",
            'select':'name code'
          })
          .populate({
            'path':'shiftId',
            'select':'number'
          })
  
          return res.status(200).json({meassage:"done",sheet})
      };


export const updateRecord = asyncHandler(async (req, res, next) => {
  const { date, userCode, note } = req.body;

  
  const user = await userModel.findOne({ code: userCode });
  if (!user) {
    return next(new Error("User with this code does not exist", { cause: 404 }));
  }




 
const rawDate = new Date(date); // "2024-11-05"

const startOfDay = new Date(rawDate);
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date(rawDate);
endOfDay.setUTCHours(23, 59, 59, 999);

 const record = await attendanceModel.findOne({
    userId: user._id,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
  

  


  if (!record) {
    return next(new Error("Attendance record does not exist", { cause: 404 }));
  }

  record.note = note;
  await record.save();

  res.json({ message: "Note added successfully", record });
});
