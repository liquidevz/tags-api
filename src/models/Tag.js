const mongoose = require('mongoose');
const slugify = require('slugify');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      maxlength: [100, 'Tag name cannot exceed 100 characters'],
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'geography-timing',
        'people-roles',
        'domain-category',
        'skills-tools',
        'content-format',
        'intent-objectives',
        'constraints-compliance',
        'status-meta'
      ],
      index: true
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: ['standard', 'custom', 'system'],
      default: 'standard',
      index: true
    },
    metadata: {
      color: {
        type: String,
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        default: '#3B82F6'
      },
      icon: String,
      priority: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      weight: {
        type: Number,
        min: 0,
        default: 1
      }
    },
    aliases: [{
      type: String,
      trim: true
    }],
    relatedTags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    searchKeywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    validationRules: {
      minLength: Number,
      maxLength: Number,
      pattern: String,
      required: Boolean
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
tagSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' });
tagSchema.index({ category: 1, subcategory: 1 });
tagSchema.index({ isActive: 1, isPublic: 1 });
tagSchema.index({ usageCount: -1 });
tagSchema.index({ createdAt: -1 });
tagSchema.index({ slug: 1, isActive: 1 });

// Compound indexes for common queries
tagSchema.index({ category: 1, isActive: 1, usageCount: -1 });
tagSchema.index({ subcategory: 1, isActive: 1, usageCount: -1 });

// Pre-save middleware to generate slug
tagSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    
    // Add name to search keywords if not already present
    if (!this.searchKeywords.includes(this.name.toLowerCase())) {
      this.searchKeywords.push(this.name.toLowerCase());
    }
  }
  next();
});

// Virtual for full category path
tagSchema.virtual('categoryPath').get(function () {
  return `${this.category}/${this.subcategory}`;
});

// Instance method to increment usage count
tagSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  return this.save();
};

// Static method to find popular tags
tagSchema.statics.findPopular = function (limit = 10) {
  return this.find({ isActive: true, isPublic: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method to find by category
tagSchema.statics.findByCategory = function (category, options = {}) {
  const query = { category, isActive: true, isPublic: true };
  return this.find(query)
    .sort(options.sort || { usageCount: -1 })
    .limit(options.limit || 50);
};

// Static method for advanced search
tagSchema.statics.advancedSearch = function (filters) {
  const query = {};
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.subcategory) {
    query.subcategory = filters.subcategory;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  } else {
    query.isActive = true;
  }
  
  if (filters.isPublic !== undefined) {
    query.isPublic = filters.isPublic;
  } else {
    query.isPublic = true;
  }
  
  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }
  
  return this.find(query);
};

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
