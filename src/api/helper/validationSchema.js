// schema.js
const Joi = require('joi');

// Importing joi-password and extending Joi with its functionality
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

// Example schema for validating user input
const userSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
        .message("Please provide a valid email address."),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .min(8)
        .messages({
            "password.minOfUppercase":
                "password should contain at least {#min} uppercase character",
            "password.minOfSpecialCharacters":
                "password should contain at least {#min} special character",
            "password.minOfLowercase":
                "password should contain at least {#min} lowercase character",
            "password.minOfNumeric":
                "password should contain at least {#min} numeric character",
            "password.noWhiteSpaces": "password should not contain white spaces",
            "password.min": "password length must be password",
        }),
    profilePicture: Joi.string().optional(),
    bio: Joi.string().optional(),
});

// Schema for validating task creation input
const taskCreateSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title is required.',
        'string.empty': 'Title cannot be empty.'
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description is required.',
        'string.empty': 'Description cannot be empty.'
    }),
    dueDate: Joi.date().iso().required().messages({
        'any.required': 'Due date is required.',
        'date.iso': 'Due date must be in ISO format (YYYY-MM-DD).'
    })
});

// Schema for validating task update input
const taskUpdateSchema = Joi.object({
    title: Joi.string().optional().messages({
        'string.base': 'Title must be a string.',
        'string.empty': 'Title cannot be empty.'
    }),
    description: Joi.string().optional().messages({
        'string.base': 'Description must be a string.',
        'string.empty': 'Description cannot be empty.'
    }),
    dueDate: Joi.date().iso().optional().messages({
        'date.base': 'Due date must be a valid date.',
        'date.format': 'Due date must be in ISO format (YYYY-MM-DD).'
    }),
    completed: Joi.boolean().optional().messages({
        'boolean.base': 'Completed status must be a boolean value.'
    }),
});

const userTaskSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .message("Please provide a valid email address."),
    profilePicture: Joi.string().allow('').optional(),
    bio: Joi.string().allow('').optional(),
    deviceToken: Joi.string().allow('').optional(),
    task_title: Joi.string().required().messages({
        'any.required': 'Title is required.',
        'string.empty': 'Title cannot be empty.'
    }),
    task_description: Joi.string().required().messages({
        'any.required': 'Description is required.',
        'string.empty': 'Description cannot be empty.'
    }),
    task_dueDate: Joi.date().iso().required().messages({
        'any.required': 'Due date is required.',
        'date.iso': 'Due date must be in ISO format (YYYY-MM-DD).'
    }),
});

module.exports = {
    userSchema,
    taskCreateSchema,
    taskUpdateSchema,
    userTaskSchema
};
