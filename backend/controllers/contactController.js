const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure email transporter (you'll need to set up your email service)
const createEmailTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Submit contact form
const submitContactForm = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            phone,
            subject,
            message,
            inquiryType,
            branch
        } = req.body;

        // Get client metadata
        const metadata = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            referrer: req.get('Referrer'),
            source: 'website'
        };

        // Create contact entry
        const contact = new Contact({
            name,
            email,
            phone,
            subject,
            message,
            inquiryType,
            branch: branch || undefined,
            metadata
        });

        await contact.save();

        // Send confirmation email to user
        try {
            await sendConfirmationEmail(contact);
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        // Send notification email to admin
        try {
            await sendAdminNotification(contact);
        } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully. We will get back to you soon.',
            data: {
                contactId: contact._id,
                submittedAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form. Please try again.',
            error: error.message
        });
    }
};

// Get all contacts (admin only)
const getContacts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            inquiryType,
            priority,
            assignedTo,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            dateFrom,
            dateTo
        } = req.query;

        const filter = {};

        if (status) filter.status = status;
        if (inquiryType) filter.inquiryType = inquiryType;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [contacts, totalCount] = await Promise.all([
            Contact.find(filter)
                .populate('assignedTo', 'firstName lastName email')
                .populate('branch', 'name')
                .populate('responses.respondedBy', 'firstName lastName')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Contact.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.json({
            success: true,
            data: {
                contacts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalCount,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
};

// Get single contact (admin only)
const getContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('branch', 'name location')
            .populate('responses.respondedBy', 'firstName lastName email')
            .populate('readBy.user', 'firstName lastName');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read by current user
        await contact.markAsRead(req.user.id);

        res.json({
            success: true,
            data: { contact }
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact',
            error: error.message
        });
    }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, priority, tags, followUpDate } = req.body;

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Update fields
        if (status) await contact.updateStatus(status);
        if (assignedTo !== undefined) contact.assignedTo = assignedTo;
        if (priority) contact.priority = priority;
        if (tags) contact.tags = tags;
        if (followUpDate) contact.followUpDate = new Date(followUpDate);

        await contact.save();

        const updatedContact = await Contact.findById(id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('branch', 'name');

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: { contact: updatedContact }
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
            error: error.message
        });
    }
};

// Add response to contact (admin only)
const addContactResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, isInternal = false, sendEmail = true } = req.body;

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.addResponse(req.user.id, message, isInternal);

        // Send email response to user if not internal
        if (!isInternal && sendEmail) {
            try {
                await sendResponseEmail(contact, message, req.user);
            } catch (emailError) {
                console.error('Error sending response email:', emailError);
            }
        }

        const updatedContact = await Contact.findById(id)
            .populate('responses.respondedBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Response added successfully',
            data: { contact: updatedContact }
        });
    } catch (error) {
        console.error('Error adding response:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding response',
            error: error.message
        });
    }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
};

// Get contact statistics (admin only)
const getContactStatistics = async (req, res) => {
    try {
        const statistics = await Contact.getStatistics();

        res.json({
            success: true,
            data: { statistics }
        });
    } catch (error) {
        console.error('Error fetching contact statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact statistics',
            error: error.message
        });
    }
};

// Email helper functions
const sendConfirmationEmail = async (contact) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@haramayaredcross.org',
        to: contact.email,
        subject: 'Thank you for contacting Haramaya University Red Cross Club',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                    <h1>Haramaya University Red Cross Club</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Thank you for your message, ${contact.name}!</h2>
                    <p>We have received your inquiry and will get back to you as soon as possible.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Your Message Details:</h3>
                        <p><strong>Subject:</strong> ${contact.subject}</p>
                        <p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>
                        <p><strong>Submitted:</strong> ${contact.createdAt.toLocaleString()}</p>
                        <p><strong>Reference ID:</strong> ${contact._id}</p>
                    </div>
                    
                    <p>If you have an urgent matter, please call our emergency hotline: <strong>+251-91-123-4567</strong></p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px;">
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendAdminNotification = async (contact) => {
    const transporter = createEmailTransporter();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@haramayaredcross.org';

    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@haramayaredcross.org',
        to: adminEmail,
        subject: `New Contact Form Submission - ${contact.inquiryType.toUpperCase()}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                    <h1>New Contact Form Submission</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Contact Details:</h2>
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>
                    <p><strong>Priority:</strong> ${contact.priority}</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Message:</h3>
                        <p>${contact.message}</p>
                    </div>
                    
                    <p><strong>Submitted:</strong> ${contact.createdAt.toLocaleString()}</p>
                    <p><strong>Contact ID:</strong> ${contact._id}</p>
                    
                    <div style="margin-top: 20px;">
                        <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/contacts/${contact._id}" 
                           style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            View in Admin Panel
                        </a>
                    </div>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendResponseEmail = async (contact, responseMessage, respondedBy) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@haramayaredcross.org',
        to: contact.email,
        subject: `Response to your inquiry: ${contact.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                    <h1>Haramaya University Red Cross Club</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Response to your inquiry</h2>
                    <p>Dear ${contact.name},</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p>${responseMessage}</p>
                    </div>
                    
                    <p>Responded by: ${respondedBy.firstName} ${respondedBy.lastName}</p>
                    
                    <p>If you have any further questions, please don't hesitate to contact us.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p><strong>Reference ID:</strong> ${contact._id}</p>
                        <p style="color: #6b7280; font-size: 14px;">
                            This message was sent in response to your inquiry submitted on ${contact.createdAt.toLocaleDateString()}.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    submitContactForm,
    getContacts,
    getContact,
    updateContactStatus,
    addContactResponse,
    deleteContact,
    getContactStatistics
};