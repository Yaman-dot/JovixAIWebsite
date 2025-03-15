"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define translations
const translations = {
  en: {
    // Header
    "Jovix": "Jovix",
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
  },
  ar: {
    // Header
    "Jovix": "Jovix",
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
    "Contact our team of experts to discuss how our AI solutions can address your specific needs and challenges.":
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

