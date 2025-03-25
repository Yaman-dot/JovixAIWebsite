"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define translations
const translations = {
  en: {
    // Header
    "AI Vision": "JovixAI",
    JovixAI: "JovixAI",
    "Your New Website Name": "JovixAI",
    Home: "Home",
    Services: "Services",
    Demos: "Demos",
    Blog: "Blog",
    Portfolio: "Portfolio",
    Contact: "Contact",
    "Switch language": "Switch language",
    "Toggle theme": "Toggle theme",
    "Toggle menu": "Toggle menu",
    "Sign In": "Sign In",
    Admin: "Admin",

    // Hero Section
    "Advanced AI Solutions for": "Advanced AI Solutions for",
    "Object Detection": "Object Detection",
    and: "and",
    "Text-to-Speech": "Text-to-Speech",
    "Transforming industries with cutting-edge artificial intelligence models that see, understand, and speak with human-like precision.":
      "Transforming industries with cutting-edge artificial intelligence models that see, understand, and speak with human-like precision.",
    "Try Our Demos": "Try Our Demos",
    "Explore Services": "Explore Services",

    // Services Section
    "Our AI Services": "Our AI Services",
    "Cutting-edge AI solutions designed to transform your business operations and customer experiences.":
      "Cutting-edge AI solutions designed to transform your business operations and customer experiences.",
    "Object Detection Models": "Object Detection Models",
    "Advanced AI models that can identify and track objects in images and video streams with high accuracy.":
      "Advanced AI models that can identify and track objects in images and video streams with high accuracy.",
    "Text-to-Speech Solutions": "Text-to-Speech Solutions",
    "Natural-sounding voice synthesis technology that converts written text into lifelike speech.":
      "Natural-sounding voice synthesis technology that converts written text into lifelike speech.",
    "Custom AI Integration": "Custom AI Integration",
    "Tailored AI solutions integrated seamlessly into your existing systems and workflows.":
      "Tailored AI solutions integrated seamlessly into your existing systems and workflows.",
    "Real-time Processing": "Real-time Processing",
    "High-performance AI processing for time-sensitive applications with minimal latency.":
      "High-performance AI processing for time-sensitive applications with minimal latency.",
    "Learn more": "Learn more",

    // Demo Section
    "Experience Our AI in Action": "Experience Our AI in Action",
    "Try our interactive demos to see the power and precision of our AI models firsthand.":
      "Try our interactive demos to see the power and precision of our AI models firsthand.",
    "Object Detection Demo": "Object Detection Demo",
    "Upload an image and watch our AI identify objects in real-time.":
      "Upload an image and watch our AI identify objects in real-time.",
    "Text-to-Speech Demo": "Text-to-Speech Demo",
    "Convert your text into natural-sounding speech with our advanced AI models.":
      "Convert your text into natural-sounding speech with our advanced AI models.",
    "Try Demo": "Try Demo",

    // Blog Section
    "Latest Insights": "Latest Insights",
    "Stay updated with the latest trends, research, and applications in AI technology.":
      "Stay updated with the latest trends, research, and applications in AI technology.",
    "Read more": "Read more",
    "View All Articles": "View All Articles",

    // Portfolio Section
    "Our Portfolio": "Our Portfolio",
    "Explore our successful AI implementations across various industries and use cases.":
      "Explore our successful AI implementations across various industries and use cases.",
    "View All Projects": "View All Projects",

    // Contact CTA Section
    "Ready to Transform Your Business with AI?": "Ready to Transform Your Business with AI?",
    "Contact our team of experts to discuss how our AI solutions can address your specific needs and challenges.":
      "Contact our team of experts to discuss how our AI solutions can address your specific needs and challenges.",
    "Get in Touch": "Get in Touch",

    // Footer
    "Transforming industries with cutting-edge AI solutions for object detection and text-to-speech.":
      "Transforming industries with cutting-edge AI solutions for object detection and text-to-speech.",
    "Quick Links": "Quick Links",
    "Contact Us": "Contact Us",
    "Stay Updated": "Stay Updated",
    "Subscribe to our newsletter for the latest AI insights and updates.":
      "Subscribe to our newsletter for the latest AI insights and updates.",
    "All rights reserved.": "All rights reserved.",
    "Privacy Policy": "Privacy Policy",
    "Terms of Service": "Terms of Service",
    Sitemap: "Sitemap",

    // Newsletter
    "Enter your email": "Enter your email",
    Subscribe: "Subscribe",
    "Subscribing...": "Subscribing...",
    "Thank you for subscribing!": "Thank you for subscribing!",

    // Contact Page
    "Have questions about our AI solutions? Get in touch with our team of experts.":
      "Have questions about our AI solutions? Get in touch with our team of experts.",
    "Send Us a Message": "Send Us a Message",
    "Fill out the form below and we'll get back to you as soon as possible.":
      "Fill out the form below and we'll get back to you as soon as possible.",
    "Full Name": "Full Name",
    "Email Address": "Email Address",
    "Company Name": "Company Name",
    Subject: "Subject",
    Message: "Message",
    "Sending...": "Sending...",
    "Send Message": "Send Message",
    "Message Sent!": "Message Sent!",
    "Thank you for reaching out. Our team will review your message and get back to you shortly.":
      "Thank you for reaching out. Our team will review your message and get back to you shortly.",
    "Send Another Message": "Send Another Message",
    "Contact Information": "Contact Information",
    "Reach out to us directly using the information below.": "Reach out to us directly using the information below.",
    Email: "Email",
    Phone: "Phone",
    Office: "Office",
    "Business Hours": "Business Hours",

    // Authentication
    "Sign in to your account": "Sign in to your account",
    "Create an account": "Create an account",
    "Enter your credentials to access your account": "Enter your credentials to access your account",
    "Fill in the form below to create your account": "Fill in the form below to create your account",
    Password: "Password",
    "Forgot password?": "Forgot password?",
    "Remember me": "Remember me",
    "Signing in...": "Signing in...",
    "Don't have an account?": "Don't have an account?",
    "Sign up": "Sign up",
    "Already have an account?": "Already have an account?",
    "Confirm Password": "Confirm Password",
    "I agree to the": "I agree to the",
    "terms and conditions": "terms and conditions",
    "Creating account...": "Creating account...",
    "Create Account": "Create Account",
    "Or continue with": "Or continue with",

    // Chat Bot
    "AI Assistant": "AI Assistant",
    "Thinking...": "Thinking...",
    "Type your message...": "Type your message...",

    // User Profile
    "My Profile": "My Profile",
    "Sign Out": "Sign Out",
    "Profile Information": "Profile Information",
    "Update your personal information and public profile": "Update your personal information and public profile",
    Security: "Security",
    "Change Password": "Change Password",
    "Update your password to keep your account secure": "Update your password to keep your account secure",
    "Current Password": "Current Password",
    "New Password": "New Password",
    "Confirm New Password": "Confirm New Password",
    "Update Password": "Update Password",
    "Updating...": "Updating...",
    "Notification Preferences": "Notification Preferences",
    "Manage how and when you receive notifications": "Manage how and when you receive notifications",
    "Notification settings will be available soon.": "Notification settings will be available soon.",
    "Save Changes": "Save Changes",
    "Saving...": "Saving...",

    // Role Management
    "Manage User Roles": "Manage User Roles",
    "Assign roles to control user access and permissions": "Assign roles to control user access and permissions",
    "Role Management": "Role Management",
    "Assign administrative roles to users. Be careful as this grants significant permissions.":
      "Assign administrative roles to users. Be careful as this grants significant permissions.",
    "Current Role": "Current Role",
    "New Role": "New Role",
    "No Change": "No Change",
    "The role is already set to this value": "The role is already set to this value",
    "Role Updated": "Role Updated",
    "User role updated to": "User role updated to",
    "User Roles": "User Roles",
  },
  ar: {
    // Header
    "AI Vision": "جوفيكس للذكاء الاصطناعي",
    JovixAI: "جوفيكس للذكاء الاصطناعي",
    "Your New Website Name": "جوفيكس للذكاء الاصطناعي",
    Home: "الرئيسية",
    Services: "الخدمات",
    Demos: "العروض التوضيحية",
    Blog: "المدونة",
    Portfolio: "معرض الأعمال",
    Contact: "اتصل بنا",
    "Switch language": "تغيير اللغة",
    "Toggle theme": "تبديل السمة",
    "Toggle menu": "تبديل القائمة",
    "Sign In": "تسجيل الدخول",
    Admin: "المسؤول",

    // Hero Section
    "Advanced AI Solutions for": "حلول ذكاء اصطناعي متقدمة لـ",
    "Object Detection": "كشف الأجسام",
    and: "و",
    "Text-to-Speech": "تحويل النص إلى كلام",
    "Transforming industries with cutting-edge artificial intelligence models that see, understand, and speak with human-like precision.":
      "تحويل الصناعات باستخدام نماذج ذكاء اصطناعي متطورة ترى وتفهم وتتحدث بدقة تشبه الإنسان.",
    "Try Our Demos": "جرب عروضنا التوضيحية",
    "Explore Services": "استكشف الخدمات",

    // Services Section
    "Our AI Services": "خدمات الذكاء الاصطناعي لدينا",
    "Cutting-edge AI solutions designed to transform your business operations and customer experiences.":
      "حلول ذكاء اصطناعي متطورة مصممة لتحويل عمليات أعمالك وتجارب العملاء.",
    "Object Detection Models": "نماذج كشف الأجسام",
    "Advanced AI models that can identify and track objects in images and video streams with high accuracy.":
      "نماذج ذكاء اصطناعي متقدمة يمكنها تحديد وتتبع الأجسام في الصور وتدفقات الفيديو بدقة عالية.",
    "Text-to-Speech Solutions": "حلول تحويل النص إلى كلام",
    "Natural-sounding voice synthesis technology that converts written text into lifelike speech.":
      "تقنية توليف صوت طبيعي تحول النص المكتوب إلى كلام واقعي.",
    "Custom AI Integration": "تكامل الذكاء الاصطناعي المخصص",
    "Tailored AI solutions integrated seamlessly into your existing systems and workflows.":
      "حلول ذكاء اصطناعي مخصصة متكاملة بسلاسة في أنظمتك وسير عملك الحالية.",
    "Real-time Processing": "المعالجة في الوقت الفعلي",
    "High-performance AI processing for time-sensitive applications with minimal latency.":
      "معالجة ذكاء اصطناعي عالية الأداء للتطبيقات الحساسة للوقت مع أقل تأخير.",
    "Learn more": "اقرأ المزيد",

    // Demo Section
    "Experience Our AI in Action": "جرب الذكاء الاصطناعي لدينا في العمل",
    "Try our interactive demos to see the power and precision of our AI models firsthand.":
      "جرب عروضنا التوضيحية التفاعلية لرؤية قوة ودقة نماذج الذكاء الاصطناعي لدينا بشكل مباشر.",
    "Object Detection Demo": "عرض توضيحي لكشف الأجسام",
    "Upload an image and watch our AI identify objects in real-time.":
      "قم بتحميل صورة وشاهد الذكاء الاصطناعي لدينا يحدد الأجسام في الوقت الفعلي.",
    "Text-to-Speech Demo": "عرض توضيحي لتحويل النص إلى كلام",
    "Convert your text into natural-sounding speech with our advanced AI models.":
      "حول نصك إلى كلام طبيعي باستخدام نماذج الذكاء الاصطناعي المتقدمة لدينا.",
    "Try Demo": "جرب العرض التوضيحي",

    // Blog Section
    "Latest Insights": "أحدث الرؤى",
    "Stay updated with the latest trends, research, and applications in AI technology.":
      "ابق على اطلاع بأحدث الاتجاهات والأبحاث والتطبيقات في تكنولوجيا الذكاء الاصطناعي.",
    "Read more": "اقرأ المزيد",
    "View All Articles": "عرض جميع المقالات",

    // Portfolio Section
    "Our Portfolio": "معرض أعمالنا",
    "Explore our successful AI implementations across various industries and use cases.":
      "استكشف تطبيقات الذكاء الاصطناعي الناجحة لدينا عبر مختلف الصناعات وحالات الاستخدام.",
    "View All Projects": "عرض جميع المشاريع",

    // Contact CTA Section
    "Ready to Transform Your Business with AI?": "هل أنت مستعد لتحويل عملك باستخدام الذكاء الاصطناعي؟",
    "Contact our team of experts to discuss how can address your specific needs and challenges.":
      "اتصل بفريق الخبراء لدينا لمناقشة كيف يمكن لحلول الذكاء الاصطناعي لدينا تلبية احتياجاتك وتحدياتك المحددة.",
    "Get in Touch": "تواصل معنا",

    // Footer
    "Transforming industries with cutting-edge AI solutions for object detection and text-to-speech.":
      "تحويل الصناعات باستخدام حلول ذكاء اصطناعي متطورة لكشف الأجسام وتحويل النص إلى كلام.",
    "Quick Links": "روابط سريعة",
    "Contact Us": "اتصل بنا",
    "Stay Updated": "ابق على اطلاع",
    "Subscribe to our newsletter for the latest AI insights and updates.":
      "اشترك في نشرتنا الإخبارية للحصول على أحدث رؤى وتحديثات الذكاء الاصطناعي.",
    "All rights reserved.": "جميع الحقوق محفوظة.",
    "Privacy Policy": "سياسة الخصوصية",
    "Terms of Service": "شروط الخدمة",
    Sitemap: "خريطة الموقع",

    // Newsletter
    "Enter your email": "أدخل بريدك الإلكتروني",
    Subscribe: "اشترك",
    "Subscribing...": "جاري الاشتراك...",
    "Thank you for subscribing!": "شكرا لاشتراكك!",

    // Contact Page
    "Have questions about our AI solutions? Get in touch with our team of experts.":
      "هل لديك أسئلة حول حلول الذكاء الاصطناعي لدينا؟ تواصل مع فريق الخبراء لدينا.",
    "Send Us a Message": "أرسل لنا رسالة",
    "Fill out the form below and we'll get back to you as soon as possible.":
      "املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.",
    "Full Name": "الاسم الكامل",
    "Email Address": "عنوان البريد الإلكتروني",
    "Company Name": "اسم الشركة",
    Subject: "الموضوع",
    Message: "الرسالة",
    "Sending...": "جاري الإرسال...",
    "Send Message": "إرسال الرسالة",
    "Message Sent!": "تم إرسال الرسالة!",
    "Thank you for reaching out. Our team will review your message and get back to you shortly.":
      "شكرا للتواصل معنا. سيقوم فريقنا بمراجعة رسالتك والرد عليك قريبا.",
    "Send Another Message": "إرسال رسالة أخرى",
    "Contact Information": "معلومات الاتصال",
    "Reach out to us directly using the information below.": "تواصل معنا مباشرة باستخدام المعلومات أدناه.",
    Email: "البريد الإلكتروني",
    Phone: "الهاتف",
    Office: "المكتب",
    "Business Hours": "ساعات العمل",

    // Authentication
    "Sign in to your account": "تسجيل الدخول إلى حسابك",
    "Create an account": "إنشاء حساب",
    "Enter your credentials to access your account": "أدخل بيانات اعتماد للوصول إلى حسابك",
    "Fill in the form below to create your account": "املأ النموذج أدناه لإنشاء حسابك",
    Password: "كلمة المرور",
    "Forgot password?": "نسيت كلمة المرور؟",
    "Remember me": "تذكرني",
    "Signing in...": "جاري تسجيل الدخول...",
    "Don't have an account?": "ليس لديك حساب؟",
    "Sign up": "التسجيل",
    "Already have an account?": "لديك حساب بالفعل؟",
    "Confirm Password": "تأكيد كلمة المرور",
    "I agree to the": "أوافق على",
    "terms and conditions": "الشروط والأحكام",
    "Creating account...": "جاري إنشاء الحساب...",
    "Create Account": "إنشاء حساب",
    "Or continue with": "أو المتابعة باستخدام",

    // Chat Bot
    "AI Assistant": "مساعد الذكاء الاصطناعي",
    "Thinking...": "جاري التفكير...",
    "Type your message...": "اكتب رسالتك...",

    // User Profile
    "My Profile": "ملفي الشخصي",
    "Sign Out": "تسجيل الخروج",
    "Profile Information": "معلومات الملف الشخصي",
    "Update your personal information and public profile": "تحديث معلوماتك الشخصية وملفك العام",
    Security: "الأمان",
    "Change Password": "تغيير كلمة المرور",
    "Update your password to keep your account secure": "قم بتحديث كلمة المرور للحفاظ على أمان حسابك",
    "Current Password": "كلمة المرور الحالية",
    "New Password": "كلمة المرور الجديدة",
    "Confirm New Password": "تأكيد كلمة المرور الجديدة",
    "Update Password": "تحديث كلمة المرور",
    "Updating...": "جاري التحديث...",
    "Notification Preferences": "تفضيلات الإشعارات",
    "Manage how and when you receive notifications": "إدارة كيفية ووقت تلقي الإشعارات",
    "Notification settings will be available soon.": "ستكون إعدادات الإشعارات متاحة قريبًا.",
    "Save Changes": "حفظ التغييرات",
    "Saving...": "جاري الحفظ...",

    // Role Management
    "Manage User Roles": "إدارة أدوار المستخدمين",
    "Assign roles to control user access and permissions": "تعيين الأدوار للتحكم في وصول المستخدمين والصلاحيات",
    "Role Management": "إدارة الأدوار",
    "Assign administrative roles to users. Be careful as this grants significant permissions.":
      "تعيين أدوار إدارية للمستخدمين. كن حذرًا لأن هذا يمنح صلاحيات كبيرة.",
    "Current Role": "الدور الحالي",
    "New Role": "الدور الجديد",
    "No Change": "لا تغيير",
    "The role is already set to this value": "الدور مضبوط بالفعل على هذه القيمة",
    "Role Updated": "تم تحديث الدور",
    "User role updated to": "تم تحديث دور المستخدم إلى",
    "User Roles": "أدوار المستخدمين",
  },
}

// Create context
type TranslationContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Provider component
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en")

  // Translation function
  const t = (key: string): string => {
    if (!translations[language as keyof typeof translations]) {
      return key
    }

    return translations[language as keyof typeof translations][key as keyof (typeof translations)["en"]] || key
  }

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>
}

// Hook for using the translation context
export const useTranslation = () => useContext(TranslationContext)

