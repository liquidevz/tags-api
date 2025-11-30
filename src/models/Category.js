const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    subcategories: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      slug: {
        type: String,
        required: true,
        lowercase: true
      },
      description: {
        type: String,
        trim: true
      },
      examples: [{
        type: String,
        trim: true
      }],
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    order: {
      type: Number,
      default: 0
    },
    icon: String,
    color: {
      type: String,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      default: '#3B82F6'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    tagCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
categorySchema.index({ slug: 1, isActive: 1 });
categorySchema.index({ order: 1 });

// Pre-save middleware to generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  // Generate slugs for subcategories
  if (this.subcategories && this.subcategories.length > 0) {
    this.subcategories.forEach(sub => {
      if (!sub.slug) {
        sub.slug = slugify(sub.name, { lower: true, strict: true });
      }
    });
  }
  
  next();
});

// Virtual to get active subcategories
categorySchema.virtual('activeSubcategories').get(function () {
  return this.subcategories.filter(sub => sub.isActive);
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
