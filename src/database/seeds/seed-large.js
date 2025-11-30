const mongoose = require('mongoose');
const config = require('../../config/config');
const Tag = require('../../models/Tag');
const Category = require('../../models/Category');
const logger = require('../../utils/logger');

// Comprehensive tag data based on categories
const tagData = {
  'geography-timing': {
    location: {
      countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Poland', 'Russia', 'South Korea', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'New Zealand', 'Ireland', 'Portugal', 'Greece', 'Turkey', 'UAE', 'Saudi Arabia', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Argentina', 'Chile', 'Colombia', 'Peru'],
      cities: ['New York', 'London', 'Paris', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Mumbai', 'Singapore', 'Dubai', 'Los Angeles', 'Chicago', 'San Francisco', 'Seattle', 'Boston', 'Miami', 'Austin', 'Denver', 'Portland', 'Atlanta', 'Dallas', 'Houston', 'Philadelphia', 'Phoenix', 'San Diego', 'Barcelona', 'Madrid', 'Rome', 'Milan', 'Amsterdam', 'Brussels', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Zurich', 'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Moscow', 'Seoul', 'Hong Kong', 'Shanghai', 'Beijing', 'Bangkok', 'Kuala Lumpur', 'Jakarta', 'Manila', 'Melbourne', 'Brisbane', 'Auckland', 'Dublin', 'Lisbon', 'Athens', 'Istanbul', 'Cairo', 'Cape Town', 'Johannesburg', 'Nairobi', 'Buenos Aires', 'Santiago', 'Bogota', 'Lima', 'Mexico City', 'Sao Paulo', 'Rio de Janeiro'],
      regions: ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Middle East', 'Central America', 'Caribbean', 'Southeast Asia', 'East Asia', 'South Asia', 'Central Asia', 'Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe', 'Sub-Saharan Africa', 'North Africa', 'Latin America', 'Pacific Islands', 'Scandinavia', 'Balkans', 'Mediterranean', 'Global', 'Online', 'Remote', 'Worldwide', 'International', 'Domestic', 'Local', 'Regional', 'National', 'Continental'],
      states: ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa', 'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'West Virginia', 'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Montana', 'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming']
    },
    venue: ['Office', 'Home', 'Remote', 'Hybrid', 'Outdoor', 'Indoor', 'Conference Hall', 'Meeting Room', 'Co-working Space', 'Cafe', 'Library', 'Park', 'Beach', 'Mountain', 'Stadium', 'Arena', 'Theater', 'Auditorium', 'Classroom', 'Laboratory', 'Workshop', 'Studio', 'Factory', 'Warehouse', 'Retail Store', 'Restaurant', 'Hotel', 'Hospital', 'Clinic', 'Gym', 'Sports Complex', 'Museum', 'Gallery', 'Virtual Platform', 'Zoom', 'Google Meet', 'Microsoft Teams', 'Skype', 'Webex', 'Slack', 'Discord', 'VR Space', 'Metaverse'],
    timeframe: ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', 'Within 1 week', 'Within 2 weeks', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Within 1 year', 'Immediate', 'Urgent', 'ASAP', 'Flexible', 'TBD', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    schedule: ['One-time', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually', 'Recurring', 'On-demand', 'Scheduled', 'Ad-hoc', 'Continuous', '24/7', 'Business Hours', 'Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Afternoons'],
    timezone: ['UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+5:30', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12', 'UTC-1', 'UTC-2', 'UTC-3', 'UTC-4', 'UTC-5', 'UTC-6', 'UTC-7', 'UTC-8', 'UTC-9', 'UTC-10', 'UTC-11', 'PST', 'MST', 'CST', 'EST', 'GMT', 'CET', 'EET', 'IST', 'JST', 'AEST', 'NZST'],
    season: ['Spring', 'Summer', 'Fall', 'Autumn', 'Winter', 'Holiday Season', 'Christmas', 'New Year', 'Easter', 'Thanksgiving', 'Halloween', 'Valentine', 'Diwali', 'Ramadan', 'Chinese New Year', 'Hanukkah', 'Kwanzaa', 'Black Friday', 'Cyber Monday', 'Back to School', 'Tax Season', 'Wedding Season', 'Festival Season']
  },
  'people-roles': {
    audience: ['Students', 'Professionals', 'Entrepreneurs', 'Freelancers', 'Developers', 'Designers', 'Marketers', 'Sales Teams', 'HR Professionals', 'Executives', 'Managers', 'Engineers', 'Scientists', 'Researchers', 'Teachers', 'Educators', 'Parents', 'Children', 'Teenagers', 'Young Adults', 'Adults', 'Seniors', 'Retirees', 'Tech Enthusiasts', 'Gamers', 'Athletes', 'Artists', 'Musicians', 'Writers', 'Bloggers', 'Influencers', 'Content Creators', 'Small Business Owners', 'Startups', 'Enterprise', 'Government', 'Nonprofits', 'Healthcare Workers', 'Legal Professionals', 'Financial Advisors', 'Real Estate Agents', 'Consultants', 'Coaches', 'Trainers'],
    stakeholder: ['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'VP', 'Director', 'Manager', 'Team Lead', 'Project Manager', 'Product Manager', 'Program Manager', 'Marketing Manager', 'Sales Manager', 'HR Manager', 'IT Manager', 'Operations Manager', 'Finance Manager', 'Client', 'Customer', 'Sponsor', 'Investor', 'Board Member', 'Shareholder', 'Partner', 'Vendor', 'Supplier', 'Contractor'],
    team: ['Solo', 'Pair', 'Small Team', 'Medium Team', 'Large Team', 'Cross-functional Team', 'Remote Team', 'Distributed Team', 'In-house Team', 'Outsourced Team', 'Agile Team', 'Scrum Team', 'DevOps Team', 'Engineering Team', 'Design Team', 'Marketing Team', 'Sales Team', 'Support Team', 'QA Team', 'Research Team'],
    expertise: ['Entry-Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal', 'Staff', 'Expert', 'Specialist', 'Generalist', 'Beginner', 'Intermediate', 'Advanced', 'Professional', 'Master', 'Guru', 'Ninja', 'Rockstar', 'Architect', 'Consultant'],
    profession: ['Software Developer', 'Web Developer', 'Mobile Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Cloud Engineer', 'Security Engineer', 'Network Engineer', 'System Administrator', 'Database Administrator', 'QA Engineer', 'Test Engineer', 'UI Designer', 'UX Designer', 'Graphic Designer', 'Product Designer', 'Motion Designer', 'Video Editor', 'Photographer', 'Videographer', 'Content Writer', 'Copywriter', 'Technical Writer', 'Editor', 'Translator', 'Marketing Specialist', 'SEO Specialist', 'Social Media Manager', 'Digital Marketer', 'Brand Manager', 'Product Manager', 'Project Manager', 'Business Analyst', 'Financial Analyst', 'Accountant', 'Lawyer', 'Consultant', 'HR Specialist', 'Recruiter', 'Sales Representative', 'Customer Support', 'Virtual Assistant', 'Administrative Assistant', 'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Chef', 'Teacher', 'Tutor', 'Nurse', 'Doctor', 'Therapist', 'Personal Trainer', 'Yoga Instructor'],
    language: ['English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese', 'Bengali', 'Russian', 'Japanese', 'German', 'French', 'Italian', 'Korean', 'Turkish', 'Vietnamese', 'Polish', 'Ukrainian', 'Dutch', 'Greek', 'Czech', 'Swedish', 'Romanian', 'Hungarian', 'Thai', 'Indonesian', 'Malay', 'Filipino', 'Hebrew', 'Danish', 'Finnish', 'Norwegian', 'Slovak', 'Croatian', 'Bulgarian', 'Serbian', 'Lithuanian', 'Slovenian', 'Latvian', 'Estonian', 'Multilingual', 'Bilingual']
  }
};

// Programming languages and technologies (for skills-tools)
const programmingLanguages = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Lua', 'Dart', 'Elixir', 'Clojure', 'F#', 'Objective-C', 'Shell', 'PowerShell', 'SQL', 'HTML', 'CSS', 'SASS', 'LESS', 'Assembly', 'Fortran', 'COBOL', 'Ada', 'Lisp', 'Prolog', 'Erlang', 'Julia', 'Groovy', 'Solidity', 'VHDL', 'Verilog'];

const frameworks = ['React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', '.NET Core', 'Symfony', 'CodeIgniter', 'Yii', 'CakePHP', 'Meteor', 'Ember.js', 'Backbone.js', 'Polymer', 'Aurelia', 'Preact', 'Alpine.js', 'Solid.js', 'Qwik', 'Astro'];

const databases = ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'MariaDB', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'CouchDB', 'Neo4j', 'InfluxDB', 'TimescaleDB', 'Elasticsearch', 'Solr', 'RethinkDB', 'ArangoDB', 'Dgraph', 'FaunaDB', 'PlanetScale', 'CockroachDB', 'YugabyteDB'];

