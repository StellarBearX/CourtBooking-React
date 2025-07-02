
module.exports = (req, res, next) => {
  const email = req.user?.email;
  const adminEmails = ["kunanan.ws@gmail.com"]; // ปรับให้ตรงกับ user ของคุณ

  if (adminEmails.includes(email)) {
    return next();
  } else {
    return res.status(403).json({ error: "คุณไม่มีสิทธิ์เข้าถึง (ไม่ใช่แอดมิน)" });
  }
};