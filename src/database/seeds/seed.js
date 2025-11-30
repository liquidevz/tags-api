const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../../models/Category");
const Tag = require("../../models/Tag");
const logger = require("../../utils/logger");

dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    logger.info("MongoDB connected for seeding");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const categoriesData = [
  {
    name: "Geography & Timing",
    description: "Tags related to location, time, and scheduling.",
    subcategories: [
      { name: "Location", examples: ["New York", "USA", "Global", "Online"] },
      { name: "Venue/Environment", examples: ["Office", "Outdoor", "Zoom"] },
      { name: "Timeframe/Deadline", examples: ["2025-12-31", "Q4 2025"] },
      { name: "Schedule/Recurrence", examples: ["One-time", "Weekly"] },
      { name: "Time Zone", examples: ["UTC+5:30", "PST"] },
      { name: "Season/Date Context", examples: ["Spring 2026", "Holiday Season"] },
    ],
  },
  {
    name: "People & Roles",
    description: "Tags related to individuals, teams, and roles.",
    subcategories: [
      { name: "Target Audience", examples: ["Students", "Tech Enthusiasts"] },
      { name: "Stakeholder/Requester", examples: ["Marketing Manager"] },
      { name: "Participants/Team", examples: ["Solo Developer", "Team of 3"] },
      { name: "Expertise Level", examples: ["Entry-Level", "Senior Engineer"] },
      { name: "Profession/Role", examples: ["Graphic Designer"] },
      { name: "Language Skills", examples: ["English", "Python"] },
    ],
  },
  {
    name: "Domain & Category",
    description: "Tags related to industry, business, and subject matter.",
    subcategories: [
      { name: "Industry/Domain", examples: ["Healthcare", "Education"] },
      { name: "Topic/Subject", examples: ["Machine Learning"] },
      { name: "Product Category", examples: ["Electronics"] },
      { name: "Service Category", examples: ["IT Consulting"] },
      { name: "Business Model", examples: ["B2B", "Subscription"] },
      { name: "Organization Size", examples: ["Startup", "Enterprise"] },
    ],
  },
  {
    name: "Skills & Tools",
    description: "Tags related to abilities, software, and equipment.",
    subcategories: [
        { name: "Technical Skills", examples: ["Java Programming", "Data Analysis"] },
        { name: "Software/Tools", examples: ["Adobe Photoshop", "GitHub"] },
        { name: "Hardware/Equipment", examples: ["DSLR Camera", "3D Printer"] },
        { name: "Methodology/Framework", examples: ["Agile", "Scrum"] },
        { name: "Platform/Technology", examples: ["iOS", "Web App"] },
        { name: "Certifications", examples: ["PMP", "CPA"] }
    ]
  },
  {
      name: "Content & Format",
      description: "Tags related to the type, style, and format of content.",
      subcategories: [
          { name: "Content Type/Media", examples: ["Video Tutorial", "Blog Post"] },
          { name: "File Format", examples: ["PDF", "JPEG Image"] },
          { name: "Localization", examples: ["Spanish - Mexico"] },
          { name: "Style/Tone", examples: ["Casual Tone", "Professional Branding"] },
          { name: "Length/Quantity", examples: ["500 words", "30-minute video"] },
          { name: "Accessibility", examples: ["WCAG 2.1", "Closed Captions"] }
      ]
  },
  {
      name: "Intent & Objectives",
      description: "Tags related to goals, budget, and project planning.",
      subcategories: [
          { name: "Intent/Action", examples: ["Buy", "Sell", "Hire a Freelancer"] },
          { name: "Budget/Cost", examples: ["$1000-$5000"] },
          { name: "Payment Terms/Model", examples: ["Hourly Rate", "Milestone Payments"] },
          { name: "Timeline/Milestones", examples: ["Beta by Q2"] },
          { name: "Dependencies", examples: ["Requires API from Team X"] },
          { name: "Resources Available", examples: ["In-house Designer"] }
      ]
  },
  {
      name: "Constraints & Compliance",
      description: "Tags related to rules, regulations, and limitations.",
      subcategories: [
          { name: "Regulatory/Legal", examples: ["GDPR Compliant", "FDA Approved"] },
          { name: "Security/Privacy", examples: ["Encrypted", "Confidential Project"] },
          { name: "Delivery Mode", examples: ["Remote Support", "On-site Installation"] },
          { name: "Risk Level", examples: ["Low Risk", "High-Risk Environment"] },
          { name: "Ethics/Sustainability", examples: ["Fair Trade", "Eco-Friendly"] }
      ]
  },
  {
      name: "Status & Meta",
      description: "Tags related to the state and metadata of items.",
      subcategories: [
          { name: "Status/Progress", examples: ["Planned", "In Progress"] },
          { name: "Visibility/Access", examples: ["Public", "Internal Only"] },
          { name: "Version/Iteration", examples: ["v2.0", "Rev B"] },
          { name: "Review/Approval", examples: ["Manager Approval Required"] },
          { name: "Performance Metrics", examples: ["CTR > 5%", "99.9% Uptime"] }
      ]
  }
];

const seedDatabase = async () => {
  await connectDB();
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Tag.deleteMany({});
    logger.info("Previous data cleared");

    // Seed categories
    const createdCategories = await Category.insertMany(categoriesData);
    logger.info(`${createdCategories.length} categories seeded`);

    // Seed tags from examples
    const tagsToCreate = [];
    createdCategories.forEach(category => {
        category.subcategories.forEach(sub => {
            sub.examples.forEach(example => {
                tagsToCreate.push({
                    name: example,
                    category: category.slug,
                    subcategory: sub.slug,
                    description: `Example tag for ${sub.name}`,
                    type: "standard",
                    isPublic: true,
                    isActive: true
                });
            });
        });
    });

    const createdTags = await Tag.insertMany(tagsToCreate);
    logger.info(`${createdTags.length} tags seeded`);

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
