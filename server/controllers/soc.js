const SOC = require('../models/SOC');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, address, establishedDate, username, password, role, photo, idCardNumber, businessLicense } = req.body;
  try {
    const newSOC = new SOC({ name, address, establishedDate, username, password, role, photo, idCardNumber, businessLicense });
    await newSOC.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const soc = await SOC.findOne({ username });
    if (!soc || !(await soc.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: soc._id, role: soc.role }, 'YOUR_SECRET_KEY', { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
