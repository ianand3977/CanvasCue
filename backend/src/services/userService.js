// User service: registration, OTP, login, profile
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername, findUserById } = require('../models/user');
const { createOtp, findOtp, findLatestOtpByEmail, verifyOtp: markOtpVerified, pruneExpiredOtps } = require('../models/emailOtp');
const { sendOtpEmail } = require('../utils/email');
const { generateOtp, getExpiry } = require('../utils/otp');

async function register({ fullName, email, password, role, bio }) {
  console.log('[userService] Register called with:', { fullName, email, password: !!password, role, bio });
  if (!fullName || !email || !password || !role) {
    console.log('[userService] Missing fields:', { fullName, email, password: !!password, role });
    return { status: 400, data: { message: 'All fields required' } };
  }
  // Check OTP verified before allowing registration
  const otpRecord = await findLatestOtpByEmail(email);
  console.log('[userService] OTP record for', email, ':', otpRecord);
  if (!otpRecord || !otpRecord.verified) {
    console.log('[userService] OTP not verified for', email);
    return { status: 400, data: { message: 'OTP not verified for this email' } };
  }
  const existing = await findUserByUsername(email);
  if (existing) {
    console.log('[userService] User already exists:', email);
    return { status: 409, data: { message: 'User already exists' } };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(fullName, email, passwordHash, role, bio);
  console.log('[userService] User created:', user);
  return { status: 201, data: { id: user.id, email: user.email } };
}

async function requestOtp(email) {
  if (!email) return { status: 400, data: { message: 'Email required' } };
  const otp = generateOtp();
  const expiresAt = getExpiry();
  await createOtp(email, otp, expiresAt);
  await sendOtpEmail(email, otp);
  return { status: 200, data: { message: 'OTP sent' } };
}

async function verifyOtp({ email, otp }) {
  console.log('[userService] Verifying OTP for', email, 'with OTP', otp);
  const found = await findOtp(email, otp);
  console.log('[userService] OTP found:', found);
  if (!found) return { status: 400, data: { message: 'Invalid or expired OTP' } };
  await markOtpVerified(email, otp);
  console.log('[userService] OTP marked as verified for', email);
  return { status: 200, data: { message: 'OTP verified' } };
}

async function login({ email, password }) {
  if (!email || !password) return { status: 400, data: { message: 'Email and password required' } };
  const user = await findUserByUsername(email);
  if (!user) return { status: 404, data: { message: 'User not found' } };
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { status: 401, data: { message: 'Invalid password' } };
  // Optionally check if OTP is verified (if you want to enforce it)
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { status: 200, data: { token } };
}

async function getUserById(id) {
  const user = await findUserById(id);
  if (!user) return { status: 404, data: { message: 'User not found' } };
  // Exclude sensitive fields
  const { password_hash, ...safeUser } = user;
  return { status: 200, data: safeUser };
}

module.exports = { register, requestOtp, verifyOtp, login, getUserById };
