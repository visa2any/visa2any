/*
  Warnings:

  - Added the required column `consulateInfo` to the `visa_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `visa_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validLanguages` to the `visa_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visaCategory` to the `visa_requirements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "consulates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "contact" JSONB NOT NULL,
    "services" JSONB NOT NULL,
    "workingHours" JSONB NOT NULL,
    "appointments" JSONB NOT NULL,
    "vfsCenter" BOOLEAN NOT NULL DEFAULT false,
    "casvEnabled" BOOLEAN NOT NULL DEFAULT false,
    "onlineServices" JSONB NOT NULL,
    "jurisdictionStates" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "consulateId" TEXT,
    "type" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "confirmationCode" TEXT,
    "requirements" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "appointments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_consulateId_fkey" FOREIGN KEY ("consulateId") REFERENCES "consulates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medical_exams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "clinicAddress" JSONB NOT NULL,
    "examType" TEXT NOT NULL,
    "scheduledDate" DATETIME,
    "completedDate" DATETIME,
    "results" JSONB,
    "validUntil" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "medical_exams_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "sourceLanguage" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "originalFile" TEXT NOT NULL,
    "translatedFile" TEXT,
    "apostilleRequired" BOOLEAN NOT NULL DEFAULT false,
    "apostilleFile" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "translatorInfo" JSONB,
    "cost" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "translations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "application_tracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "applicationNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PREPARING',
    "submittedDate" DATETIME,
    "lastUpdate" DATETIME,
    "estimatedDecision" DATETIME,
    "decisionDate" DATETIME,
    "result" TEXT,
    "tracking" JSONB NOT NULL,
    "notifications" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "application_tracking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorImage" TEXT,
    "publishDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readTime" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB NOT NULL,
    "country" TEXT,
    "flag" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'Intermediário',
    "type" TEXT NOT NULL DEFAULT 'Notícia',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "sourceUrl" TEXT,
    "sponsored" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blog_post_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_post_bookmarks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_post_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_post_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blog_post_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "blog_post_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "blog_post_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "news_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "country" TEXT,
    "flag" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastChecked" DATETIME,
    "checkInterval" INTEGER NOT NULL DEFAULT 60,
    "keywords" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "auto_news_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auto_news_logs_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "news_sources" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "whatsapp_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countries" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "social_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogPostId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "hashtags" JSONB NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "error" TEXT,
    "engagement" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "social_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accountId" TEXT,
    "pageId" TEXT,
    "settings" JSONB NOT NULL,
    "lastSync" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "social_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "social_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorId" TEXT,
    "content" TEXT NOT NULL,
    "sentiment" TEXT,
    "needsResponse" BOOLEAN NOT NULL DEFAULT false,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "social_comment_replies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "respondedBy" TEXT NOT NULL DEFAULT 'sofia',
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "social_comment_replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "social_comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "website" TEXT,
    "profileImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "referralCode" TEXT NOT NULL,
    "customLinks" JSONB,
    "commissionRate" REAL NOT NULL DEFAULT 0.10,
    "paymentMethod" TEXT NOT NULL DEFAULT 'PIX',
    "paymentDetails" JSONB NOT NULL,
    "totalEarnings" REAL NOT NULL DEFAULT 0,
    "pendingEarnings" REAL NOT NULL DEFAULT 0,
    "paidEarnings" REAL NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "totalConversions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" REAL NOT NULL DEFAULT 0,
    "lastActivity" DATETIME,
    "bio" TEXT,
    "socialMedia" JSONB,
    "notes" TEXT,
    "approvedAt" DATETIME,
    "approvedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "affiliate_referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "clickId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "conversionType" TEXT NOT NULL,
    "conversionValue" REAL NOT NULL,
    "commissionRate" REAL NOT NULL,
    "commissionValue" REAL NOT NULL,
    "notes" TEXT,
    "convertedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_referrals_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "affiliate_referrals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "affiliate_referrals_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "affiliate_clicks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_commissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "paymentId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_commissions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "affiliate_commissions_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "affiliate_referrals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "affiliate_commissions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "affiliate_payments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "method" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "referenceCode" TEXT,
    "transactionId" TEXT,
    "receipt" TEXT,
    "processedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_payments_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_clicks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "source" TEXT,
    "campaign" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "conversionValue" REAL,
    "clickedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "affiliate_clicks_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "affiliate_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "downloadUrl" TEXT,
    "previewUrl" TEXT,
    "category" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'pt',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "affiliate_materials_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_visa_requirements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "visaSubtype" TEXT,
    "visaCategory" TEXT NOT NULL,
    "requiresInterview" BOOLEAN NOT NULL DEFAULT true,
    "onlineApplication" BOOLEAN NOT NULL DEFAULT false,
    "transitVisa" BOOLEAN NOT NULL DEFAULT false,
    "maxStayDuration" TEXT,
    "requiredDocuments" JSONB NOT NULL,
    "processingTime" TEXT NOT NULL,
    "fees" JSONB NOT NULL,
    "eligibilityCriteria" JSONB NOT NULL,
    "commonPitfalls" JSONB NOT NULL,
    "successTips" JSONB NOT NULL,
    "governmentLinks" JSONB NOT NULL,
    "consulateInfo" JSONB NOT NULL,
    "medicalExamRequired" BOOLEAN NOT NULL DEFAULT false,
    "biometricsRequired" BOOLEAN NOT NULL DEFAULT false,
    "apostilleRequired" BOOLEAN NOT NULL DEFAULT false,
    "translationRequired" BOOLEAN NOT NULL DEFAULT false,
    "validLanguages" JSONB NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_visa_requirements" ("commonPitfalls", "country", "eligibilityCriteria", "fees", "governmentLinks", "id", "isActive", "lastUpdated", "processingTime", "requiredDocuments", "successTips", "visaSubtype", "visaType") SELECT "commonPitfalls", "country", "eligibilityCriteria", "fees", "governmentLinks", "id", "isActive", "lastUpdated", "processingTime", "requiredDocuments", "successTips", "visaSubtype", "visaType" FROM "visa_requirements";
DROP TABLE "visa_requirements";
ALTER TABLE "new_visa_requirements" RENAME TO "visa_requirements";
CREATE UNIQUE INDEX "visa_requirements_country_visaType_visaSubtype_key" ON "visa_requirements"("country", "visaType", "visaSubtype");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_likes_userId_postId_key" ON "blog_post_likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_bookmarks_userId_postId_key" ON "blog_post_bookmarks"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_url_key" ON "news_sources"("url");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_subscribers_phone_key" ON "whatsapp_subscribers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "social_configs_platform_key" ON "social_configs"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "social_comments_platform_externalId_key" ON "social_comments"("platform", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_email_key" ON "affiliates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_referralCode_key" ON "affiliates"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_commissions_referralId_key" ON "affiliate_commissions"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_payments_referenceCode_key" ON "affiliate_payments"("referenceCode");
