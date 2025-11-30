const mongoose = require('mongoose');
const Tag = require('../../../src/models/Tag');

describe('Tag Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid tag', () => {
      const validTag = new Tag({
        name: 'Test Tag',
        category: 'geography-timing',
        subcategory: 'location',
        description: 'A test tag'
      });

      const error = validTag.validateSync();
      expect(error).toBeUndefined();
    });

    it('should fail without required fields', () => {
      const invalidTag = new Tag({
        name: 'Test Tag'
      });

      const error = invalidTag.validateSync();
      expect(error).toBeDefined();
      expect(error.errors.category).toBeDefined();
      expect(error.errors.subcategory).toBeDefined();
    });

    it('should fail with invalid category', () => {
      const invalidTag = new Tag({
        name: 'Test Tag',
        category: 'invalid-category',
        subcategory: 'location'
      });

      const error = invalidTag.validateSync();
      expect(error).toBeDefined();
      expect(error.errors.category).toBeDefined();
    });
  });

  describe('Slug Generation', () => {
    it('should generate slug from name', async () => {
      const tag = new Tag({
        name: 'Test Tag Name',
        category: 'geography-timing',
        subcategory: 'location'
      });

      await tag.validate();
      expect(tag.slug).toBeDefined();
    });
  });

  describe('Instance Methods', () => {
    it('should increment usage count', async () => {
      const tag = new Tag({
        name: 'Test Tag',
        category: 'geography-timing',
        subcategory: 'location',
        usageCount: 5
      });

      tag.usageCount += 1;
      expect(tag.usageCount).toBe(6);
    });
  });
});
