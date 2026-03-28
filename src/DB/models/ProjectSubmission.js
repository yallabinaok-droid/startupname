import mongoose, { Schema, model } from "mongoose";

export const partnershipTypes = {
    fundingOnly: "تمويل فقط",
    workingPartner: "شريك عامل",
    consultant: "استشاري",
    mixed: "مزيج"
};

export const projectStatusTypes = {
    ideaOnly: "فكرة فقط",
    started: "بدأ فعلاً"
};

export const businessModelTypes = {
    onlineOnly: "أونلاين فقط",
    physicalOffice: "مقر فيزيائي",
    mixed: "مختلط"
};

export const submissionStatusTypes = {
    pending: "pending",
    under_review: "under_review",
    approved: "approved",
    rejected: "rejected",
    published: "published"
};

export const packageTypes = {
    basic: "basic",      // 350 ج
    pro: "pro",          // 700 ج
    premium: "premium"   // 1200 ج
};

const projectSubmissionSchema = new Schema({

    // ==================== بيانات المستخدم ====================
    user: {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true }
    },

    // ==================== بيانات المشروع ====================
    project: {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },           // وصف المشروع كامل
        financialStudy: { type: String, required: true },        // الدراسة المالية + التوقعات
        amountNeeded: { type: Number, required: true, min: 5000 },
        equityPercentage: { type: Number, required: true, min: 5, max: 49 }
    },

    // ==================== نوع الشراكة ====================
    partnershipType: {
        type: String,
        enum: Object.values(partnershipTypes),
        required: true
    },

    // ==================== خطة الخروج ====================
    exitStrategy: {
        type: String,
        // required: true
    },

    // ==================== حالة المشروع ====================
    projectStatus: {
        type: String,
        enum: Object.values(projectStatusTypes),
        required: true
    },
    projectDuration: { type: String, trim: true },           // مدة العمل حتى الآن
    achievementsSoFar: { type: String },                     // إيه اللي اتعمل لحد دلوقتي

    // ==================== السجل التجاري والمقر ====================
    hasCommercialRegister: { type: Boolean, required: true },
    hasOffice: { type: Boolean, required: true },
    businessModel: {
        type: String,
        enum: Object.values(businessModelTypes),
        required: true
    },

    // ==================== الفيديو ====================
    video: {
        originalFileName: { type: String },
        secure_url: { type: String, },        // رابط الفيديو بعد الرفع (Cloudinary)
        public_id: { type: String,  },
        thumbnailUrl: { type: String },
        duration: { type: Number },                          // بالثواني
        uploadedAt: { type: Date, default: Date.now }
    },

    // ==================== إقرار المخاطر ====================
    riskAcknowledgment: {
        accepted: { type: Boolean, default: false },
        acceptedAt: { type: Date }
    },

    // ==================== حالة التقديم ====================
    status: {
        type: String,
        enum: Object.values(submissionStatusTypes),
        default: submissionStatusTypes.pending
    },

    // ==================== باقة الاشتراك ====================
    packageType: {
        type: String,
        enum: Object.values(packageTypes),
        required: true
    },
    packagePrice: {
        type: Number,
        required: true,
        enum: [350, 700, 1200]
    },

    // ==================== بيانات إدارية ====================
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: { type: Date },
    adminNotes: { type: String },

    // للرجوع للمستخدم اللي قدم (لو عندك نظام يوزر)
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
projectSubmissionSchema.index({ "user.email": 1 });
projectSubmissionSchema.index({ status: 1, submittedAt: -1 });
projectSubmissionSchema.index({ "project.name": "text", "project.description": "text" });

const ProjectSubmission = mongoose.model("ProjectSubmission", projectSubmissionSchema);

export default ProjectSubmission;