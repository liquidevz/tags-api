const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    apiKeys: [{
      key: {
        type: String,
        required: true,
        unique: true,
        index: true
      },
      name: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      },
      tier: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free'
      },
      rateLimit: {
        requestsPerHour: {
          type: Number,
          default: 100
        },
        requestsPerDay: {
          type: Number,
          default: 1000
        }
      },
      usage: {
        totalRequests: {
          type: Number,
          default: 0
        },
        lastUsed: Date
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      expiresAt: Date
    }],
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user'
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'active'
      },
      startDate: Date,
      endDate: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'apiKeys.key': 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate API key
userSchema.methods.generateApiKey = function (name, tier = 'free') {
  const apiKey = `sk_${tier}_${uuidv4().replace(/-/g, '')}`;
  
  const rateLimits = {
    free: { requestsPerHour: 100, requestsPerDay: 1000 },
    basic: { requestsPerHour: 1000, requestsPerDay: 10000 },
    pro: { requestsPerHour: 5000, requestsPerDay: 100000 },
    enterprise: { requestsPerHour: 50000, requestsPerDay: 1000000 }
  };
  
  this.apiKeys.push({
    key: apiKey,
    name,
    tier,
    isActive: true,
    rateLimit: rateLimits[tier],
    usage: {
      totalRequests: 0
    }
  });
  
  return apiKey;
};

// Instance method to validate API key
userSchema.methods.validateApiKey = function (apiKey) {
  const key = this.apiKeys.find(k => k.key === apiKey && k.isActive);
  
  if (!key) return null;
  
  // Check if key is expired
  if (key.expiresAt && key.expiresAt < new Date()) {
    return null;
  }
  
  return key;
};

// Static method to find by API key
userSchema.statics.findByApiKey = async function (apiKey) {
  return this.findOne({
    'apiKeys.key': apiKey,
    'apiKeys.isActive': true,
    isActive: true
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
