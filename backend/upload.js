import express from "express";
import multer from "multer";
import File from "../models/fileModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, `${Date.now()}-${originalName}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "לא הועלה קובץ." });
    }

    const fileData = {
      studentName: req.body.studentName,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
    };

    await File.create(fileData);
    res.status(200).json({ message: "קובץ הועלה בהצלחה!", fileData });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "שגיאה בשרת.", error: err.message });
  }
});

export default router;