const cloudPlatforms = ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly.io', 'Cloudflare', 'Linode', 'Vultr', 'OVH', 'IBM Cloud', 'Oracle Cloud', 'Alibaba Cloud', 'Tencent Cloud'];

const tools = ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'Travis CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'VS Code', 'IntelliJ IDEA', 'PyCharm', 'WebStorm', 'Sublime Text', 'Atom', 'Vim', 'Emacs', 'Eclipse', 'NetBeans', 'Xcode', 'Android Studio', 'Visual Studio', 'Postman', 'Insomnia', 'Swagger', 'Figma', 'Sketch', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro', 'Adobe After Effects', 'Blender', 'Unity', 'Unreal Engine', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Tableau', 'Power BI', 'Looker', 'Grafana', 'Prometheus', 'Datadog', 'New Relic', 'Sentry', 'Jira', 'Trello', 'Asana', 'Monday.com', 'Notion', 'Confluence', 'Slack', 'Discord', 'Zoom', 'Microsoft Teams'];

// Generate tags function
function generateTags() {
  const tags = [];
  let idCounter = 1;

  // Geography & Timing tags
  Object.entries(tagData['geography-timing']).forEach(([subcategory, items]) => {
    if (typeof items === 'object' && !Array.isArray(items)) {
      Object.entries(items).forEach(([subtype, values]) => {
        values.forEach(value => {
          tags.push({
            name: value,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: 'geography-timing',
            subcategory: subcategory,
            type: subtype,
            description: `${value} - ${subcategory} tag`,
            usageCount: Math.floor(Math.random() * 1000)
          });
        });
      });
    } else if (Array.isArray(items)) {
      items.forEach(value => {
        tags.push({
          name: value,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: 'geography-timing',
          subcategory: subcategory,
          description: `${value} - ${subcategory} tag`,
          usageCount: Math.floor(Math.random() * 1000)
        });
      });
    }
  });

  // People & Roles tags
  Object.entries(tagData['people-roles']).forEach(([subcategory, items]) => {
    items.forEach(value => {
      tags.push({
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: 'people-roles',
        subcategory: subcategory,
        description: `${value} - ${subcategory} tag`,
        usageCount: Math.floor(Math.random() * 1000)
      });
    });
  });

  // Skills & Tools - Programming Languages
  programmingLanguages.forEach(lang => {
    tags.push({
      name: lang,
      slug: lang.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'skills-tools',
      subcategory: 'programming-language',
      description: `${lang} programming language`,
      usageCount: Math.floor(Math.random() * 5000)
    });
  });

  // Skills & Tools - Frameworks
  frameworks.forEach(fw => {
    tags.push({
      name: fw,
      slug: fw.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'skills-tools',
      subcategory: 'framework',
      description: `${fw} framework`,
      usageCount: Math.floor(Math.random() * 3000)
    });
  });

  // Skills & Tools - Databases
  databases.forEach(db => {
    tags.push({
      name: db,
      slug: db.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'skills-tools',
      subcategory: 'database',
      description: `${db} database`,
      usageCount: Math.floor(Math.random() * 2000)
    });
  });

  // Skills & Tools - Cloud Platforms
  cloudPlatforms.forEach(cloud => {
    tags.push({
      name: cloud,
      slug: cloud.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'skills-tools',
      subcategory: 'cloud-platform',
      description: `${cloud} cloud platform`,
      usageCount: Math.floor(Math.random() * 2000)
    });
  });

  // Skills & Tools - Tools
  tools.forEach(tool => {
    tags.push({
      name: tool,
      slug: tool.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'skills-tools',
      subcategory: 'tool',
      description: `${tool} development tool`,
      usageCount: Math.floor(Math.random() * 1500)
    });
  });

  // Generate more tags to reach 100,000+
  const additionalCategories = [
    { category: 'domain-category', subcategories: ['industry', 'topic', 'product', 'service'] },
    { category: 'content-format', subcategories: ['media-type', 'file-format', 'style'] },
    { category: 'intent-objectives', subcategories: ['action', 'budget', 'timeline'] },
    { category: 'constraints-compliance', subcategories: ['regulatory', 'security', 'delivery'] },
    { category: 'status-meta', subcategories: ['status', 'visibility', 'version'] }
  ];

  const industries = ['Healthcare', 'Education', 'Finance', 'Technology', 'Retail', 'Manufacturing', 'Construction', 'Real Estate', 'Transportation', 'Logistics', 'Hospitality', 'Tourism', 'Entertainment', 'Media', 'Publishing', 'Advertising', 'Marketing', 'Telecommunications', 'Energy', 'Utilities', 'Agriculture', 'Mining', 'Pharmaceutical', 'Biotechnology', 'Aerospace', 'Automotive', 'Chemical', 'Food & Beverage', 'Fashion', 'Beauty', 'Sports', 'Fitness', 'Gaming', 'E-commerce', 'SaaS', 'Consulting', 'Legal', 'Accounting', 'Insurance', 'Banking', 'Investment', 'Nonprofit', 'Government', 'Military', 'Security'];

  const topics = ['Machine Learning', 'Artificial Intelligence', 'Data Science', 'Blockchain', 'Cryptocurrency', 'IoT', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development', 'Web Development', 'Game Development', 'AR/VR', 'Quantum Computing', 'Big Data', 'Analytics', 'Business Intelligence', 'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Email Marketing', 'Affiliate Marketing', 'E-commerce', 'Dropshipping', 'Print on Demand', 'Freelancing', 'Remote Work', 'Entrepreneurship', 'Startup', 'Product Management', 'Project Management', 'Agile', 'Scrum', 'Lean', 'Six Sigma', 'Quality Assurance', 'User Experience', 'User Interface', 'Design Thinking', 'Branding', 'Photography', 'Videography', 'Animation', 'Music Production', 'Podcasting', 'Blogging', 'Writing', 'Editing', 'Translation', 'Teaching', 'Coaching', 'Mentoring', 'Fitness', 'Nutrition', 'Wellness', 'Mental Health', 'Meditation', 'Yoga', 'Travel', 'Cooking', 'Gardening', 'DIY', 'Crafts', 'Art', 'Music', 'Literature', 'History', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Geography', 'Economics', 'Politics', 'Philosophy', 'Psychology', 'Sociology', 'Anthropology', 'Law', 'Ethics', 'Sustainability', 'Environment', 'Climate Change', 'Renewable Energy', 'Organic Farming'];

  // Add industry tags
  industries.forEach(industry => {
    tags.push({
      name: industry,
      slug: industry.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'domain-category',
      subcategory: 'industry',
      description: `${industry} industry`,
      usageCount: Math.floor(Math.random() * 2000)
    });
  });

  // Add topic tags
  topics.forEach(topic => {
    tags.push({
      name: topic,
      slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'domain-category',
      subcategory: 'topic',
      description: `${topic} topic`,
      usageCount: Math.floor(Math.random() * 1500)
    });
  });

  // Generate combination tags to reach 100,000+
  const prefixes = ['Advanced', 'Basic', 'Professional', 'Enterprise', 'Small Business', 'Startup', 'Corporate', 'Personal', 'Commercial', 'Industrial', 'Academic', 'Research', 'Development', 'Production', 'Testing', 'Beta', 'Alpha', 'Stable', 'Legacy', 'Modern', 'Traditional', 'Innovative', 'Creative', 'Technical', 'Strategic', 'Tactical', 'Operational', 'Executive', 'Management', 'Leadership'];
  
  const suffixes = ['Solution', 'Service', 'Platform', 'Tool', 'Framework', 'System', 'Application', 'Software', 'Hardware', 'Product', 'Package', 'Suite', 'Kit', 'Bundle', 'Module', 'Component', 'Plugin', 'Extension', 'Addon', 'Integration', 'API', 'SDK', 'Library', 'Resource', 'Template', 'Theme', 'Design', 'Pattern', 'Strategy', 'Approach'];

  // Generate combination tags
  for (let i = 0; i < prefixes.length && tags.length < 100000; i++) {
    for (let j = 0; j < topics.length && tags.length < 100000; j++) {
      for (let k = 0; k < suffixes.length && tags.length < 100000; k++) {
        const name = `${prefixes[i]} ${topics[j]} ${suffixes[k]}`;
        tags.push({
          name: name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: 'domain-category',
          subcategory: 'topic',
          description: `${name} - comprehensive solution`,
          usageCount: Math.floor(Math.random() * 100)
        });
      }
    }
  }

  return tags;
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.uri);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await Tag.deleteMany({});
    await Category.deleteMany({});
    logger.info('Cleared existing data');

    // Create categories
    const categories = [
      {
        name: 'Geography & Timing',
        slug: 'geography-timing',
        description: 'Location, venue, timeframe, schedule, timezone, and seasonal tags',
        subcategories: ['location', 'venue', 'timeframe', 'schedule', 'timezone', 'season']
      },
      {
        name: 'People & Roles',
        slug: 'people-roles',
        description: 'Target audience, stakeholders, team, expertise, profession, and language tags',
        subcategories: ['audience', 'stakeholder', 'team', 'expertise', 'profession', 'language']
      },
      {
        name: 'Skills & Tools',
        slug: 'skills-tools',
        description: 'Technical skills, software, hardware, methodology, platform, and certifications',
        subcategories: ['programming-language', 'framework', 'database', 'cloud-platform', 'tool', 'methodology']
      },
      {
        name: 'Domain & Category',
        slug: 'domain-category',
        description: 'Industry, topic, product, service, business model, and market scope',
        subcategories: ['industry', 'topic', 'product', 'service', 'business-model', 'market']
      },
      {
        name: 'Content & Format',
        slug: 'content-format',
        description: 'Content type, file format, localization, style, length, and accessibility',
        subcategories: ['media-type', 'file-format', 'localization', 'style', 'length', 'accessibility']
      },
      {
        name: 'Intent & Objectives',
        slug: 'intent-objectives',
        description: 'Intent, budget, payment terms, timeline, dependencies, and resources',
        subcategories: ['action', 'budget', 'payment', 'timeline', 'dependencies', 'resources']
      },
      {
        name: 'Constraints & Compliance',
        slug: 'constraints-compliance',
        description: 'Regulatory, security, delivery mode, risk level, and ethics',
        subcategories: ['regulatory', 'security', 'delivery', 'risk', 'ethics']
      },
      {
        name: 'Status & Meta',
        slug: 'status-meta',
        description: 'Status, visibility, version, review, and performance metrics',
        subcategories: ['status', 'visibility', 'version', 'review', 'metrics']
      }
    ];

    await Category.insertMany(categories);
    logger.info(`Created ${categories.length} categories`);

    // Generate and insert tags in batches
    logger.info('Generating 100,000+ tags...');
    const allTags = generateTags();
    logger.info(`Generated ${allTags.length} tags`);

    const batchSize = 1000;
    for (let i = 0; i < allTags.length; i += batchSize) {
      const batch = allTags.slice(i, i + batchSize);
      await Tag.insertMany(batch, { ordered: false });
      logger.info(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allTags.length / batchSize)}`);
    }

    logger.info(`✅ Successfully seeded database with ${allTags.length} tags and ${categories.length} categories`);
    
    // Log statistics
    const stats = await Tag.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    logger.info('Tag distribution by category:');
    stats.forEach(stat => {
      logger.info(`  ${stat._id}: ${stat.count} tags`);
    });

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
